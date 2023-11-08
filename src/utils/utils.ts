import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface ZoneInfo {
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

export async function getIPAddress(): Promise<string> {
	const { data } = await axios.get('https://checkip.amazonaws.com');
	return data.trim();
}
