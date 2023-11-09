'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.add = void 0;
const db_1 = require('../database/db');
const utils_1 = require('../utils');
const prompts_1 = require('@inquirer/prompts');
async function add(params) {
	let { cloudflare_email, cloudflare_api_token, zone_name, ip_address, frequency } = params;
	let sure = false;
	while (!sure) {
		if (params.interactive) {
			if (!cloudflare_email) {
				cloudflare_email = await (0, prompts_1.input)({
					message: 'Enter your cloudflare cloudflare_email address',
					validate: (value) => value.length !== 0,
				});
			}
			if (!cloudflare_api_token) {
				cloudflare_api_token = await (0, prompts_1.input)({
					message: 'Enter your cloudflare access token',
					validate: (value) => value.length !== 0,
				});
			}
			if (!zone_name) {
				zone_name = await (0, prompts_1.input)({
					message: 'Enter zone_name',
					validate: (value) => value.length !== 0,
				});
			}
			if (!ip_address) {
				const current_ip_address = await (0, utils_1.getIPAddress)();
				ip_address = await (0, prompts_1.input)({
					message: 'Enter ip_address',
					validate: (value) => value.length !== 0,
					default: current_ip_address,
				});
			}
			if (!frequency) {
				frequency = await (0, prompts_1.input)({
					message: 'Enter frequency',
					validate: (value) => value.length !== 0,
					default: '60',
				});
			}
		}
		if (!cloudflare_email || !cloudflare_api_token || !zone_name || !ip_address || !frequency) {
			const requiredParams = {
				cloudflare_email,
				cloudflare_api_token,
				zone_name,
				ip_address,
				frequency,
			};
			// @ts-ignore
			const missingParams = Object.keys(requiredParams).filter((param) => !requiredParams[param]);
			console.error('Missing required parameters:', missingParams.join(', '));
			return process.exit(1);
		}
		console.table([{ cloudflare_email, cloudflare_api_token, zone_name, ip_address, frequency }]);
		sure =
			(await (0, prompts_1.input)({
				message: 'Are you sure these are the correct information? (y/n)',
				validate: (value) => value === 'y' || value === 'n',
			})) === 'y';
		if (!sure) {
			const modify = await (0, prompts_1.input)({
				message:
					'What do you want to change? \nemail (e), cloudflare_api_token (a), zone_name (z), ip_address (p), frequency (f)?',
				validate: (value) => ['e', 'a', 'z', 'r', 'f'].includes(value) === true,
			});
			cloudflare_email = modify === 'e' ? '' : cloudflare_email;
			cloudflare_api_token = modify === 'a' ? '' : cloudflare_api_token;
			zone_name = modify === 'z' ? '' : zone_name;
			ip_address = modify === 'p' ? '' : ip_address;
			frequency = modify === 'f' ? '' : frequency;
		}
	}
	await db_1.db.configuration
		.upsert({
			where: {
				zone_name,
			},
			update: {
				cloudflare_email,
				cloudflare_api_token,
				ip_address,
				frequency: parseInt(frequency) || 60,
			},
			create: {
				cloudflare_email,
				cloudflare_api_token,
				zone_name,
				ip_address,
				frequency: parseInt(frequency) || 60,
			},
		})
		.then((res) => {
			console.table([res]);
			console.log('The above credentials has been added successfully!');
		})
		.catch((_err) => {
			console.error('Something went wrong while adding credentials!');
		});
	return process.exit(0);
}
exports.add = add;
