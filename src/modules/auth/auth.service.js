import bcrypt from 'bcryptjs';
import { AppError } from '../../utils/AppError.js';
import * as users from '../users/users.repository.js';
import * as refreshTokens from './refreshToken.repository.js';
import * as tokens from './token.service.js';
import { verifyGoogleIdToken } from './google.provider.js';

const BCRYPT_ROUNDS = 12;
// Dipakai agar waktu respons login tetap mirip meski email tidak ditemukan
const DUMMY_HASH = bcrypt.hashSync('dummy-password', BCRYPT_ROUNDS);

const issueTokens = async (user) => {
  const refreshToken = tokens.generateRefreshToken();
  await refreshTokens.create({
    userId: user.id,
    tokenHash: tokens.hashToken(refreshToken),
    expiresAt: tokens.refreshTokenExpiry(),
  });

  return {
    user: users.toPublicUser(user),
    accessToken: tokens.signAccessToken(user),
    refreshToken,
    tokenType: 'Bearer',
  };
};

export const register = async ({ name, email, password }) => {
  if (await users.findByEmail(email)) {
    throw new AppError(409, 'Email sudah terdaftar');
  }
  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const user = await users.create({ name, email, passwordHash });
  return issueTokens(user);
};

export const login = async ({ email, password }) => {
  const user = await users.findByEmail(email);
  const valid = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH);
  if (!user || !user.password_hash || !valid) {
    throw new AppError(401, 'Email atau password salah');
  }
  return issueTokens(user);
};

export const loginWithGoogle = async (idToken) => {
  const profile = await verifyGoogleIdToken(idToken);

  let user = await users.findByGoogleId(profile.googleId);

  if (!user) {
    const existing = await users.findByEmail(profile.email);
    if (existing) {
      // Email sudah terdaftar (sudah diverifikasi Google) -> tautkan akun
      user = await users.linkGoogle(existing.id, profile.googleId, profile.avatarUrl);
    } else {
      user = await users.create({
        name: profile.name,
        email: profile.email,
        googleId: profile.googleId,
        avatarUrl: profile.avatarUrl,
      });
    }
  }

  return issueTokens(user);
};

// Rotasi refresh token: token lama dicabut, token baru diterbitkan
export const refresh = async (refreshToken) => {
  const stored = await refreshTokens.findByHash(tokens.hashToken(refreshToken));
  if (!stored) throw new AppError(401, 'Refresh token tidak valid');

  // Token yang sudah dicabut dipakai lagi -> kemungkinan dicuri, cabut semua sesi
  if (stored.revoked_at) {
    await refreshTokens.revokeAllForUser(stored.user_id);
    throw new AppError(401, 'Refresh token tidak valid');
  }
  if (new Date(stored.expires_at) < new Date()) {
    throw new AppError(401, 'Refresh token kedaluwarsa');
  }

  const revoked = await refreshTokens.revoke(stored.id);
  if (!revoked) {
    await refreshTokens.revokeAllForUser(stored.user_id);
    throw new AppError(401, 'Refresh token tidak valid');
  }

  const user = await users.findById(stored.user_id);
  if (!user) throw new AppError(401, 'Pengguna tidak ditemukan');

  return issueTokens(user);
};

export const logout = async (refreshToken) => {
  const stored = await refreshTokens.findByHash(tokens.hashToken(refreshToken));
  if (stored) await refreshTokens.revoke(stored.id);
};

export const getProfile = async (userId) => {
  const user = await users.findById(userId);
  if (!user) throw new AppError(404, 'Pengguna tidak ditemukan');
  return users.toPublicUser(user);
};
