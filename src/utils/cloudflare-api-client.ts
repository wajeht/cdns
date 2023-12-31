import { AxiosInstance, AxiosResponse } from 'axios';

export interface ZoneInfo {
	result: { id: string }[];
}

export interface CloudflareApi {
	getZoneByName(zoneName: string): Promise<ZoneInfo>;
	getDnsRecords(zoneId: string): Promise<Record<string, unknown>>;
	updateContent(
		zoneId: string,
		recordId: string,
		content: string,
	): Promise<Record<string, unknown>>;
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

	async getDnsRecords(zoneId: string): Promise<Record<string, unknown>> {
		const response: AxiosResponse<Record<string, unknown>> = await this.axiosInstance.get(
			`/zones/${zoneId}/dns_records`,
		);
		return response.data;
	}

	async updateContent(
		zoneId: string,
		recordId: string,
		content: string,
	): Promise<Record<string, unknown>> {
		const response: AxiosResponse<Record<string, unknown>> = await this.axiosInstance.patch(
			`/zones/${zoneId}/dns_records/${recordId}`,
			{
				content,
			},
		);
		return response.data;
	}
}
