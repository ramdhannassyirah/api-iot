import { OAuth2Client } from 'google-auth-library';
import { config } from '../../config/index.js';
import { AppError } from '../../utils/AppError.js';

const client = new OAuth2Client(config.google.clientId);

export const verifyGoogleIdToken = async (idToken) => {
  if (!config.google.clientId) {
    throw new AppError(503, 'Login Google belum dikonfigurasi');
  }

  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken, audience: config.google.clientId });
    payload = ticket.getPayload();
  } catch {
    throw new AppError(401, 'Token Google tidak valid');
  }

  if (!payload?.email || !payload.email_verified) {
    throw new AppError(401, 'Email Google belum terverifikasi');
  }

  return {
    googleId: payload.sub,
    email: payload.email.toLowerCase(),
    name: payload.name || payload.email,
    avatarUrl: payload.picture || null,
  };
};
