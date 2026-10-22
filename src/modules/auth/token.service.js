import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';

export const signAccessToken = (user) =>
  jwt.sign({ role: user.role }, config.jwt.accessSecret, {
    subject: String(user.id),
    expiresIn: config.jwt.accessExpiresIn,
  });

export const verifyAccessToken = (token) => jwt.verify(token, config.jwt.accessSecret);

export const generateRefreshToken = () => crypto.randomBytes(48).toString('base64url');

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export const refreshTokenExpiry = () =>
  new Date(Date.now() + config.jwt.refreshTtlDays * 24 * 60 * 60 * 1000);
