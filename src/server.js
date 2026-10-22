import http from 'node:http';
import app from './app.js';
import { config } from './config/index.js';
import { pool } from './database/pool.js';

// Pakai http.createServer agar nanti mudah dipasang Socket.IO / WebSocket
const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`[${config.env}] Server berjalan di http://localhost:${config.port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} diterima, menutup server...`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
