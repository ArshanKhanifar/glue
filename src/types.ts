export enum ChainId {
	ETHEREUM = 1,
	ARBITRUM = 42161,
	OPTIMISM = 10,
	ZORA = 7777777,
}

export enum LzId {
	ETHEREUM = 101,
	ARBITRUM = 110,
	OPTIMISM = 111,
	ZORA = 195,
}

export type Lookup<A extends string | number | symbol, B> = {
	[key in A]?: B;
};
