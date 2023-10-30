import db from '../database/db';

export async function schedule() {
	await db.configuration
		.create({
			data: {
				email: 'test@test.com' + Math.random(),
				key: 'test',
			},
		})
		.then((res) => {
			console.log(res);
		});
}
