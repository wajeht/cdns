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

		const stopped = spawn(`pm2 stop cdns && pm2 delete cdns && pm2 save --force`, {
			shell: true,
			stdio: 'pipe',
			env: process.env,
		});

		stopped.stdout.on('data', (data) => {
			const output = data.toString();
			if (!output.includes('cdns')) {
				console.log('stopped cdns process!');
				return process.exit(0);
			}
		});

		stopped.stderr.on('data', (data) => {
			const output = data.toString();
			console.log('something went wrong while stopping cdns process', output);
			return process.exit(1);
		});
	});
}
