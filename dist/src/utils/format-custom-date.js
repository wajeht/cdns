"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCustomDate = void 0;
function formatCustomDate(date) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short',
    };
    const formattedDate = date.toLocaleString('en-US', options);
    return formattedDate;
}
exports.formatCustomDate = formatCustomDate;
