import http from 'node:http';
import app from './app.js';
import { config } from './config/index.js';
import { pool } from './database/pool.js';
import * as mqttManager from './modules/mqtt/mqtt.manager.js';

// Pakai http.createServer agar nanti mudah dipasang Socket.IO / WebSocket
const server = http.createServer(app);

server.listen(config.port, async () => {
  console.log(`[${config.env}] Server berjalan di http://localhost:${config.port}`);
  if (process.env.MQTT_ENABLED !== 'false') await mqttManager.startAll();
});

const shutdown = (signal) => {
  console.log(`${signal} diterima, menutup server...`);
  server.close(async () => {
    await pool.end();
    await mqttManager.stopAll();
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
