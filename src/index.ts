#! /usr/bin/env node
import { Command } from 'commander';
import fs from 'node:fs';
import * as process from 'process';
import { logger } from './utils/logger';
import { packageJSON } from './utils/packageJson';
import { renderTitle } from './utils/renderTitle';
import { GlueConfig, wagmiConfig } from './wagmiConfig';
import { watch } from './watch';

const startWatching = async (config: GlueConfig) => {
	try {
		await wagmiConfig(config);
		config.chains.map((c) => watch(c.id));
	} catch (e) {
		logger.error('error reading config file', e);
		return;
	}
};

(async () => {
	renderTitle();
	const program = new Command();
	program
		.name('Glue')
		.description('Glues your forknets together 🫶🏼')
		.version(packageJSON.version, '-v, --version', 'display the version number')
		.argument('<config-file>', 'configuration file')
		.action(async (file) => {
			try {
				const content = fs.readFileSync(file, 'utf-8');
				const config: GlueConfig = JSON.parse(content);
				await startWatching(config);
			} catch (e) {
				logger.error('error reading config file', e);
				return;
			}
		});

	process.argv.push('glueConfig.json');
	program.parse();
})();
