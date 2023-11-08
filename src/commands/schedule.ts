import db from '../database/db';
import axios from 'axios';
import { getIPAddress, ZoneInfo, CloudflareApi, CloudflareApiClient } from '../utils/utils';

export async function schedule() {
	const configuration = await db.configuration.findFirst();

	if (!configuration) {
		console.log();
		console.error('no configuration found');
		console.log();
		return process.exit(1);
	}

	const axiosInstance = axios.create({
		baseURL: 'https://api.cloudflare.com/client/v4',
		headers: {
			'X-Auth-Email': configuration.cloudflare_email,
			Authorization: `Bearer ${configuration.cloudflare_api_token}`,
			'Content-Type': 'application/json',
		},
	});

	const currentIpAddress = (await getIPAddress()).trim();
	const cloudflareApi: CloudflareApi = new CloudflareApiClient(axiosInstance);

	const zoneInfo: ZoneInfo = await cloudflareApi.getZoneByName(configuration.zone_name);

	if (!zoneInfo.result[0]) {
		console.log();
		console.error('Zone info does not exit');
		console.log();
		return process.exit(1);
	}

	let dnsRecords = await cloudflareApi.getDnsRecords(zoneInfo.result[0].id);
	dnsRecords = dnsRecords.result.filter((r: { type: string }) => r.type === 'A');

	for (const r of dnsRecords) {
		if (r.content !== currentIpAddress) {
			await cloudflareApi.updateContent(zoneInfo.result[0].id, r.id, currentIpAddress);
		} else {
			console.log();
			console.log('No need to update');
			console.log();
		}
	}

	return process.exit(0);
}
