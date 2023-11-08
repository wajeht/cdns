import cron from 'node-cron';
import axios, { AxiosError } from 'axios';
import { db } from '../database/db';
import { getIPAddress, ZoneInfo, CloudflareApi, CloudflareApiClient, timeToCron } from '../utils';

async function schedule() {
	const configuration = await db.configuration.findFirst();

	if (!configuration) {
		console.log();
		console.error('no configuration found');
		console.log();
		return process.exit(1);
	}

	const cronExpression = timeToCron(configuration.frequency);

	console.log(`scheduling cron for ${configuration.id}...`);
	cron.schedule(cronExpression, async () => {
		console.log(`cron was start for ${configuration.id}...`);
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
		} catch (error) {
			console.log();
			console.error('cannot grab current ip address!');
			return process.exit(1);
		}

		const cloudflareApi: CloudflareApi = new CloudflareApiClient(axiosInstance);

		let zoneInfo: ZoneInfo = {} as ZoneInfo;

		try {
			console.log('fetching cloudflare zone info...');
			zoneInfo = await cloudflareApi.getZoneByName(configuration.zone_name);
		} catch (error) {
			console.log();
			console.error('cannot grab zoneInfo!');
			// @ts-ignore
			console.table((error as AxiosError)?.response?.data?.errors);
			console.log();
			return process.exit(1);
		}

		if (!zoneInfo.result[0]) {
			console.log();
			console.error('Zone info does not exit!');
			// @ts-ignore
			console.table((error as AxiosError)?.response?.data?.errors);
			console.log();
			return process.exit(1);
		}

		let dnsRecords: any = {};

		try {
			console.log('fetching dns records...');
			dnsRecords = await cloudflareApi.getDnsRecords(zoneInfo.result[0].id);
			dnsRecords = dnsRecords.result.filter((r: { type: string }) => r.type === 'A');
		} catch (error) {
			console.log();
			console.error('cannot grab dnsRecords!');
			// @ts-ignore
			console.table((error as AxiosError)?.response?.data?.errors);
			console.log();
			return process.exit(1);
		}

		for (const r of dnsRecords) {
			if (r.content !== currentIpAddress) {
				try {
					console.log('updating dns records...');
					await cloudflareApi.updateContent(zoneInfo.result[0].id, r.id, currentIpAddress);
				} catch (error) {
					console.log();
					console.error('something went wrong while updating record!');
					// @ts-ignore
					console.table((error as AxiosError)?.response?.data?.errors);
					console.log();
					return process.exit(1);
				}
			} else {
				console.log();
				console.log('No need to update!');
				console.log();
				return process.exit(1);
			}
		}
	});
	console.log(`cron has been scheduled for ${configuration.id}...`);
}

schedule();
