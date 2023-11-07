import db from '../database/db';
import { input } from '@inquirer/prompts';

type Params = {
	interactive?: boolean;
	cloudflare_email: string;
	cloudflare_api_token: string;
	zone_name: string;
	dns_record: string;
	frequency: string;
};

export async function add(params: Params) {
	let { cloudflare_email, cloudflare_api_token, zone_name, dns_record, frequency, interactive } =
		params;

	let sure = false;

	while (!sure) {
		if (interactive) {
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

			if (!dns_record) {
				dns_record = await input({
					message: 'Enter dns_record',
					validate: (value) => value.length !== 0,
				});
			}

			if (!frequency) {
				frequency = await input({
					message: 'Enter frequency',
					validate: (value) => value.length !== 0,
				});
			}
		}

		if (!cloudflare_email || !cloudflare_api_token || !zone_name || !dns_record || !frequency) {
			const requiredParams = {
				cloudflare_email,
				cloudflare_api_token,
				zone_name,
				dns_record,
				frequency,
			};

			const missingParams = Object.keys(requiredParams).filter((param) => !requiredParams[param]);
			console.log();
			console.error('Missing required parameters:', missingParams.join(', '));
			console.log();
			return process.exit(1);
		}

		console.table([{ cloudflare_email, cloudflare_api_token, zone_name, dns_record, frequency }]);

		sure =
			(await input({
				message: 'Are you sure these are the correct information? (y/n)',
				validate: (value) => value === 'y' || value === 'n',
			})) === 'y';

		if (!sure) {
			const modify = await input({
				message:
					'What do you want to change? \nemail (e), cloudflare_api_token (a), zone_name (z), dns_record (r), frequency (f)?',
				validate: (value) => ['e', 'k', 'z', 'r', 'f'].includes(value) === true,
			});

			cloudflare_email = modify === 'e' ? '' : cloudflare_email;
			cloudflare_api_token = modify === 'a' ? '' : cloudflare_api_token;
			zone_name = modify === 'z' ? '' : zone_name;
			dns_record = modify === 'r' ? '' : dns_record;
			frequency = modify === 'f' ? '' : frequency;
		}
	}

	await db.configuration
		.create({
			data: {
				cloudflare_email,
				cloudflare_api_token,
				zone_name,
				dns_record,
				frequency: parseInt(frequency) || 60,
			},
		})
		.then((res) => {
			console.log(res);
		});

	return process.exit(0);
}
