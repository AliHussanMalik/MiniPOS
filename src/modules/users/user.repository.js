// User repository
// Responsible for user data access and database communication.

const pool = require("../../config/db");
const { buildUpdateQuery } = require("../../utils/repository.helpers");

const userReturning = `
  id,
  full_name AS "fullName",
  email,
  role,
  is_active AS "isActive",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

const createUser = async ({
  fullName,
  email,
  password,
  role = "CUSTOMER",
  isActive = true,
}) => {
  const result = await pool.query(
    `
      INSERT INTO users (
        full_name,
        email,
        password,
        role,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ${userReturning};
    `,
    [fullName, email, password, role, isActive]
  );

  return result.rows[0];
};

const findAllUsers = async () => {
  const result = await pool.query(`
    SELECT ${userReturning}
    FROM users
    ORDER BY id;
  `);

  return result.rows;
};

const findUserById = async (id) => {
  const result = await pool.query(
    `
      SELECT ${userReturning}
      FROM users
      WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const result = await pool.query(
    `
      SELECT
        u.id,
        u.full_name AS "fullName",
        u.email,
        u.password,
        u.role,
        u.is_active AS "isActive",
        u.created_at AS "createdAt",
        u.updated_at AS "updatedAt",
        NULL::int AS "storeId"
      FROM users u
      WHERE u.email = $1;
    `,
    [email]
  );

  return result.rows[0];
};

const updateUser = async (id, data) => {
  const query = buildUpdateQuery({
    table: "users",
    id,
    data,
    columns: {
      fullName: "full_name",
      email: "email",
      password: "password",
      role: "role",
      isActive: "is_active",
    },
    returning: userReturning,
  });

  if (!query) return findUserById(id);

  const result = await pool.query(query.text, query.values);

  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM users
      WHERE id = $1
      RETURNING ${userReturning};
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  createUser,
  findAllUsers,
  findUserById,
  findUserByEmail,
  updateUser,
  deleteUser,
};
