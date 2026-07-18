const pool = require("../../config/db");
const { buildUpdateQuery } = require("../../utils/repository.helpers");

const storeReturning = `
  id,
  owner_id AS "ownerId",
  name,
  slug,
  email,
  phone,
  address,
  status,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

const createStore = async ({ ownerId, name, slug, email = null, phone = null, address = null }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
    `
      INSERT INTO stores (owner_id, name, slug, email, phone, address)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ${storeReturning};
    `,
    [ownerId, name, slug, email, phone, address]
    );
    const store = result.rows[0];
    await client.query(
      "INSERT INTO store_users (store_id, user_id, is_active) VALUES ($1, $2, true)",
      [store.id, ownerId]
    );
    await client.query("COMMIT");
    return store;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const hasStoreAccess = async (storeId, userId, role) => {
  const result = await pool.query(
    role === "OWNER"
      ? "SELECT 1 FROM stores WHERE id = $1 AND owner_id = $2"
      : "SELECT 1 FROM store_users WHERE store_id = $1 AND user_id = $2 AND is_active = true",
    [storeId, userId]
  );
  return result.rowCount > 0;
};

const findStoreById = async (id) => {
  const result = await pool.query(
    `
      SELECT ${storeReturning}
      FROM stores
      WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0];
};

const findStoresByOwnerId = async (ownerId) => {
  const result = await pool.query(
    `
      SELECT ${storeReturning}
      FROM stores
      WHERE owner_id = $1
      ORDER BY id;
    `,
    [ownerId]
  );

  return result.rows;
};

const findStoresByUserId = async (userId) => {
  // Find stores where the user is assigned in store_users
  const result = await pool.query(
    `
      SELECT s.id, s.owner_id AS "ownerId", s.name, s.slug, s.email, s.phone, s.address, s.status, s.created_at AS "createdAt", s.updated_at AS "updatedAt"
      FROM stores s
      JOIN store_users su ON su.store_id = s.id
      WHERE su.user_id = $1 AND su.is_active = true
      ORDER BY s.id;
    `,
    [userId]
  );
  return result.rows;
};

const updateStore = async (id, data) => {
  const query = buildUpdateQuery({
    table: "stores",
    id,
    data,
    columns: {
      name: "name",
      slug: "slug",
      email: "email",
      phone: "phone",
      address: "address",
      status: "status",
    },
    returning: storeReturning,
  });

  if (!query) return findStoreById(id);

  const result = await pool.query(query.text, query.values);
  return result.rows[0];
};

const deleteStore = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM stores
      WHERE id = $1
      RETURNING ${storeReturning};
    `,
    [id]
  );

  return result.rows[0];
};

const addUserToStore = async ({ storeId, userId, isActive = true }) => {
  const result = await pool.query(
    `
      INSERT INTO store_users (store_id, user_id, is_active)
      VALUES ($1, $2, $3)
      ON CONFLICT (store_id, user_id) 
      DO UPDATE SET is_active = EXCLUDED.is_active, created_at = CURRENT_TIMESTAMP
      RETURNING id, store_id AS "storeId", user_id AS "userId", is_active AS "isActive", created_at AS "createdAt";
    `,
    [storeId, userId, isActive]
  );

  return result.rows[0];
};

const findUsersByStoreId = async (storeId) => {
  const result = await pool.query(
    `
      SELECT
        su.id,
        su.store_id AS "storeId",
        su.user_id AS "userId",
        su.is_active AS "isActive",
        su.created_at AS "createdAt",
        u.email,
        u.full_name AS "fullName",
        u.role
      FROM store_users su
      JOIN users u ON u.id = su.user_id
      WHERE su.store_id = $1
      ORDER BY su.id;
    `,
    [storeId]
  );

  return result.rows;
};

const removeUserFromStore = async (storeId, userId) => {
  const result = await pool.query(
    `
      DELETE FROM store_users
      WHERE store_id = $1 AND user_id = $2
      RETURNING id, store_id AS "storeId", user_id AS "userId";
    `,
    [storeId, userId]
  );

  return result.rows[0];
};

module.exports = {
  createStore,
  hasStoreAccess,
  findStoreById,
  findStoresByOwnerId,
  findStoresByUserId,
  updateStore,
  deleteStore,
  addUserToStore,
  findUsersByStoreId,
  removeUserFromStore,
};
