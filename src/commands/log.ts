import { spawn } from 'child_process';

export function log() {
	spawn(`pm2 log cdns`, {
		shell: true,
		stdio: 'inherit',
		env: process.env,
	});
}
