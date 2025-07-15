// utils/auth.ts
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import { ENV } from './env';
import type { Request, Response, NextFunction } from 'express';

const client = jwksClient({
  jwksUri: `https://${ENV.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  if (!header.kid) return callback(new Error('No kid found in token header'));
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
}

export function checkJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const token = authHeader.split(' ')[1];
  jwt.verify(
    token,
    getKey,
    {
      audience: ENV.AUTH0_AUDIENCE,
      issuer: `https://${ENV.AUTH0_DOMAIN}/`,
      algorithms: ['RS256']
    },
    (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Invalid token', details: err });
      (req as any).user = decoded;
      next();
    }
  );
}