import { spawn, exec } from 'child_process';

export async function stop() {
	exec(`pm2 list`, (error, stdout, stderr) => {
		if (error) {
			console.log(error);
			return process.exit(1);
		}

		if (!stdout.includes('cdns')) {
			console.log('cdns is not running.');
			return process.exit(1);
		}

		if (stderr) {
			console.log(stderr);
			return process.exit(1);
		}

		console.log('x');
		spawn(`pm2 stop cdns && pm2 delete cdns && pm2 save --force`, {
			shell: true,
			stdio: 'inherit',
			env: process.env,
		});
	});
}
