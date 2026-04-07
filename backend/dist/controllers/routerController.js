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
exports.getConnectedDevices = exports.getRouterStatus = void 0;
const routerSync_1 = require("../utils/routerSync");
const User_1 = __importDefault(require("../models/User"));
const getRouterConfig = (admin) => ({
    routerUrl: admin.routerUrl || 'http://192.168.1.1',
    routerUsername: admin.routerUsername || 'admin',
    routerPasswordRaw: admin.routerPassword || ''
});
const getRouterStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const admin = yield User_1.default.findById(adminId);
        if (!admin)
            return res.status(404).json({ message: 'Admin not found', success: false });
        const config = getRouterConfig(admin);
        const [signal, traffic, system] = yield Promise.all([
            routerSync_1.RouterSync.getSignalStatus(config),
            routerSync_1.RouterSync.getTrafficStats(config),
            routerSync_1.RouterSync.getSystemStatus(config)
        ]);
        res.json({
            signal,
            traffic,
            system,
            success: true
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});
exports.getRouterStatus = getRouterStatus;
const getConnectedDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const admin = yield User_1.default.findById(adminId);
        if (!admin)
            return res.status(404).json({ message: 'Admin not found', success: false });
        const config = getRouterConfig(admin);
        const devices = yield routerSync_1.RouterSync.getConnectedDevices(config);
        res.json({
            devices,
            success: true
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
});
exports.getConnectedDevices = getConnectedDevices;
