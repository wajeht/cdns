import { db } from '../database/db';
import { getIPAddress } from '../utils';
import { input } from '@inquirer/prompts';

type Params = {
	cloudflare_email: string;
	cloudflare_api_token: string;
	zone_name: string;
	ip_address: string;
	frequency: string;
	discord_webhook_url: string;
};

export async function update(params: Params) {
	const configuration = await db.configuration.findFirst();

	if (!configuration) {
		console.error('no configuration found');
		return process.exit(1);
	}

	let {
		cloudflare_email,
		cloudflare_api_token,
		zone_name,
		ip_address,
		frequency,
		discord_webhook_url,
	} = params;

	let sure = false;

	cloudflare_email = cloudflare_email ?? configuration.cloudflare_email;
	cloudflare_api_token = cloudflare_api_token ?? configuration.cloudflare_api_token;
	zone_name = zone_name ?? configuration.zone_name;
	ip_address = ip_address ?? configuration.ip_address;
	frequency = frequency ?? configuration.frequency;
	discord_webhook_url = discord_webhook_url ?? configuration.discord_webhook_url;

	while (!sure) {
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
				validate: function (value) {
					if (value.length === 0) return true;
					const parsedValue = parseInt(value);
					const isNumber = !isNaN(parsedValue) && parsedValue > 0;
					// prettier-ignore
					return value.length !== 0 && isNumber ? true : 'The frequency must be in minutes. For example, 60 for every hour.';
				},
				default: '60',
			});
		}

		if (!discord_webhook_url) {
			discord_webhook_url = await input({
				message: 'Enter discord webhook url (optional)',
			});
		}

		console.table([
			{
				cloudflare_email,
				cloudflare_api_token,
				zone_name,
				ip_address,
				frequency,
				discord_webhook_url,
			},
		]);

		sure =
			(await input({
				message: 'Are you sure these are the correct information? (y/n)',
				validate: (value) => value === 'y' || value === 'n',
			})) === 'y';

		if (!sure) {
			const modify = await input({
				message:
					'What do you want to change? \nemail (e), cloudflare_api_token (a), zone_name (z), ip_address (p), frequency (f), discord_webhook_url (d)?',
				validate: (value) => ['e', 'a', 'z', 'p', 'f', 'd'].includes(value) === true,
			});
			cloudflare_email = modify === 'e' ? '' : cloudflare_email;
			cloudflare_api_token = modify === 'a' ? '' : cloudflare_api_token;
			zone_name = modify === 'z' ? '' : zone_name;
			ip_address = modify === 'p' ? '' : ip_address;
			frequency = modify === 'f' ? '' : frequency;
			discord_webhook_url = modify === 'd' ? '' : discord_webhook_url;
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
				discord_webhook_url,
				frequency: parseInt(frequency) || 60,
			},
			create: {
				cloudflare_email,
				cloudflare_api_token,
				zone_name,
				ip_address,
				discord_webhook_url,
				frequency: parseInt(frequency) || 60,
			},
		})
		.then((res: unknown) => {
			console.table([res]);
			console.log('The above credentials has been updated successfully!');
		})
		.catch((_err: unknown) => {
			console.error('Something went wrong while updated credentials!');
		});

	return process.exit(0);
}
