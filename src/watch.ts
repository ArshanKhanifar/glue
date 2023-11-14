import { watchContractEvent } from '@wagmi/core';
import { packetAbi } from './abis';
import { lzLightNodeLookup } from './constants';
import { receivePacket } from './receivePacket';
import { ChainId } from './types';
import { logger } from './utils/logger';
import { getChainName } from './wagmiConfig';

export const watch = async (srcChain: ChainId) => {
	logger.info(`Watching events on ${getChainName(srcChain)}...`);

	watchContractEvent(
		{
			address: lzLightNodeLookup[srcChain],
			abi: packetAbi,
			eventName: 'Packet',
			chainId: srcChain,
		},
		async (log) => {
			logger.info('received packet!');
			const [{ data: packet, transactionHash }] = log;
			await receivePacket({ packet, srcChain, txHash: transactionHash });
		},
	);
};
