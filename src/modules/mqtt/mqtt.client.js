import mqtt from 'mqtt';
import { randomUUID } from 'node:crypto';

export class MqttClient {
  #client = null;
  #status = 'idle'; // idle | connecting | connected | reconnecting | offline | closed
  #lastError = null;

  constructor(config, { onMessage } = {}) {
    this.config = config;
    this.onMessage = onMessage;
  }

  get status() {
    return { id: this.config.id, name: this.config.name, state: this.#status, lastError: this.#lastError };
  }

  connect() {
    if (this.#client) return;

    const { id, ip, port, username, password, sub } = this.config;
    this.#status = 'connecting';

    this.#client = mqtt.connect({
      host: ip,
      port,
      protocol: 'mqtt',
      clientId: `jwr-${id}-${randomUUID().slice(0, 8)}`,
      username: username || undefined,
      password: password || undefined,
      keepalive: 60,
      connectTimeout: 10_000,
      reconnectPeriod: 5_000,
      clean: true,
    });

    this.#client.on('connect', () => {
      this.#status = 'connected';
      this.#lastError = null;
      console.log(`[mqtt:${this.config.name}] connected`);

      if (sub) {
        this.#client.subscribe(sub, { qos: 1 }, (err) => {
          if (err) this.#lastError = err.message;
        });
      }
    });

    this.#client.on('reconnect', () => { this.#status = 'reconnecting'; });
    this.#client.on('offline', () => { this.#status = 'offline'; });
    this.#client.on('close', () => {
      if (this.#status !== 'closed') this.#status = 'offline';
    });
    this.#client.on('error', (err) => {
      this.#lastError = err.message;
      console.error(`[mqtt:${this.config.name}] ${err.message}`);
    });

    this.#client.on('message', (topic, payload) => {
      Promise.resolve(this.onMessage?.(this.config, topic, payload)).catch((err) =>
        console.error(`[mqtt:${this.config.name}] handler error:`, err),
      );
    });
  }

  publish(payload, topic = this.config.pub) {
    return new Promise((resolve, reject) => {
      if (!this.#client || !this.#client.connected) {
        return reject(new Error('MQTT belum terhubung'));
      }
      if (!topic) return reject(new Error('Topic publish belum diatur'));

      const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
      this.#client.publish(topic, message, { qos: 1 }, (err) =>
        err ? reject(err) : resolve(),
      );
    });
  }

  disconnect() {
    return new Promise((resolve) => {
      if (!this.#client) return resolve();
      this.#status = 'closed';
      this.#client.end(false, {}, () => {
        this.#client = null;
        resolve();
      });
    });
  }
}