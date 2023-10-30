import db from '../database/db';

export async function schedule() {
	const configuration = await db.configuration.findFirst();

	if (!configuration) {
		console.log();
		console.error('no configuration found');
		console.log();
		return process.exit(1);
	}

	console.log();
	console.table([configuration]);
	console.log();
	return process.exit(0);
}
