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
import { endpointAbi } from './abis';
import {
	chainIdLookupFromLzId,
	lzEndpointLookup,
	lzIdLookup,
} from './constants';
import { ChainId, LzId } from './types';
import { logger } from './utils/logger';
import { showBalance } from './utils/web3util';
import { getInboundNonce, viemChainLookup } from './wagmiConfig';

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
	const secondPart = packet.substring(fromEndIndex, fromEndIndex + 1152);

	logger.debug({
		firstPart,
		postSender,
		secondPart,
	});

	const deliveredPayload: Hex = `0x${firstPart}${postSender}${secondPart}`;
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

	const inboundNonce = await getInboundNonce({
		chainId: dstChain,
		srcAddress: srcUa,
		srcLzId,
	});

	const testClient = createTestClient({
		chain: viemChainLookup[dstChain],
		mode: 'anvil',
		transport: http(),
	});

	if (!testClient) {
		throw Error("couldn't get wallet client");
	}

	await testClient.impersonateAccount({ address: defaultLibAddress });

	await showBalance({
		address: defaultLibAddress,
		chainId: dstChain,
		name: 'defaultLibAddress before sending',
	});

	const srcEncoding = encodePacked(['address', 'address'], [srcUa, dstUa]);

	logger.debug('JS Side Packet', packet);
	logger.debug('\npayload were delivering', deliveredPayload);
	logger.debug('\nsrcLzId', srcLzId);
	logger.debug('encoding', srcEncoding);
	logger.debug('destination address', dstUa);
	logger.debug('nonce', inboundNonce);
	logger.debug('dstGas', BigInt(2e6));

	const tx = await testClient.sendUnsignedTransaction({
		from: defaultLibAddress,
		to: lzEndpointLookup[dstChain],
		data: encodeFunctionData({
			abi: endpointAbi,
			functionName: 'receivePayload',
			args: [
				srcLzId,
				srcEncoding,
				dstUa,
				inboundNonce,
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

	logger.info('tx receipt', receipt.transactionHash, receipt.status);

	const receiver = getAddress(`0x${'0'.repeat(37)}b0b`);
	await showBalance({ address: receiver, chainId: dstChain, name: 'bob' });
};
