import db from '../database/db';
import { input } from '@inquirer/prompts';

type Params = {
	interactive?: boolean;
	email: string;
	key: string;
	zone: string;
	record: string;
	frequency: string;
};

export async function add(params: Params) {
	let { email, key, zone, record, frequency, interactive } = params;

	let sure = false;

	while (!sure) {
		if (interactive) {
			if (!email) {
				email = await input({
					message: 'Enter your cloudflare email address',
					validate: (value) => value.length !== 0,
				});
			}

			if (!key) {
				key = await input({
					message: 'Enter your cloudflare access token',
					validate: (value) => value.length !== 0,
				});
			}

			if (!zone) {
				zone = await input({
					message: 'Enter zone',
					validate: (value) => value.length !== 0,
				});
			}

			if (!record) {
				record = await input({
					message: 'Enter record',
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

		if (!email || !key || !zone || !record || !frequency) {
			console.log();
			console.error('Missing required parameters');
			console.log();
			return process.exit(1);
		}

		console.table([{ email, key, zone, record, frequency }]);

		sure =
			(await input({
				message: 'Are you sure these are the correct information? (y/n)',
				validate: (value) => value === 'y' || value === 'n',
			})) === 'y';

		if (!sure) {
			const modify = await input({
				message:
					'What do you want to change? \nemail (e), key (k), zone (z), record (r), frequency (f)?',
				validate: (value) => ['e', 'k', 'z', 'r', 'f'].includes(value) === true,
			});

			email = modify === 'e' ? '' : email;
			key = modify === 'k' ? '' : key;
			zone = modify === 'z' ? '' : zone;
			record = modify === 'r' ? '' : record;
			frequency = modify === 'f' ? '' : frequency;
		}
	}

	await db.configuration
		.create({
			data: {
				email,
				key,
				zone,
				record,
				frequency: parseInt(frequency) || 60,
			},
		})
		.then((res) => {
			console.log(res);
		});

	return process.exit(0);
}
