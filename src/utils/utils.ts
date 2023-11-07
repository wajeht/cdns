import axios, { AxiosInstance } from 'axios';

export async function getIPAddress(): Promise<string> {
	const { data } = await axios.get('https://checkip.amazonaws.com');
	return data;
}

export class CloudflareApiClient {
	private axiosInstance: AxiosInstance;

	constructor(apiToken: string, email: string) {
		this.axiosInstance = axios.create({
			baseURL: 'https://api.cloudflare.com/client/v4',
			headers: {
				'X-Auth-Email': email,
				Authorization: `Bearer ${apiToken}`,
				'Content-Type': 'application/json',
			},
		});
	}

	async getZoneByName(zoneName: string) {
		const response = await this.axiosInstance.get(`/zones?name=${zoneName}&status=active`);
		return response.data;
	}

	async getDnsRecords(zoneId: string) {
		const response = await this.axiosInstance.get(`/zones/${zoneId}/dns_records?type=A`);
		return response.data;
	}
}

const apiToken = '';
const email = '';
const zoneName = '';

async function main() {
	const cloudflareApi = new CloudflareApiClient(apiToken, email);

	const zoneInfo = await cloudflareApi.getZoneByName(zoneName);
	if (zoneInfo.result.length === 0) {
		console.log('Zone not found.');
		return;
	}

	const zoneId = zoneInfo.result[0].id;
	const dnsRecords = await cloudflareApi.getDnsRecords(zoneId);

	console.log(dnsRecords);
}

main();
