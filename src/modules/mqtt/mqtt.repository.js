
import { query } from '../../database/pool.js';

export const toPublicMqtt = (mqtt) => ({
  id: mqtt.id,
  name: mqtt.name,
  ip: mqtt.ip,
  port: mqtt.port,
  pub: mqtt.pub,
  sub: mqtt.sub,
  username: mqtt.username,
  createdAt: mqtt.created_at,
  updatedAt: mqtt.updated_at,
});

export const findAll = async () => {
  const { rows } = await query(
    `SELECT id, name, ip, port, pub, sub, username, created_at, updated_at
       FROM ref_mqtt
      ORDER BY created_at DESC`,
  );

  return rows;
};

export const findById = async (id) => {
  const { rows } = await query(
    `SELECT id, name, ip, port, pub, sub, username, created_at, updated_at
       FROM ref_mqtt
      WHERE id = $1`,
    [id],
  );

  return rows[0] || null;
};

export const findCredentialsById = async (id) => {
  const { rows } = await query(
    `SELECT id, name, ip, port, pub, sub, username, password
       FROM ref_mqtt
      WHERE id = $1`,
    [id],
  );

  return rows[0] || null;
};

export const create = async ({
  name,
  ip,
  port,
  pub = null,
  sub = null,
  username = null,
  password = null,
}) => {
  const { rows } = await query(
    `INSERT INTO ref_mqtt (
       name, ip, port, pub, sub, username, password
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, ip, port, pub, sub, username, created_at, updated_at`,
    [name, ip, port, pub, sub, username, password],
  );

  return rows[0];
};

export const update = async (
  id,
  { name, ip, port, pub, sub, username, password },
) => {
  const { rows } = await query(
    `UPDATE ref_mqtt
        SET name = COALESCE($2, name),
            ip = COALESCE($3, ip),
            port = COALESCE($4, port),
            pub = COALESCE($5, pub),
            sub = COALESCE($6, sub),
            username = COALESCE($7, username),
            password = COALESCE($8, password),
            updated_at = now()
      WHERE id = $1
      RETURNING id, name, ip, port, pub, sub, username, created_at, updated_at`,
    [id, name, ip, port, pub, sub, username, password],
  );

  return rows[0] || null;
};

export const remove = async (id) => {
  const { rows } = await query(
    `DELETE FROM ref_mqtt
      WHERE id = $1
      RETURNING id`,
    [id],
  );

  return rows[0] || null;
};
