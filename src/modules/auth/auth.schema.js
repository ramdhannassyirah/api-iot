import { z } from 'zod';

const email = z.string().trim().toLowerCase().email('Email tidak valid');
// bcrypt hanya memproses 72 byte pertama
const password = z.string().min(8, 'Password minimal 8 karakter').max(72, 'Password maksimal 72 karakter');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter').max(100),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password wajib diisi'),
});

export const googleSchema = z.object({
  idToken: z.string().min(1, 'idToken wajib diisi'),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken wajib diisi'),
});
