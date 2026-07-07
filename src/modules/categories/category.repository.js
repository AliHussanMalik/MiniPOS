// Category repository
// Responsible for category data access and database communication.

const pool = require("../../config/db");
const { buildUpdateQuery } = require("../../utils/repository.helpers");

const categoryReturning = `
  id,
  name,
  description,
  is_active AS "isActive",
  created_at AS "createdAt",
  updated_at AS "updatedAt",
  deleted_at AS "deletedAt"
`;

const createCategory = async ({ name, description = null, isActive = true }) => {
  const result = await pool.query(
    `
      INSERT INTO categories (name, description, is_active)
      VALUES ($1, $2, $3)
      RETURNING ${categoryReturning};
    `,
    [name, description, isActive]
  );

  return result.rows[0];
};

const findAllCategories = async () => {
  const result = await pool.query(`
    SELECT ${categoryReturning}
    FROM categories
    WHERE deleted_at IS NULL
    ORDER BY id;
  `);

  return result.rows;
};

const findCategoryById = async (id) => {
  const result = await pool.query(
    `
      SELECT ${categoryReturning}
      FROM categories
      WHERE id = $1 AND deleted_at IS NULL;
    `,
    [id]
  );

  return result.rows[0];
};

const updateCategory = async (id, data) => {
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

  if (!query) return findCategoryById(id);

  const result = await pool.query(query.text, query.values);

  return result.rows[0];
};

const deleteCategory = async (id) => {
  const result = await pool.query(
    `
      UPDATE categories
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING ${categoryReturning};
    `,
    [id]
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
