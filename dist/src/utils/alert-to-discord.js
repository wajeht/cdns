"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alertToDiscord = void 0;
const format_custom_date_1 = require("./format-custom-date");
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../database/db");
async function alertToDiscord(fromIpAddress, toIpAddress) {
    const configuration = await db_1.db.configuration.findFirst();
    if (!configuration) {
        console.error('no configuration found');
        return false;
    }
    if (!configuration.discord_webhook_url) {
        console.error('no discord webhook url found');
        return false;
    }
    const embeds = [
        {
            title: '',
            color: 5174599,
            footer: {
                text: `📅 ${(0, format_custom_date_1.formatCustomDate)(new Date())}`,
            },
            fields: [
                {
                    name: 'CDNS Update!',
                    value: `You're ip address has been updated from ${fromIpAddress} to ${toIpAddress}!`,
                },
            ],
        },
    ];
    const data = JSON.stringify({ embeds });
    const headers = { 'Content-Type': 'application/json' };
    try {
        await axios_1.default.post(configuration.discord_webhook_url, data, { headers });
    }
    catch (error) {
        // @ts-ignore
        console.error(error?.response?.data?.message);
        return false;
    }
    return true;
}
exports.alertToDiscord = alertToDiscord;
