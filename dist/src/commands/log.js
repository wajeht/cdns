'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.log = void 0;
const child_process_1 = require('child_process');
function log() {
	(0, child_process_1.spawn)(`pm2 log cdns`, {
		shell: true,
		stdio: 'inherit',
		env: process.env,
	});
}
exports.log = log;
