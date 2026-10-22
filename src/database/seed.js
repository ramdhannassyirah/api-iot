
import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

const seeds = [
  {
    name: 'Admin',
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
    role: 'admin',
  },
  {
    name: 'Operator',
    email: process.env.SEED_OPERATOR_EMAIL,
    password: process.env.SEED_OPERATOR_PASSWORD,
    role: 'operator',
  },
  {
    name: 'User',
    email: process.env.SEED_USER_EMAIL,
    password: process.env.SEED_USER_PASSWORD,
    role: 'user',
  },
];

const run = async () => {
  for (const seed of seeds) {
    if (!seed.email || !seed.password) {
      throw new Error(
        `Email atau password seed ${seed.role} belum dikonfigurasi`,
      );
    }

    const passwordHash = await bcrypt.hash(seed.password, 12);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [seed.name, seed.email, passwordHash, seed.role],
    );

    console.log(`Seed diperiksa: ${seed.role}`);
  }

  console.log('Seed selesai.');
};

run()
  .catch((err) => {
    console.error('Seed gagal:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());