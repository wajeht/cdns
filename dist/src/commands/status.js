'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.status = void 0;
const db_1 = require('../database/db');
async function status() {
	const configuration = await db_1.db.configuration.findFirst();
	if (!configuration) {
		console.error('no configuration found');
		return process.exit(1);
	}
	console.table([configuration]);
	return process.exit(0);
}
exports.status = status;
