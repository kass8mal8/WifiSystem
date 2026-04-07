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
exports.updateUser = exports.deleteUser = exports.createUser = exports.getUsers = void 0;
const WifiUser_1 = __importDefault(require("../models/WifiUser"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
const User_1 = __importDefault(require("../models/User"));
const routerSync_1 = require("../utils/routerSync");
const getRouterConfig = (admin) => ({
    routerUrl: admin.routerUrl || 'http://192.168.1.1',
    routerUsername: admin.routerUsername || 'admin',
    routerPasswordRaw: admin.routerPassword || ''
});
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const users = yield WifiUser_1.default.find({ adminId }).sort({ createdAt: -1 });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUsers = getUsers;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const admin = yield User_1.default.findById(adminId);
        if (!admin)
            return res.status(404).json({ message: 'Admin not found' });
        const newUser = new WifiUser_1.default(Object.assign(Object.assign({}, req.body), { adminId, status: 'active' }));
        const savedUser = yield newUser.save();
        // Audit Log
        try {
            yield AuditLog_1.default.create({
                action: 'CREATE_USER',
                target: `${savedUser.name} (${savedUser.macAddress})`,
                performedBy: admin.name || admin.email,
                details: `Initial payment: ${savedUser.amountPaid} via ${savedUser.methodPaid}`,
            });
        }
        catch (logError) {
            console.error('[AuditLog Error]', logError);
        }
        let routerSyncWarning = null;
        try {
            const config = getRouterConfig(admin);
            yield routerSync_1.RouterSync.syncUser(config, savedUser);
        }
        catch (routerError) {
            routerSyncWarning = (routerError === null || routerError === void 0 ? void 0 : routerError.message) || 'Router sync failed after creating user.';
            console.error(`[Router] Create succeeded, but sync failed for ${savedUser.macAddress}: ${routerSyncWarning}`);
        }
        res.status(201).json(Object.assign(Object.assign({}, savedUser.toObject()), { routerSync: routerSyncWarning ? { success: false, message: routerSyncWarning } : { success: true } }));
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createUser = createUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const { id } = req.params;
        const admin = yield User_1.default.findById(adminId);
        if (!admin)
            return res.status(404).json({ message: 'Admin not found' });
        // Ensure the user belongs to the logged-in admin
        const user = yield WifiUser_1.default.findOneAndDelete({ _id: id, adminId });
        let routerSyncWarning = null;
        if (user) {
            // Audit Log
            try {
                yield AuditLog_1.default.create({
                    action: 'DELETE_USER',
                    target: `${user.name} (${user.macAddress})`,
                    performedBy: admin.name || admin.email,
                    details: 'User deleted from system',
                });
            }
            catch (logError) {
                console.error('[AuditLog Error]', logError);
            }
            try {
                const config = getRouterConfig(admin);
                yield routerSync_1.RouterSync.toggleMacRule(config, user.macAddress, user.name, false);
            }
            catch (routerError) {
                routerSyncWarning = (routerError === null || routerError === void 0 ? void 0 : routerError.message) || 'Router sync failed after deleting user.';
                console.error(`[Router] Delete succeeded, but sync failed for ${user.macAddress}: ${routerSyncWarning}`);
            }
        }
        else {
            return res.status(404).json({ message: 'User not found or unauthorized' });
        }
        res.status(200).json({
            message: 'User deleted successfully',
            routerSync: routerSyncWarning ? { success: false, message: routerSyncWarning } : { success: true },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const adminId = req.user.id;
        const { id } = req.params;
        const updateData = Object.assign({}, req.body);
        const admin = yield User_1.default.findById(adminId);
        if (!admin)
            return res.status(404).json({ message: 'Admin not found' });
        if (req.body.paymentExpiryDate) {
            updateData.status = 'active';
        }
        // Ensure ownership during update
        const updatedUser = yield WifiUser_1.default.findOneAndUpdate({ _id: id, adminId }, updateData, { new: true });
        let routerSyncWarning = null;
        if (updatedUser) {
            // Audit Log
            try {
                yield AuditLog_1.default.create({
                    action: req.body.paymentExpiryDate ? 'RENEW_SUBSCRIPTION' : 'UPDATE_USER',
                    target: `${updatedUser.name} (${updatedUser.macAddress})`,
                    performedBy: admin.name || admin.email,
                    details: req.body.paymentExpiryDate ? `Renewed until ${new Date(req.body.paymentExpiryDate).toLocaleDateString()}` : 'User details updated',
                });
            }
            catch (logError) {
                console.error('[AuditLog Error]', logError);
            }
            try {
                const config = getRouterConfig(admin);
                yield routerSync_1.RouterSync.syncUser(config, updatedUser);
            }
            catch (routerError) {
                routerSyncWarning = (routerError === null || routerError === void 0 ? void 0 : routerError.message) || 'Router sync failed after updating user.';
                console.error(`[Router] Update succeeded, but sync failed for ${updatedUser.macAddress}: ${routerSyncWarning}`);
            }
        }
        else {
            return res.status(404).json({ message: 'User not found or unauthorized' });
        }
        res.status(200).json(Object.assign(Object.assign({}, updatedUser.toObject()), { routerSync: routerSyncWarning ? { success: false, message: routerSyncWarning } : { success: true } }));
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateUser = updateUser;
