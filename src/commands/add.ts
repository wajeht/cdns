import { db } from '../database/db';
import { getIPAddress } from '../utils';
import { input } from '@inquirer/prompts';

type Params = {
	interactive?: boolean;
	cloudflare_email: string;
	cloudflare_api_token: string;
	zone_name: string;
	ip_address: string;
	frequency: string;
};

export async function add(params: Params) {
	let { cloudflare_email, cloudflare_api_token, zone_name, ip_address, frequency } = params;

	let sure = false;

	while (!sure) {
		if (params.interactive) {
			if (!cloudflare_email) {
				cloudflare_email = await input({
					message: 'Enter your cloudflare cloudflare_email address',
					validate: (value) => value.length !== 0,
				});
			}

			if (!cloudflare_api_token) {
				cloudflare_api_token = await input({
					message: 'Enter your cloudflare access token',
					validate: (value) => value.length !== 0,
				});
			}

			if (!zone_name) {
				zone_name = await input({
					message: 'Enter zone_name',
					validate: (value) => value.length !== 0,
				});
			}

			if (!ip_address) {
				const current_ip_address = await getIPAddress();
				ip_address = await input({
					message: 'Enter ip_address',
					validate: (value) => value.length !== 0,
					default: current_ip_address,
				});
			}

			if (!frequency) {
				frequency = await input({
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
			(await input({
				message: 'Are you sure these are the correct information? (y/n)',
				validate: (value) => value === 'y' || value === 'n',
			})) === 'y';

		if (!sure) {
			const modify = await input({
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

	await db.configuration
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
		.then((res: unknown) => {
			console.table([res]);
			console.log('The above credentials has been added successfully!');
		})
		.catch((_err: unknown) => {
			console.error('Something went wrong while adding credentials!');
		});

	return process.exit(0);
}
