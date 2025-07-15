"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = checkJwt;
// utils/auth.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const env_1 = require("./env");
const client = (0, jwks_rsa_1.default)({
    jwksUri: `https://${env_1.ENV.AUTH0_DOMAIN}/.well-known/jwks.json`
});
function getKey(header, callback) {
    if (!header.kid)
        return callback(new Error('No kid found in token header'));
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key?.getPublicKey();
        callback(err, signingKey);
    });
}
function checkJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: 'Missing Authorization header' });
    const token = authHeader.split(' ')[1];
    jsonwebtoken_1.default.verify(token, getKey, {
        audience: env_1.ENV.AUTH0_AUDIENCE,
        issuer: `https://${env_1.ENV.AUTH0_DOMAIN}/`,
        algorithms: ['RS256']
    }, (err, decoded) => {
        if (err)
            return res.status(401).json({ error: 'Invalid token', details: err });
        req.user = decoded;
        next();
    });
}
