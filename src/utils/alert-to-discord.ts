import { formatCustomDate } from './format-custom-date';
import axios, { AxiosError } from 'axios';
import { db } from '../database/db';

export async function alertToDiscord(fromIpAddress: string, toIpAddress: string): Promise<boolean> {
	const configuration = await db.configuration.findFirst();

	if (!configuration) {
		console.error('no configuration found');
		return false;
	}

	if (!configuration.discord_webhook_url) {
		console.error('no discord webhook url found');
		return false;
	}

	const embeds = [
		{
			title: '',
			color: 5174599,
			footer: {
				text: `📅 ${formatCustomDate(new Date())}`,
			},
			fields: [
				{
					name: 'CDNS Update!',
					value: `You're ip address has been updated from ${fromIpAddress} to ${toIpAddress}!`,
				},
			],
		},
	];

	const data = JSON.stringify({ embeds });
	const headers = { 'Content-Type': 'application/json' };

	try {
		await axios.post(configuration.discord_webhook_url, data, { headers });
	} catch (error) {
		// @ts-ignore
		console.error((error as AxiosError)?.response?.data?.message);
		return false;
	}

	return true;
}
