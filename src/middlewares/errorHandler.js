import { config } from '../config/index.js';

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message;

  // Pelanggaran UNIQUE di PostgreSQL
  if (err.code === '23505') {
    status = 409;
    message = 'Data sudah ada';
  }

  if (status >= 500) {
    console.error(err);
    message = 'Internal Server Error';
  }

  res.status(status).json({
    error: message,
    ...(err.details && { details: err.details }),
    ...(config.env !== 'production' && status >= 500 && { stack: err.stack }),
  });
};
