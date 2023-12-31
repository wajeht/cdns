import cron from 'node-cron';
import { db } from '../database/db';
import axios, { AxiosError } from 'axios';
import {
	getIPAddress,
	ZoneInfo,
	CloudflareApi,
	CloudflareApiClient,
	timeToCron,
	alertToDiscord,
} from '../utils';

async function schedule() {
	const configuration = await db.configuration.findFirst();

	if (!configuration) {
		console.error('no configuration found');

		return process.exit(1);
	}

	const cronExpression = timeToCron(configuration.frequency);

	console.log(`scheduling cron for id: ${configuration.id}!`);

	cron.schedule(cronExpression, async () => {
		console.log(`cron was start for id: ${configuration.id}!`);

		const axiosInstance = axios.create({
			baseURL: 'https://api.cloudflare.com/client/v4',
			headers: {
				'X-Auth-Email': configuration.cloudflare_email,
				Authorization: `Bearer ${configuration.cloudflare_api_token}`,
				'Content-Type': 'application/json',
			},
		});

		let currentIpAddress: string = '';

		try {
			console.log('fetching to check current ip address...');
			currentIpAddress = (await getIPAddress()).trim();
			console.log('done fetching to check current ip address!');
		} catch (error) {
			console.error('cannot grab current ip address!');
			return process.exit(1);
		}

		const cloudflareApi: CloudflareApi = new CloudflareApiClient(axiosInstance);

		let zoneInfo: ZoneInfo = {} as ZoneInfo;

		try {
			console.log('fetching cloudflare zone info...');
			zoneInfo = await cloudflareApi.getZoneByName(configuration.zone_name);
			console.log('done fetching cloudflare zone info!');
		} catch (error) {
			console.error('cannot grab zoneInfo!');
			// @ts-ignore
			console.table((error as AxiosError)?.response?.data?.errors);

			return process.exit(1);
		}

		if (!zoneInfo.result[0]) {
			console.error('Zone info does not exit!');
			// @ts-ignore
			console.table((error as AxiosError)?.response?.data?.errors);

			return process.exit(1);
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let dnsRecords: any = {};

		try {
			console.log('fetching dns records...');
			dnsRecords = await cloudflareApi.getDnsRecords(zoneInfo.result[0].id);
			console.log('done fetching dns records!');
			dnsRecords = dnsRecords.result.filter((r: { type: string }) => r.type === 'A');
		} catch (error) {
			console.error('cannot grab dnsRecords!');
			// @ts-ignore
			console.table((error as AxiosError)?.response?.data?.errors);

			return process.exit(1);
		}

		for (const r of dnsRecords) {
			if (r.content !== currentIpAddress) {
				try {
					console.log(`updating dns records for id: ${r.id}!`);
					await cloudflareApi.updateContent(zoneInfo.result[0].id, r.id, currentIpAddress);
					console.log(`done updating dns records for id: ${r.id}!`);
					await alertToDiscord(r.content, currentIpAddress);
				} catch (error) {
					console.error(`something went wrong while updating record for id: ${r.id}!`);
					// @ts-ignore
					console.table((error as AxiosError)?.response?.data?.errors);

					return process.exit(1);
				}
			} else {
				console.log(`no need to update dns records for id: ${r.id}!`);

				return process.exit(1);
			}
		}
		console.log(`done cron process for id: ${configuration.id}!`);
	});
	console.log(`cron has been scheduled for id: ${configuration.id}!`);
}

schedule();
