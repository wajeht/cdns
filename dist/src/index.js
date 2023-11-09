#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./database/db");
const commander_1 = require("commander");
const add_1 = require("./commands/add");
const log_1 = require("./commands/log");
const stop_1 = require("./commands/stop");
const child_process_1 = require("child_process");
const package_json_1 = require("../package.json");
const status_1 = require("./commands/status");
const program = new commander_1.Command();
program
    .name('cdns')
    .description('a cli tool to automatically update cloudflare dns records')
    .version(package_json_1.version);
program
    .command('add')
    .description('add a new configuration')
    .option('-i, --interactive', 'interactive mode')
    .option('-e, --cloudflare_email <string>', 'cloudflare auth email')
    .option('-a, --cloudflare_api_token <string>', 'cloudflare api token')
    .option('-z, --zone_name <string>', 'the zone which holds the record')
    .option('-p, --ip_address <string>', 'the ip address of current server')
    .option('-f, --frequency <number>', 'the frequency of the update')
    .action(async (option) => await (0, add_1.add)(option));
program
    .command('status')
    .description('status of cdns')
    .action(async () => await (0, status_1.status)());
program.command('log').description('view log of cdns process').action(log_1.log);
program.command('stop').description('stop cdns process').action(stop_1.stop);
program
    .command('schedule')
    .description('schedule auto update action')
    .action(async () => {
    const configuration = await db_1.db.configuration.findFirst();
    if (!configuration) {
        console.error('No configuration found');
        return process.exit(1);
    }
    (0, child_process_1.spawn)(`./src/scripts/start.sh`, {
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
