#!/usr/bin/env node

import { Command } from '@commander-js/extra-typings';
import { version } from '../package.json';
import { schedule } from './commands/schedule';

const program = new Command();

program
	.name('cdns')
	.description('a cli tool to automatically update cloudflare dns records')
	.version(version);

program
	.command('add')
	.description('add a new configuration')
	.option('-e, --email <string>', 'cloudflare email')
	.option('-k, --key <string>', 'cloudflare api key')
	.action(({ email, key }) => {
		console.log(email, key);
	});

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
