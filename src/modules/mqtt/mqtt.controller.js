
import * as mqttService from './mqtt.service.js';

export const index = async (req, res) => {
  res.json({ data: await mqttService.getAll() });
};

export const show = async (req, res) => {
  res.json({
    data: await mqttService.getById(req.params.id),
  });
};

export const create = async (req, res) => {
  res.status(201).json({
    data: await mqttService.create(req.body),
  });
};

export const update = async (req, res) => {
  res.json({
    data: await mqttService.update(req.params.id, req.body),
  });
};

export const remove = async (req, res) => {
  await mqttService.remove(req.params.id);
  res.status(204).end();
};
