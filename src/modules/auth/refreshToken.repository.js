import { query } from '../../database/pool.js';

export const create = async ({ userId, tokenHash, expiresAt }) => {
  await query(
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
    [userId, tokenHash, expiresAt],
  );
};

export const findByHash = async (tokenHash) => {
  const { rows } = await query('SELECT * FROM refresh_tokens WHERE token_hash = $1', [tokenHash]);
  return rows[0] || null;
};

// Atomik: hanya berhasil jika token belum pernah di-revoke
export const revoke = async (id) => {
  const { rows } = await query(
    'UPDATE refresh_tokens SET revoked_at = now() WHERE id = $1 AND revoked_at IS NULL RETURNING id',
    [id],
  );
  return rows[0] || null;
};

export const revokeAllForUser = async (userId) => {
  await query(
    'UPDATE refresh_tokens SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL',
    [userId],
  );
};
