'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const os_1 = __importDefault(require('os'));
const path_1 = __importDefault(require('path'));
const fs_1 = __importDefault(require('fs'));
const child_process_1 = require('child_process');
const cdnsPath = path_1.default.resolve(path_1.default.join(os_1.default.homedir(), 'cdns'));
if (!fs_1.default.existsSync(cdnsPath)) {
	fs_1.default.mkdirSync(cdnsPath, { recursive: true });
}
const databasePath = path_1.default.resolve(
	path_1.default.join(os_1.default.homedir(), 'cdns', 'cdns.db'),
);
if (!fs_1.default.existsSync(databasePath)) {
	fs_1.default.writeFileSync(databasePath, '');
}
const envPath = path_1.default.resolve(path_1.default.join(process.cwd(), '.env'));
if (!fs_1.default.existsSync(envPath)) {
	const envContent = `DATABASE_URL="file:${databasePath}"\nNODE_ENV="production"`;
	fs_1.default.writeFileSync(envPath, envContent);
}
if (fs_1.default.existsSync(envPath)) {
	const envContent = fs_1.default.readFileSync(envPath, 'utf-8');
	const desiredContent = `DATABASE_URL="file:${databasePath}"\nNODE_ENV="production"`;
	if (envContent.trim() !== desiredContent.trim()) {
		fs_1.default.writeFileSync(envPath, desiredContent, 'utf-8');
		console.log('File content updated.');
	} else {
		console.log('File content is already correct.');
	}
}
(0, child_process_1.exec)('npm run db:migrate:deploy', (error, stdout, stderr) => {
	if (error) console.log(error);
	if (stdout) console.log(stdout);
	if (stderr) console.log(stderr);
});
(0, child_process_1.exec)('npm run db:generate', (error, stdout, stderr) => {
	if (error) console.log(error);
	if (stdout) console.log(stdout);
	if (stderr) console.log(stderr);
});
