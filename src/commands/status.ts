import { db } from '../database/db';

export async function status() {
	const configuration = await db.configuration.findFirst();

	if (!configuration) {
		console.log();
		console.error('no configuration found');
		console.log();
		return process.exit(1);
	}

	console.table([configuration]);
}
