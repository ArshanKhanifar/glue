import { Address } from 'viem';
import { ChainId, LzId } from './types';

export const lzLightNodeLookup: Record<ChainId, Address> = {
	[ChainId.ETHEREUM]: '0x4d73adb72bc3dd368966edd0f0b2148401a178e2',
	[ChainId.ARBITRUM]: '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2',
	[ChainId.OPTIMISM]: '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2',
	[ChainId.ZORA]: '0x38dE71124f7a447a01D67945a51eDcE9FF491251',
};
export const lzEndpointLookup: Record<ChainId, Address> = {
	[ChainId.ETHEREUM]: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
	[ChainId.ARBITRUM]: '0x3c2269811836af69497E5F486A85D7316753cf62',
	[ChainId.OPTIMISM]: '0x3c2269811836af69497E5F486A85D7316753cf62',
	[ChainId.ZORA]: '0xb6319cC6c8c27A8F5dAF0dD3DF91EA35C4720dd7',
};

export const lzIdLookup: Record<ChainId, LzId> = {
	[ChainId.ETHEREUM]: LzId.ETHEREUM,
	[ChainId.ARBITRUM]: LzId.ARBITRUM,
	[ChainId.OPTIMISM]: LzId.OPTIMISM,
	[ChainId.ZORA]: LzId.ZORA,
};

export const chainIdLookupFromLzId: Record<LzId, ChainId> = {
	[LzId.ETHEREUM]: ChainId.ETHEREUM,
	[LzId.ARBITRUM]: ChainId.ARBITRUM,
	[LzId.OPTIMISM]: ChainId.OPTIMISM,
	[LzId.ZORA]: ChainId.ZORA,
};