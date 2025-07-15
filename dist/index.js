"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const content_1 = require("./routes/content");
const auth_1 = require("./utils/auth"); // 🔐 Import middleware
// Load environment variables from .env.backend
dotenv_1.default.config({ path: '.env.backend' });
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const allowedOrigin = process.env.CORS_ORIGIN || '*';
// Middleware
app.use((0, cors_1.default)({ origin: allowedOrigin }));
app.use(express_1.default.json());
// Routes — 🔐 apply JWT check before accessing content routes
app.use('/api/content', auth_1.checkJwt, content_1.contentRoutes);
// Health check (no auth needed)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Start server
app.listen(port, () => {
    console.log(`✅ Backend server is running at http://localhost:${port}`);
});
