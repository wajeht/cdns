"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIPAddress = void 0;
const axios_1 = __importDefault(require("axios"));
async function getIPAddress() {
    const { data } = await axios_1.default.get('https://checkip.amazonaws.com');
    return data.trim();
}
exports.getIPAddress = getIPAddress;
