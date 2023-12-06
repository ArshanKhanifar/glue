export enum ChainId {
	ETHEREUM = 1,
	ARBITRUM = 42161,
	OPTIMISM = 10,
	AVALANCHE = 43114,
	FANTOM = 250,
	POLYGON = 137,
	ZORA = 7777777,
	ZORA_GOERLI = 999,
	BASE = 8453,
	SEPOLIA = 11155111,
}

export enum LzId {
	ETHEREUM = 101,
	ARBITRUM = 110,
	OPTIMISM = 111,
	AVALANCHE = 106,
	FANTOM = 112,
	POLYGON = 109,
	BASE = 184,
	ZORA = 195,
	SEPOLIA = 10161,
	ZORA_GOERLI = 10195,
}

export type Lookup<A extends string | number | symbol, B> = {
	[key in A]?: B;
};
