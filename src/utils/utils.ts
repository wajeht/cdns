import axios, { AxiosInstance, AxiosResponse } from 'axios';
import db from '../database/db';

interface ZoneInfo {
	result: { id: string }[];
}

export interface CloudflareApi {
	getZoneByName(zoneName: string): Promise<ZoneInfo>;
	getDnsRecords(zoneId: string): Promise<any>;
	updateContent(zoneId: string, recordId: string, content: string): Promise<any>;
}

export class CloudflareApiClient implements CloudflareApi {
	private axiosInstance: AxiosInstance;

	constructor(axiosInstance: AxiosInstance) {
		this.axiosInstance = axiosInstance;
	}

	async getZoneByName(zoneName: string): Promise<ZoneInfo> {
		const response: AxiosResponse<ZoneInfo> = await this.axiosInstance.get(
			`/zones?name=${zoneName}`,
		);
		return response.data;
	}

	async getDnsRecords(zoneId: string): Promise<any> {
		const response: AxiosResponse<any> = await this.axiosInstance.get(
			`/zones/${zoneId}/dns_records`,
		);
		return response.data;
	}

	async updateContent(zoneId: string, recordId: string, content: string): Promise<any> {
		const response: AxiosResponse<any> = await this.axiosInstance.patch(
			`/zones/${zoneId}/dns_records/${recordId}`,
			{
				content,
			},
		);
		return response.data;
	}
}

async function main() {
	const configuration = await db.configuration.findFirst();

	if (!configuration) {
		console.log();
		console.error('no configuration found');
		console.log();
		return process.exit(1);
	}

	console.log();
	console.table([configuration]);
	console.log();

	const cloudflare_email = '';
	const cloudflare_api_token = '';
	const zoneName = '';

	const axiosInstance = axios.create({
		baseURL: 'https://api.cloudflare.com/client/v4',
		headers: {
			'X-Auth-Email': cloudflare_email,
			Authorization: `Bearer ${cloudflare_api_token}`,
			'Content-Type': 'application/json',
		},
	});

	const cloudflareApi: CloudflareApi = new CloudflareApiClient(axiosInstance);
	const zoneInfo: ZoneInfo = await cloudflareApi.getZoneByName(zoneName);

	if (zoneInfo.result[0]) {
		let dnsRecords = await cloudflareApi.getDnsRecords(zoneInfo.result[0].id);
		dnsRecords = dnsRecords.result.filter((r: { type: string }) => r.type === 'A');

		const rids = dnsRecords.map((d: { id: string }) => d.id);

		for (const id of rids) {
			const x = await cloudflareApi.updateContent(zoneInfo.result[0].id, id, '50.26.13.170');
			console.log(x);
		}
	}
}

export async function getIPAddress(): Promise<string> {
	const { data } = await axios.get('https://checkip.amazonaws.com');
	return data.trim();
}
