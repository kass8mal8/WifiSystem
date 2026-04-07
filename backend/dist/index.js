"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const routerRoutes_1 = __importDefault(require("./routes/routerRoutes"));
const auth_1 = require("./middleware/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const expiryJob_1 = require("./cron/expiryJob");
const routerEmitter_1 = require("./utils/routerEmitter");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*', // In production, replace with your frontend URL
        methods: ['GET', 'POST']
    }
});
exports.io = io;
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: process.env.FRONTEND_URL || [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'https://smartwifimanager.netlify.app',
        'https://wifisystem.onrender.com'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// Attach io to request for use in controllers if needed
app.use((req, res, next) => {
    req.io = io;
    next();
});
app.use('/api/users', auth_1.authenticate, userRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/router', auth_1.authenticate, routerRoutes_1.default);
const DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wifi_manager';
mongoose_1.default
    .connect(DB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
    (0, expiryJob_1.startExpiryJob)();
    // Socket.io authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            socket.user = decoded;
            next();
        }
        catch (err) {
            next(new Error('Authentication error: Invalid token'));
        }
    });
    // Socket.io connection handler
    io.on('connection', (socket) => {
        var _a;
        const userId = (_a = socket.user) === null || _a === void 0 ? void 0 : _a.id;
        if (userId) {
            socket.join(`user:${userId}`);
            console.log(`[Socket] User ${userId} connected and joined room user:${userId}`);
        }
        socket.on('disconnect', () => {
            console.log(`[Socket] User ${userId || socket.id} disconnected`);
        });
    });
    // Start background real-time router polling
    (0, routerEmitter_1.startRouterPolling)(io);
    httpServer.listen(PORT, () => {
        console.log(`Server is running with WebSockets on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
