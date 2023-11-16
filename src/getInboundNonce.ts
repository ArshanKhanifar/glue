import {
	readContract,
	ReadContractConfig,
	waitForTransaction,
} from '@wagmi/core';
import {
	Address,
	encodeFunctionData,
	encodePacked,
	parseEther,
	parseUnits,
	TestClient,
} from 'viem';
import { endpointAbi } from './abis/endpointAbi';
import { lzEndpointLookup } from './constants';
import { ChainId } from './types';
import { logger } from './utils/logger';

export const clearPayload = async ({
	testClient,
	srcLzId,
	srcUa,
	dstUa,
	chainId,
}: {
	testClient: TestClient;
	srcLzId: number;
	srcUa: Address;
	dstUa: Address;
	chainId: ChainId;
}) => {
	const srcPath = encodePacked(['address', 'address'], [srcUa, dstUa]);
	const lzEndpoint = lzEndpointLookup[chainId];
	await testClient.setBalance({ address: dstUa, value: parseEther('2') });
	testClient.impersonateAccount({ address: dstUa });

	const hash = await testClient.sendUnsignedTransaction({
		from: dstUa,
		to: lzEndpoint,
		data: encodeFunctionData({
			abi: endpointAbi,
			functionName: 'forceResumeReceive',
			args: [srcLzId, srcPath],
		}),
		gas: BigInt(10e6),
		maxFeePerGas: parseUnits('10', 9),
	});

	logger.info('force resuming delivery...', hash);

	const receipt = await waitForTransaction({
		hash,
		chainId,
	});

	logger.info('▶️ resumed delivery', receipt.transactionHash, receipt.status);
};

export const getInboundNonce = async ({
	testClient,
	srcLzId,
	srcUa,
	dstUa,
	chainId,
	lzEndpointConfig,
}: {
	testClient: TestClient;
	srcLzId: number;
	srcUa: Address;
	dstUa: Address;
	chainId: ChainId;
	lzEndpointConfig: any;
}): Promise<bigint> => {
	const srcPath = encodePacked(['address', 'address'], [srcUa, dstUa]);

	const config: ReadContractConfig = {
		...lzEndpointConfig,
		functionName: 'getInboundNonce',
		args: [srcLzId, srcPath],
	};

	const inboundNonce = await readContract(config);

	const checkHasStoredPayload = async () =>
		readContract({
			...config,
			functionName: 'hasStoredPayload',
		});

	const hasStoredPayload = await checkHasStoredPayload();

	logger.succeed(
		`got nonce! ${inboundNonce}, hasStoredPayload: ${hasStoredPayload}`,
	);

	if (hasStoredPayload) {
		await clearPayload({ testClient, srcLzId, srcUa, dstUa, chainId });
		logger.info(`right after clearing ${await checkHasStoredPayload()}`);
	}

	return inboundNonce as bigint;
};
