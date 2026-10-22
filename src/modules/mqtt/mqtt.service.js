
import { AppError } from '../../utils/AppError.js';
import * as mqtt from './mqtt.repository.js';

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
  return mqtt.toPublicMqtt(record);
};

export const update = async (id, data) => {
  const existing = await mqtt.findById(id);

  if (!existing) {
    throw new AppError(404, 'Konfigurasi MQTT tidak ditemukan');
  }

  const updated = await mqtt.update(id, data);

  if (!updated) {
    throw new AppError(404, 'Konfigurasi MQTT tidak ditemukan');
  }

  return mqtt.toPublicMqtt(updated);
};

export const remove = async (id) => {
  const deleted = await mqtt.remove(id);

  if (!deleted) {
    throw new AppError(404, 'Konfigurasi MQTT tidak ditemukan');
  }

  return { id: deleted.id };
};
