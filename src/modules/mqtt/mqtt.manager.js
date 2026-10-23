import { AppError } from '../../utils/AppError.js';
import * as mqttRepo from './mqtt.repository.js';
import { MqttClient } from './mqtt.client.js';
import { handleMessage } from './mqtt.handler.js';

const clients = new Map(); 

export const start = async (id) => {
  if (clients.has(id)) return;

  const config = await mqttRepo.findCredentialsById(id);
  if (!config) throw new AppError(404, 'Konfigurasi MQTT tidak ditemukan');

  const client = new MqttClient(config, { onMessage: handleMessage });
  clients.set(id, client);
  client.connect();
};

export const stop = async (id) => {
  const client = clients.get(id);
  if (!client) return;
  clients.delete(id);
  await client.disconnect();
};

export const restart = async (id) => {
  await stop(id);
  await start(id);
};

export const startAll = async () => {
  const ids = await mqttRepo.findAllIds();
  await Promise.allSettled(ids.map(start));
};

export const stopAll = async () => {
  await Promise.allSettled([...clients.keys()].map(stop));
};

export const getStatus = (id) => {
  const client = clients.get(id);
  if (!client) throw new AppError(404, 'Koneksi MQTT tidak aktif');
  return client.status;
};

export const getAllStatus = () => [...clients.values()].map((c) => c.status);

export const publish = async (id, payload) => {
  const client = clients.get(id);
  if (!client) throw new AppError(404, 'Koneksi MQTT tidak aktif');
  try {
    await client.publish(payload);
  } catch (err) {
    throw new AppError(502, err.message);
  }
};