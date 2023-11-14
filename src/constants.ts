import { Address } from 'viem';
import { ChainId, LzId } from './types';

export const lzLightNodeLookup: Record<ChainId, Address> = {
	[ChainId.ETHEREUM]: '0x4d73adb72bc3dd368966edd0f0b2148401a178e2',
	[ChainId.ARBITRUM]: '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2',
	[ChainId.OPTIMISM]: '0x4D73AdB72bC3DD368966edD0f0b2148401A178E2',
};
export const lzEndpointLookup: Record<ChainId, Address> = {
	[ChainId.ETHEREUM]: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
	[ChainId.ARBITRUM]: '0x3c2269811836af69497E5F486A85D7316753cf62',
	[ChainId.OPTIMISM]: '0x3c2269811836af69497E5F486A85D7316753cf62',
};

export const lzIdLookup: Record<ChainId, LzId> = {
	[ChainId.ETHEREUM]: LzId.ETHEREUM,
	[ChainId.ARBITRUM]: LzId.ARBITRUM,
	[ChainId.OPTIMISM]: LzId.OPTIMISM,
};

export const chainIdLookupFromLzId: Record<LzId, ChainId> = {
	[LzId.ETHEREUM]: ChainId.ETHEREUM,
	[LzId.ARBITRUM]: ChainId.ARBITRUM,
	[LzId.OPTIMISM]: ChainId.OPTIMISM,
};
