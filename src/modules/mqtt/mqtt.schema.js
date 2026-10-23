import { z } from 'zod';

const emptyToNull = (v) => (v === '' ? null : v);

const optionalText = (max) =>
  z.string().trim().max(max).nullable().optional().transform(emptyToNull);

const mqttFields = {
  name: z.string().trim().min(1, 'Nama wajib diisi').max(100),
  ip: z.string().trim().min(1, 'IP/host wajib diisi').max(255),
  port: z.coerce
    .number({ invalid_type_error: 'Port harus berupa angka' })
    .int('Port harus bilangan bulat')
    .min(1, 'Port minimal 1')
    .max(65535, 'Port maksimal 65535'),
  pub: optionalText(65535),
  sub: optionalText(65535),
  username: optionalText(255),
  password: z.string().max(255).nullable().optional().transform(emptyToNull), 
};

export const createMqttSchema = z.object(mqttFields).strict();

export const updateMqttSchema = z
  .object(mqttFields)
  .partial()
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Minimal satu field harus diisi',
  );

export const mqttIdSchema = z.object({
  id: z.coerce.number().int('ID harus bilangan bulat').min(1, 'ID tidak valid'),
});