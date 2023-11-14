export enum ChainId {
	ETHEREUM = 1,
	ARBITRUM = 42161,
	OPTIMISM = 10,
}

export enum LzId {
	ETHEREUM = 101,
	ARBITRUM = 110,
	OPTIMISM = 111,
}

export type Lookup<A extends string | number | symbol, B> = {
	[key in A]?: B;
};
