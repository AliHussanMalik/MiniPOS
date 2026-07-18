// Category repository
// Responsible for category data access and database communication.

const pool = require("../../config/db");
const { buildUpdateQuery } = require("../../utils/repository.helpers");

const categoryReturning = `
  id,
  store_id AS "storeId",
  name,
  description,
  is_active AS "isActive",
  created_at AS "createdAt",
  updated_at AS "updatedAt",
  deleted_at AS "deletedAt"
`;

const createCategory = async (storeId, { name, description = null, isActive = true }) => {
  const result = await pool.query(
    `
      INSERT INTO categories (store_id, name, description, is_active)
      VALUES ($1, $2, $3, $4)
      RETURNING ${categoryReturning};
    `,
    [storeId, name, description, isActive]
  );

  return result.rows[0];
};

const findAllCategories = async (storeId) => {
  const result = await pool.query(
    `
      SELECT ${categoryReturning}
      FROM categories
      WHERE store_id = $1 AND deleted_at IS NULL
      ORDER BY id;
    `,
    [storeId]
  );

  return result.rows;
};

const findCategoryById = async (id, storeId) => {
  const result = await pool.query(
    `
      SELECT ${categoryReturning}
      FROM categories
      WHERE id = $1 AND store_id = $2 AND deleted_at IS NULL;
    `,
    [id, storeId]
  );

  return result.rows[0];
};

const updateCategory = async (id, storeId, data) => {
  const query = buildUpdateQuery({
    table: "categories",
    id,
    data,
    columns: {
      name: "name",
      description: "description",
      isActive: "is_active",
    },
    returning: categoryReturning,
  });

  if (!query) return findCategoryById(id, storeId);

  query.text = query.text.replace(
    `WHERE id = $${query.values.length}`,
    `WHERE id = $${query.values.length} AND store_id = $${query.values.length + 1}`
  );
  query.values.push(storeId);

  const result = await pool.query(query.text, query.values);

  return result.rows[0];
};

const deleteCategory = async (id, storeId) => {
  const result = await pool.query(
    `
      UPDATE categories
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND store_id = $2 AND deleted_at IS NULL
      RETURNING ${categoryReturning};
    `,
    [id, storeId]
  );

  return result.rows[0];
};

module.exports = {
  createCategory,
  findAllCategories,
  findCategoryById,
  updateCategory,
  deleteCategory,
};
