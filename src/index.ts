#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';
import { schedule } from './commands/schedule';
import { add } from './commands/add';

const program = new Command();

program
	.name('cdns')
	.description('a cli tool to automatically update cloudflare dns records')
	.version(version);

program
	.command('add')
	.description('add a new configuration')
	.option('-i, --interactive', 'interactive mode')
	.option('-e, --cloudflare-email <string>', 'cloudflare auth email')
	.option('-k, --cloudflare-api-token <string>', 'cloudflare api token')
	.option('-z, --zone-name <string>', 'the zone which holds the record')
	.option('-r, --dns-record <string>', 'the A record which will be updated')
	.option('-f, --frequency <number>', 'the frequency of the update')
	.action(async (option) => await add(option));

program.command('schedule').description('schedule auto update action').action(schedule);

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
