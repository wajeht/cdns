#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';
import { schedule } from './commands/schedule';
import { add } from './commands/add';
import db from './database/db';
import { exec } from 'child_process';

const program = new Command();

program
	.name('cdns')
	.description('a cli tool to automatically update cloudflare dns records')
	.version(version);

program
	.command('add')
	.description('add a new configuration')
	.option('-i, --interactive', 'interactive mode')
	.option('-e, --cloudflare_email <string>', 'cloudflare auth email')
	.option('-a, --cloudflare_api_token <string>', 'cloudflare api token')
	.option('-z, --zone_name <string>', 'the zone which holds the record')
	.option('-p, --ip_address <string>', 'the ip address of current server')
	.option('-f, --frequency <number>', 'the frequency of the update')
	.action(async (option) => await add(option));

program
	.command('schedule')
	.description('schedule auto update action')
	.action(async () => {
		const configuration = await db.configuration.findFirst();

		if (!configuration) {
			console.log();
			console.error('No configuration found');
			console.log();
			return process.exit(1);
		}
	});

if (process.argv.length < 3) {
	console.log();
	console.log('****************');
	console.log('*              *');
	console.log('*     CDNS     *');
	console.log('*              *');
	console.log('****************');
	console.log();
	program.help();
}

program.parse(process.argv);
