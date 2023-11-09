'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.getIPAddress = exports.CloudflareApiClient = void 0;
const axios_1 = __importDefault(require('axios'));
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
async function getIPAddress() {
	const { data } = await axios_1.default.get('https://checkip.amazonaws.com');
	return data.trim();
}
exports.getIPAddress = getIPAddress;
