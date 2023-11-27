import { Chain, configureChains, createConfig, sepolia } from '@wagmi/core';
import {
	arbitrum,
	mainnet,
	optimism,
	zora,
	zoraTestnet,
} from '@wagmi/core/chains';
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc';
import { configDotenv } from 'dotenv';
import { ChainId } from './types';

const wagmiChainLookup: Record<ChainId, Chain> = {
	[ChainId.ETHEREUM]: mainnet,
	[ChainId.ARBITRUM]: arbitrum,
	[ChainId.OPTIMISM]: optimism,
	[ChainId.ZORA]: zora,
	[ChainId.ZORA_GOERLI]: zoraTestnet,
	[ChainId.SEPOLIA]: sepolia,
};
export const viemChainLookup: Record<ChainId, Chain> = {} as Record<
	ChainId,
	Chain
>;

export const getChainName = (c: ChainId) => viemChainLookup[c].name;

export type GlueConfig = {
	chains: {
		name: string;
		rpc: string;
		id: ChainId;
	}[];
};
export const wagmiConfig = async (config: GlueConfig) => {
	configDotenv();
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
