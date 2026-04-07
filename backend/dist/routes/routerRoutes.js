"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerController_1 = require("../controllers/routerController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Protect these routes as they interact with the physical hardware
router.get('/status', auth_1.authenticate, routerController_1.getRouterStatus);
router.get('/devices', auth_1.authenticate, routerController_1.getConnectedDevices);
exports.default = router;
