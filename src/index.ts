#!/usr/bin/env node

import { db } from './database/db';
import { Command } from 'commander';
import { add } from './commands/add';
import { log } from './commands/log';
import { stop } from './commands/stop';
import { spawn } from 'child_process';
import { version } from '../package.json';
import { status } from './commands/status';

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
	.command('status')
	.description('status of cdns')
	.action(async () => await status());

program.command('log').description('view log of cdns process').action(log);
program.command('stop').description('stop cdns process').action(stop);

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

		spawn(`./src/scripts/start.sh`, {
			shell: true,
			stdio: 'inherit',
			env: process.env,
		});
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
