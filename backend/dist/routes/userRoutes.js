"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply authentication to all user management routes
router.get('/', auth_1.authenticate, userController_1.getUsers);
router.post('/', auth_1.authenticate, userController_1.createUser);
router.delete('/:id', auth_1.authenticate, userController_1.deleteUser);
router.put('/:id', auth_1.authenticate, userController_1.updateUser);
exports.default = router;
