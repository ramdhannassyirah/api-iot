import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './pool.js';

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'migrations');

const args = process.argv.slice(2);
const fresh = args.includes('--fresh');
const force = args.includes('--force');

const dropAll = async () => {
  // Pengaman: jangan sampai menghapus database produksi tanpa sengaja
  if (process.env.NODE_ENV === 'production' && !force) {
    throw new Error('migrate:fresh ditolak di production. Tambahkan --force kalau memang disengaja.');
  }

  console.log('Menghapus semua objek di schema public...');
  await pool.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `);
};

const run = async () => {
  if (fresh) await dropAll();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  const files = (await fs.readdir(dir)).filter((f) => f.endsWith('.sql')).sort();
  const { rows } = await pool.query('SELECT name FROM schema_migrations');
  const applied = new Set(rows.map((r) => r.name));

  for (const file of files) {
    if (applied.has(file)) continue;

    const sql = await fs.readFile(path.join(dir, file), 'utf8');
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
      await client.query('COMMIT');
      console.log(`Migrasi diterapkan: ${file}`);
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      err.message = `Gagal di ${file}: ${err.message}`;
      throw err;
    } finally {
      client.release();
    }
  }

  console.log('Migrasi selesai');
};

run()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });