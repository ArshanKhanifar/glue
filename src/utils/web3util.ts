import { fetchBalance } from '@wagmi/core';
import fs from 'node:fs';
import { Address } from 'viem';
import { ChainId } from '../types';
import { logger } from './logger';

export const getDeployedAddresses = (): any => {
	const base = '/Users/arshankhanifar/decentxyz/onchain-integrations/broadcast';
	return JSON.parse(fs.readFileSync(`${base}/deployedAddresses.json`, 'utf-8'));
};
export const showBalance = async ({
	name,
	chainId,
	address,
}: {
	chainId: ChainId;
	address: Address;
	name?: string;
}) => {
	name = name ?? address;

	logger.info(
		`${name} balance `,
		(
			await fetchBalance({
				address,
				chainId,
			})
		).formatted,
	);
};
