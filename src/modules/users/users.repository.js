import { query } from '../../database/pool.js';

// Bentuk user yang aman dikirim ke klien
export const toPublicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  avatarUrl: u.avatar_url,
  role: u.role,
  hasPassword: Boolean(u.password_hash),
  hasGoogle: Boolean(u.google_id),
  createdAt: u.created_at,
});

export const findById = async (id) => {
  const { rows } = await query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0] || null;
};

export const findByEmail = async (email) => {
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

export const findByGoogleId = async (googleId) => {
  const { rows } = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);
  return rows[0] || null;
};

export const create = async ({ name, email, passwordHash = null, googleId = null, avatarUrl = null }) => {
  const { rows } = await query(
    `INSERT INTO users (name, email, password_hash, google_id, avatar_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, passwordHash, googleId, avatarUrl],
  );
  return rows[0];
};

export const linkGoogle = async (id, googleId, avatarUrl) => {
  const { rows } = await query(
    `UPDATE users
        SET google_id = $2, avatar_url = COALESCE(avatar_url, $3), updated_at = now()
      WHERE id = $1 RETURNING *`,
    [id, googleId, avatarUrl],
  );
  return rows[0];
};
