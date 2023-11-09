import { db } from '../database/db';

export async function status() {
	const configuration = await db.configuration.findFirst();

	if (!configuration) {
		console.error('no configuration found');
		return process.exit(1);
	}

	console.table([configuration]);
	return process.exit(0);
}
