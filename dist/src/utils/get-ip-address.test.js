'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const axios_1 = __importDefault(require('axios'));
const vitest_1 = require('vitest');
const get_ip_address_1 = require('./get-ip-address');
vitest_1.vi.mock('axios');
(0, vitest_1.describe)('getIPAddress ', () => {
	(0, vitest_1.it)('should call axios and get ip address', async () => {
		axios_1.default.get.mockResolvedValue({ data: '27.0.0.1' });
		const address = await (0, get_ip_address_1.getIPAddress)();
		(0, vitest_1.expect)(address).toBe('27.0.0.1');
	});
});
