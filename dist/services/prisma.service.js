"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("@/utils/winston");
const client_1 = require("@prisma/client");
let prisma;
try {
    if (process.env.NODE_ENV === 'production') {
        prisma = new client_1.PrismaClient();
    }
    else if (process.env.STAGE === 'TEST') {
        prisma = new client_1.PrismaClient({
            datasourceUrl: process.env.TEST_DATABASE_URL,
        });
    }
    else {
        if (!global.prisma) {
            global.prisma = new client_1.PrismaClient();
        }
        prisma = global.prisma;
    }
}
catch (err) {
    winston_1.logger.error(err);
}
// @ts-ignore
exports.default = prisma;
