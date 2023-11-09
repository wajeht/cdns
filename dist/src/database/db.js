"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const client_1 = require("@prisma/client");
exports.db = global.prisma ||
    new client_1.PrismaClient({
        log: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing'
            ? ['query', 'error', 'warn']
            : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}
