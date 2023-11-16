import { readContract, waitForTransaction } from '@wagmi/core';
import {
	createTestClient,
	encodeFunctionData,
	encodePacked,
	getAddress,
	Hex,
	http,
	parseUnits,
} from 'viem';
import { endpointAbi } from './abis/endpointAbi';
import {
	chainIdLookupFromLzId,
	lzEndpointLookup,
	lzIdLookup,
} from './constants';
import { getInboundNonce } from './getInboundNonce';
import { ChainId, LzId } from './types';
import { logger } from './utils/logger';
import { showBalance } from './utils/web3util';
import { viemChainLookup } from './wagmiConfig';

const extractAddress = (packet: string, index: number) =>
	getAddress(`0x${packet.substring(index, index + 40)}`);

const extractUint16 = (packet: string, index: number): number =>
	Number(`0x${packet.substring(index, index + 4)}`);

const SOURCE_MSG_SENDER_INDEX = 484;
const SOURCE_UA_INDEX = 150;
const DESTINATION_UA_INDEX = 194;

export const transformPacketToDst = (packet: string) => {
	const postSender = '00000000000000000000000000000000000a11ce';
	const fromEndIndex = SOURCE_MSG_SENDER_INDEX + 40;
	const firstPart = packet.substring(
		SOURCE_MSG_SENDER_INDEX - 250,
		SOURCE_MSG_SENDER_INDEX,
	);
	const secondPart = packet.substring(fromEndIndex);
	const preSender = extractAddress(packet, SOURCE_MSG_SENDER_INDEX);

	logger.debug(
		JSON.stringify({
			firstPart,
			preSender,
			postSender,
			secondPart,
		}),
	);

	const deliveredPayload: Hex = `0x${firstPart}${preSender.substring(
		2,
	)}${secondPart}`;
	return deliveredPayload;
};

export const receivePacket = async ({
	packet,
	srcChain,
	txHash,
}: {
	packet: string;
	txHash: Hex;
	srcChain: ChainId;
}) => {
	const dstChainIdIndex = 190;
	const dstChain =
		chainIdLookupFromLzId[extractUint16(packet, dstChainIdIndex) as LzId];
	const srcUa = extractAddress(packet, SOURCE_UA_INDEX);
	const dstUa = extractAddress(packet, DESTINATION_UA_INDEX);
	const deliveredPayload = transformPacketToDst(packet);

	const defaultLibAddress = await readContract({
		address: lzEndpointLookup[dstChain],
		abi: endpointAbi,
		functionName: 'defaultReceiveLibraryAddress',
		chainId: dstChain,
	});

	const srcLzId = lzIdLookup[srcChain];

	const testClient = createTestClient({
		chain: viemChainLookup[dstChain],
		mode: 'anvil',
		transport: http(),
	});

	if (!testClient) {
		throw Error("couldn't get wallet client");
	}

	await testClient.impersonateAccount({ address: defaultLibAddress });

	logger.info(
		JSON.stringify({
			srcUa,
			dstUa,
		}),
	);

	const srcPath = encodePacked(['address', 'address'], [srcUa, dstUa]);
	const dstLzEndpointConfig = {
		address: lzEndpointLookup[dstChain],
		abi: endpointAbi,
		chainId: dstChain,
	};

	const inboundNonce = await getInboundNonce({
		testClient,
		chainId: dstChain,
		srcUa,
		dstUa,
		srcLzId,
		lzEndpointConfig: dstLzEndpointConfig,
	});

	await showBalance({
		address: defaultLibAddress,
		chainId: dstChain,
		name: 'defaultLibAddress before sending',
	});

	logger.debug('JS Side Packet', packet);
	logger.debug('\npayload were delivering', deliveredPayload);
	logger.debug('\nsrcLzId', srcLzId);
	logger.debug('encoding', srcPath);
	logger.debug('destination address', dstUa);
	logger.debug('nonce', inboundNonce);
	logger.debug('dstGas', BigInt(2e6));

	const checkHasStoredPayload = async () =>
		readContract({
			...dstLzEndpointConfig,
			functionName: 'hasStoredPayload',
			args: [srcLzId, srcPath],
		});

	const tx = await testClient.sendUnsignedTransaction({
		from: defaultLibAddress,
		to: lzEndpointLookup[dstChain],
		data: encodeFunctionData({
			abi: endpointAbi,
			functionName: 'receivePayload',
			args: [
				srcLzId,
				srcPath,
				dstUa,
				inboundNonce + 1n,
				BigInt(2e6),
				deliveredPayload,
			],
		}),
		gas: BigInt(10e6),
		maxFeePerGas: parseUnits('10', 9),
	});

	logger.info('sent msg', tx);

	const receipt = await waitForTransaction({
		hash: tx,
		chainId: dstChain,
	});

	if (await checkHasStoredPayload()) {
		logger.error(
			'something went wrong delivering',
			receipt.transactionHash,
			receipt.status,
		);
	} else {
		logger.succeed('delivered', receipt.transactionHash, receipt.status);
	}
};
