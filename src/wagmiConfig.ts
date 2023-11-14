import {
	Chain,
	configureChains,
	createConfig,
	readContract,
} from '@wagmi/core';
import { arbitrum, mainnet, optimism } from '@wagmi/core/chains';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { configDotenv } from 'dotenv';
import { Address, encodeAbiParameters } from 'viem';
import { endpointAbi } from './abis';
import { lzEndpointLookup } from './constants';
import { ChainId, Lookup } from './types';
import { logger } from './utils/logger';

export const nonceLookup: Lookup<number, Lookup<Address, bigint>> = {};
export const getInboundNonce = async ({
	srcLzId,
	srcAddress,
	chainId,
}: {
	srcLzId: number;
	srcAddress: Address;
	chainId: ChainId;
}): Promise<bigint> => {
	if (nonceLookup?.[srcLzId]?.[srcAddress] == undefined) {
		const inboundNonce = await readContract({
			address: lzEndpointLookup[ChainId.ARBITRUM],
			abi: endpointAbi,
			functionName: 'getInboundNonce',
			args: [
				srcLzId,
				encodeAbiParameters(
					[{ name: 'srcDcntEth', type: 'address' }],
					[srcAddress],
				),
			],
			chainId,
		});
		nonceLookup[srcLzId] = nonceLookup[srcLzId] || {};
		// @ts-ignore
		nonceLookup[srcLzId][srcAddress] = inboundNonce;
	}
	// @ts-ignore
	nonceLookup[srcLzId][srcAddress] += 1n;
	// @ts-ignore
	return nonceLookup[srcLzId][srcAddress];
};
const wagmiChainLookup: Record<ChainId, Chain> = {
	[ChainId.ETHEREUM]: mainnet,
	[ChainId.ARBITRUM]: arbitrum,
	[ChainId.OPTIMISM]: optimism,
};
export const getChainName = (c: ChainId) => viemChainLookup[c].name;
export const viemChainLookup: Record<ChainId, Chain> = {} as Record<
	ChainId,
	Chain
>;
export type GlueConfig = {
	chains: {
		name: string;
		rpc: string;
		id: ChainId;
	}[];
};
export const wagmiConfig = async (config: GlueConfig) => {
	configDotenv();
	logger.info('configuring wagmi');
	const defaultChains = config.chains.map(({ id }) => wagmiChainLookup[id]);
	const rpcLookup: Record<ChainId, string> = config.chains.reduce(
		(acc, { id, rpc }) => {
			acc[id] = rpc;
			return acc;
		},
		{} as Record<ChainId, string>,
	);

	// @ts-ignore
	const { chains, publicClient } = configureChains(defaultChains, [
		jsonRpcProvider({
			rpc: ({ id, name }) => {
				const rpc = rpcLookup[id as ChainId];
				console.log(name, 'rpc', rpc);
				return {
					http: rpc,
				};
			},
		}),
	]);

	chains.forEach((chain) => {
		viemChainLookup[chain.id as ChainId] = chain;
	});

	createConfig({
		autoConnect: true,
		publicClient,
	});
};
