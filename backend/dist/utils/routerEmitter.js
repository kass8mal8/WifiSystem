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
exports.stopRouterPolling = exports.startRouterPolling = void 0;
const routerSync_1 = require("./routerSync");
const User_1 = __importDefault(require("../models/User"));
let isPollingActive = false;
let currentTimeout = null;
/**
 * Starts a background loop that fetches router status and broadcasts it to specific users.
 * Optimized to only poll when at least one user is connected via Socket.io.
 * Data is isolated per user based on their specific router configuration.
 */
const startRouterPolling = (io) => {
    if (isPollingActive)
        return;
    isPollingActive = true;
    console.log('[RouterEmitter] Background multi-tenant polling initialized...');
    const poll = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!isPollingActive)
            return;
        try {
            // Get all connected user rooms
            const rooms = Array.from(io.sockets.adapter.rooms.keys());
            const userRooms = rooms.filter(room => room.startsWith('user:'));
            if (userRooms.length > 0) {
                const userIds = userRooms.map(room => room.split(':')[1]);
                // Fetch user data for all connected users
                const activeUsers = yield User_1.default.find({ _id: { $in: userIds } });
                if (activeUsers.length > 0) {
                    // Map routers to the users who use them to avoid redundant polling
                    const routerMap = new Map();
                    for (const user of activeUsers) {
                        if (!user.routerUrl)
                            continue;
                        const urlKey = user.routerUrl.toLowerCase().trim();
                        if (!routerMap.has(urlKey)) {
                            routerMap.set(urlKey, {
                                config: {
                                    routerUrl: user.routerUrl,
                                    routerUsername: user.routerUsername,
                                    routerPasswordRaw: user.routerPassword // FIXED: Must be routerPasswordRaw for RouterSync
                                },
                                users: []
                            });
                        }
                        (_a = routerMap.get(urlKey)) === null || _a === void 0 ? void 0 : _a.users.push(user);
                    }
                    // Poll each unique router
                    for (const [url, data] of routerMap.entries()) {
                        try {
                            const config = data.config;
                            // Parallel fetch for speed
                            const [signal, traffic, system, devices] = yield Promise.all([
                                routerSync_1.RouterSync.getSignalStatus(config).catch(e => {
                                    console.error(`[RouterEmitter] Signal Error (${url}):`, e.message);
                                    return { error: 'Signal Error' };
                                }),
                                routerSync_1.RouterSync.getTrafficStats(config).catch(e => {
                                    console.error(`[RouterEmitter] Traffic Error (${url}):`, e.message);
                                    return { error: 'Traffic Error' };
                                }),
                                routerSync_1.RouterSync.getSystemStatus(config).catch(e => {
                                    console.error(`[RouterEmitter] System Error (${url}):`, e.message);
                                    return { error: 'System Error' };
                                }),
                                routerSync_1.RouterSync.getConnectedDevices(config).catch(e => {
                                    console.error(`[RouterEmitter] Devices Error (${url}):`, e.message);
                                    return [];
                                })
                            ]);
                            // Emit to each user connected to THIS router
                            data.users.forEach(user => {
                                const roomName = `user:${user._id}`;
                                io.to(roomName).emit('router_status', {
                                    signal,
                                    traffic,
                                    system,
                                    success: true,
                                    timestamp: Date.now()
                                });
                                io.to(roomName).emit('router_devices', {
                                    devices,
                                    success: true
                                });
                            });
                        }
                        catch (error) {
                            console.error(`[RouterEmitter] Error polling router at ${url}:`, error);
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error('[RouterEmitter] Critical polling logic failure:', error);
        }
        finally {
            if (isPollingActive) {
                currentTimeout = setTimeout(poll, 5000);
            }
        }
    });
    poll();
};
exports.startRouterPolling = startRouterPolling;
const stopRouterPolling = () => {
    if (!isPollingActive)
        return;
    isPollingActive = false;
    if (currentTimeout) {
        clearTimeout(currentTimeout);
        currentTimeout = null;
    }
    console.log('[RouterEmitter] Polling loop suspended.');
};
exports.stopRouterPolling = stopRouterPolling;
