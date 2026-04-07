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
exports.updateRouterSettings = exports.getMe = exports.register = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                routerUrl: user.routerUrl,
                routerUsername: user.routerUsername
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, routerUrl, routerUsername, routerPassword } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User_1.default({
            name,
            email: email.toLowerCase(),
            password,
            routerUrl: routerUrl || 'http://192.168.1.1',
            routerUsername: routerUsername || 'admin',
            routerPassword: routerPassword || ''
        });
        yield user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                routerUrl: user.routerUrl,
                routerUsername: user.routerUsername
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.register = register;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getMe = getMe;
const updateRouterSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { routerUrl, routerUsername, routerPassword } = req.body;
    try {
        const user = yield User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (routerUrl)
            user.routerUrl = routerUrl;
        if (routerUsername)
            user.routerUsername = routerUsername;
        if (routerPassword)
            user.routerPassword = routerPassword;
        yield user.save();
        res.json({
            message: 'Router settings updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                routerUrl: user.routerUrl,
                routerUsername: user.routerUsername
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateRouterSettings = updateRouterSettings;
