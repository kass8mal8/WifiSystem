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
exports.startExpiryJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const WifiUser_1 = __importDefault(require("../models/WifiUser"));
const routerSync_1 = require("../utils/routerSync");
const startExpiryJob = () => {
    // Run every minute
    node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const now = new Date();
            // Find active users who have expired and populate their admin info
            const expiredUsers = yield WifiUser_1.default.find({
                status: 'active',
                paymentExpiryDate: { $lt: now }
            }).populate('adminId');
            if (expiredUsers.length > 0) {
                console.log(`[Cron] Found ${expiredUsers.length} expired users. Syncing with router...`);
                for (const user of expiredUsers) {
                    // Cast adminId to any to access properties after population
                    const admin = user.adminId;
                    user.status = 'expired';
                    yield user.save();
                    // Construct config for the admin
                    const config = {
                        routerUrl: (admin === null || admin === void 0 ? void 0 : admin.routerUrl) || process.env.ROUTER_URL || 'http://192.168.1.1',
                        routerUsername: (admin === null || admin === void 0 ? void 0 : admin.routerUsername) || process.env.ROUTER_USERNAME || 'admin',
                        routerPasswordRaw: (admin === null || admin === void 0 ? void 0 : admin.routerPassword) || process.env.ROUTER_PASSWORD || ''
                    };
                    // Real Router Disconnect
                    try {
                        yield routerSync_1.RouterSync.syncUser(config, user);
                        console.log(`[Router] Successfully disabled access for MAC: ${user.macAddress} (User: ${user.name})`);
                    }
                    catch (err) {
                        console.error(`[Router Sync Error] Failed for user: ${user.name}`, err);
                    }
                }
            }
        }
        catch (error) {
            console.error('[Cron Error]', error);
        }
    }));
    console.log('[Cron] Expiry check job started (every minute)');
};
exports.startExpiryJob = startExpiryJob;
