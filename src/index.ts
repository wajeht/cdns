#!/usr/bin/env node

import { Command } from "commander";
import { version } from "../package.json";

const program = new Command();

program
  .name('cdns')
  .description('A CLI tool to automatically edit Cloudflare DNS records.')
  .version(version);

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
