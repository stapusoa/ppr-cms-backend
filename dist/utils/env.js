"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.env.backend' });
exports.ENV = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
    REPO_OWNER: process.env.REPO_OWNER || '',
    REPO_NAME: process.env.REPO_NAME || '',
    CONTENT_PATH: process.env.CONTENT_PATH || 'content',
    BRANCH: process.env.BRANCH || 'main',
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || '',
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || '',
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || '',
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || '',
    PORT: parseInt(process.env.PORT || '3001', 10),
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};
