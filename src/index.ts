#!/usr/bin/env node

import { Command } from 'commander';
import { version } from '../package.json';
import { schedule } from './commands/schedule';

const program = new Command();

program
	.name('cdns')
	.description('a cli tool to automatically update cloudflare dns records')
	.version(version);

program.command('schedule').description('schedule a new configuration').action(schedule);

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
