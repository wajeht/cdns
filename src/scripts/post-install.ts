import os from 'os';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

const cdnsPath = path.resolve(path.join(os.homedir(), 'cdns'));

if (!fs.existsSync(cdnsPath)) {
	fs.mkdirSync(cdnsPath, { recursive: true });
}

const databasePath = path.resolve(path.join(os.homedir(), 'cdns', 'cdns.db'));

if (!fs.existsSync(databasePath)) {
	fs.writeFileSync(databasePath, '');
}

const envPath = path.resolve(path.join(process.cwd(), '.env'));

if (!fs.existsSync(envPath)) {
	const envContent = `DATABASE_URL="file:${databasePath}"\nNODE_ENV="production"`;
	fs.writeFileSync(envPath, envContent);
}

if (fs.existsSync(envPath)) {
	const envContent = fs.readFileSync(envPath, 'utf-8');
	const desiredContent = `DATABASE_URL="file:${databasePath}"\nNODE_ENV="production"`;

	if (envContent.trim() !== desiredContent.trim()) {
		fs.writeFileSync(envPath, desiredContent, 'utf-8');
		console.log('File content updated.');
	} else {
		console.log('File content is already correct.');
	}
}

exec('npm run db:migrate:deploy', (error, stdout, stderr) => {
	if (error) console.log(error);
	if (stdout) console.log(stdout);
	if (stderr) console.log(stderr);
});

exec('npm run db:generate', (error, stdout, stderr) => {
	if (error) console.log(error);
	if (stdout) console.log(stdout);
	if (stderr) console.log(stderr);
});
