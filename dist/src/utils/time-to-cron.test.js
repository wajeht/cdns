'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const vitest_1 = require('vitest');
const time_to_cron_js_1 = require('./time-to-cron.js');
(0, vitest_1.describe)('timeToCron', () => {
	(0, vitest_1.it)('converts seconds', () => {
		(0, vitest_1.expect)((0, time_to_cron_js_1.timeToCron)(0.1)).toBe('*/10 * * * * *');
		(0, vitest_1.expect)((0, time_to_cron_js_1.timeToCron)(0.03)).toBe('*/3 * * * * *');
		(0, vitest_1.expect)((0, time_to_cron_js_1.timeToCron)(0.3)).toBe('*/30 * * * * *');
	});
	(0, vitest_1.it)('converts less than 1 hour', () => {
		(0, vitest_1.expect)((0, time_to_cron_js_1.timeToCron)(30)).toBe('0 */30 * * * *');
	});
	(0, vitest_1.it)('converts less than 24 hours', () => {
		(0, vitest_1.expect)((0, time_to_cron_js_1.timeToCron)(90)).toBe('0 0 */1 * * *');
	});
	(0, vitest_1.it)('converts less than 7 days', () => {
		(0, vitest_1.expect)((0, time_to_cron_js_1.timeToCron)(4320)).toBe('0 0 0 */3 * *');
	});
	(0, vitest_1.it)('converts 7 days or more', () => {
		(0, vitest_1.expect)((0, time_to_cron_js_1.timeToCron)(10080)).toBe('0 0 0 ? * 1');
	});
	(0, vitest_1.it)('handles invalid input', () => {
		(0, vitest_1.expect)((0, time_to_cron_js_1.timeToCron)(-1)).toBe('Invalid input');
		(0, vitest_1.expect)((0, time_to_cron_js_1.timeToCron)(44640)).toBe('Invalid input');
	});
});
