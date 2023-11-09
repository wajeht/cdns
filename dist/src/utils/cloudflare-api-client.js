"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareApiClient = void 0;
class CloudflareApiClient {
    axiosInstance;
    constructor(axiosInstance) {
        this.axiosInstance = axiosInstance;
    }
    async getZoneByName(zoneName) {
        const response = await this.axiosInstance.get(`/zones?name=${zoneName}`);
        return response.data;
    }
    async getDnsRecords(zoneId) {
        const response = await this.axiosInstance.get(`/zones/${zoneId}/dns_records`);
        return response.data;
    }
    async updateContent(zoneId, recordId, content) {
        const response = await this.axiosInstance.patch(`/zones/${zoneId}/dns_records/${recordId}`, {
            content,
        });
        return response.data;
    }
}
exports.CloudflareApiClient = CloudflareApiClient;
