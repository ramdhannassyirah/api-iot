
import { AppError } from '../../utils/AppError.js';
import * as mqtt from './mqtt.repository.js';
import * as mqttManager from './mqtt.manager.js';

const safe = (fn) => fn().catch((err) => console.error('[mqtt] sync gagal:', err.message));

export const getAll = async () => {
  const rows = await mqtt.findAll();
  return rows.map(mqtt.toPublicMqtt);
};

export const getById = async (id) => {
  const record = await mqtt.findById(id);

  if (!record) {
    throw new AppError(404, 'Konfigurasi MQTT tidak ditemukan');
  }

  return mqtt.toPublicMqtt(record);
};

export const create = async (data) => {
  const record = await mqtt.create(data);
  await safe(() => mqttManager.start(record.id));
  return mqtt.toPublicMqtt(record);
};

export const update = async (id, data) => {
  const updated = await mqtt.update(id, data);
  if (!updated) throw new AppError(404, 'Konfigurasi MQTT tidak ditemukan');
  await safe(() => mqttManager.restart(id));
  return mqtt.toPublicMqtt(updated);
};

export const remove = async (id) => {
  const deleted = await mqtt.remove(id);
  if (!deleted) throw new AppError(404, 'Konfigurasi MQTT tidak ditemukan');
  await safe(() => mqttManager.stop(id));
  return { id: deleted.id };
};