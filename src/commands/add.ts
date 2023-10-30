import db from '../database/db';

type Params = {
	interactive?: boolean;
	email: string;
	key: string;
	zone: string;
	record: string;
	frequency: string;
};

export async function add({ email, key, zone, record, frequency, interactive }: Params) {
	if (interactive) {
		console.log();
		console.error('Interactive mode is not implemented yet');
		console.log();
		return process.exit(1);
	}

	if (!email || !key || !zone || !record || !frequency) {
		console.log();
		console.error('Missing required parameters');
		console.log();
		return process.exit(1);
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
