import { AppError } from '../../utils/AppError.js';
import { verifyAccessToken } from './token.service.js';

export const authenticate = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(401, 'Token tidak ditemukan'));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError(401, 'Token tidak valid atau kedaluwarsa'));
  }
};

// Batasi akses berdasarkan role, contoh: authorize('admin', 'operator')
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError(403, 'Akses ditolak'));
  }
  next();
};
