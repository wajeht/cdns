"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const db_1 = require("../database/db");
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
async function schedule() {
    const configuration = await db_1.db.configuration.findFirst();
    if (!configuration) {
        console.error('no configuration found');
        return process.exit(1);
    }
    const cronExpression = (0, utils_1.timeToCron)(configuration.frequency);
    console.log(`scheduling cron for id: ${configuration.id}!`);
    node_cron_1.default.schedule(cronExpression, async () => {
        console.log(`cron was start for id: ${configuration.id}!`);
        const axiosInstance = axios_1.default.create({
            baseURL: 'https://api.cloudflare.com/client/v4',
            headers: {
                'X-Auth-Email': configuration.cloudflare_email,
                Authorization: `Bearer ${configuration.cloudflare_api_token}`,
                'Content-Type': 'application/json',
            },
        });
        let currentIpAddress = '';
        try {
            console.log('fetching to check current ip address...');
            currentIpAddress = (await (0, utils_1.getIPAddress)()).trim();
            console.log('done fetching to check current ip address!');
        }
        catch (error) {
            console.error('cannot grab current ip address!');
            return process.exit(1);
        }
        const cloudflareApi = new utils_1.CloudflareApiClient(axiosInstance);
        let zoneInfo = {};
        try {
            console.log('fetching cloudflare zone info...');
            zoneInfo = await cloudflareApi.getZoneByName(configuration.zone_name);
            console.log('done fetching cloudflare zone info!');
        }
        catch (error) {
            console.error('cannot grab zoneInfo!');
            // @ts-ignore
            console.table(error?.response?.data?.errors);
            return process.exit(1);
        }
        if (!zoneInfo.result[0]) {
            console.error('Zone info does not exit!');
            // @ts-ignore
            console.table(error?.response?.data?.errors);
            return process.exit(1);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let dnsRecords = {};
        try {
            console.log('fetching dns records...');
            dnsRecords = await cloudflareApi.getDnsRecords(zoneInfo.result[0].id);
            console.log('done fetching dns records!');
            dnsRecords = dnsRecords.result.filter((r) => r.type === 'A');
        }
        catch (error) {
            console.error('cannot grab dnsRecords!');
            // @ts-ignore
            console.table(error?.response?.data?.errors);
            return process.exit(1);
        }
        for (const r of dnsRecords) {
            if (r.content !== currentIpAddress) {
                try {
                    console.log(`updating dns records for id: ${r.id}!`);
                    await cloudflareApi.updateContent(zoneInfo.result[0].id, r.id, currentIpAddress);
                    console.log(`done updating dns records for id: ${r.id}!`);
                }
                catch (error) {
                    console.error(`something went wrong while updating record for id: ${r.id}!`);
                    // @ts-ignore
                    console.table(error?.response?.data?.errors);
                    return process.exit(1);
                }
            }
            else {
                console.log(`no need to update dns records for id: ${r.id}!`);
                return process.exit(1);
            }
        }
        console.log(`done cron process for id: ${configuration.id}!`);
    });
    console.log(`cron has been scheduled for id: ${configuration.id}!`);
}
schedule();
