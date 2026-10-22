
import { z } from 'zod';

const mqttFields = {
  name: z.string().trim().min(1).max(100),
  ip: z.string().trim().min(1).max(255),
  port: z.coerce.number().int().min(1).max(65535),
  pub: z.string().max(65535).nullable().optional(),
  sub: z.string().max(65535).nullable().optional(),
  username: z.string().max(255).nullable().optional(),
  password: z.string().max(255).nullable().optional(),
};

export const createMqttSchema = z.object({
  body: z.object(mqttFields).strict(),
});

export const updateMqttSchema = z.object({
  body: z.object(mqttFields)
    .partial()
    .strict()
    .refine(
      (data) => Object.keys(data).length > 0,
      'Minimal satu field harus diisi',
    ),
});

export const mqttIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
