"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncateAllTables = truncateAllTables;
const prisma_service_1 = __importDefault(require("@/services/prisma.service"));
const winston_1 = require("./winston");
function truncateAllTables() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV === 'production' || process.env.STAGE !== 'TEST') {
            throw new Error('This function can only be used in test environment');
        }
        try {
            // Disable triggers
            yield prisma_service_1.default.$queryRaw `SET session_replication_role = 'replica';`;
            // Get all table names
            const tables = yield prisma_service_1.default.$queryRawUnsafe(`
        SELECT tablename FROM pg_tables WHERE schemaname = 'public';
      `);
            // Truncate each table
            for (const { tablename } of tables.filter((table) => !table.tablename.startsWith('_'))) {
                yield prisma_service_1.default.$queryRawUnsafe(`TRUNCATE TABLE ${tablename} CASCADE;`);
            }
            // Re-enable triggers
            yield prisma_service_1.default.$queryRawUnsafe(`SET session_replication_role = 'origin';`);
            winston_1.logger.info('All tables truncated successfully');
        }
        catch (error) {
            winston_1.logger.error('Error truncating tables:', error);
        }
        finally {
            yield prisma_service_1.default.$disconnect();
        }
    });
}
