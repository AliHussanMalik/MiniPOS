// Customer repository
// Responsible for customer data access and database communication.

const pool = require("../../config/db");
const { buildUpdateQuery } = require("../../utils/repository.helpers");

const customerReturning = `
  id,
  full_name AS "fullName",
  phone,
  email,
  address,
  is_active AS "isActive",
  created_at AS "createdAt",
  updated_at AS "updatedAt",
  deleted_at AS "deletedAt"
`;

const createCustomer = async ({ fullName, phone = null, email = null, address = null, isActive = true }) => {
  const result = await pool.query(
    `
      INSERT INTO customers (full_name, phone, email, address, is_active)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING ${customerReturning};
    `,
    [fullName, phone, email, address, isActive]
  );

  return result.rows[0];
};

const findAllCustomers = async () => {
  const result = await pool.query(`
    SELECT ${customerReturning}
    FROM customers
    WHERE deleted_at IS NULL
    ORDER BY id;
  `);

  return result.rows;
};

const findCustomerById = async (id) => {
  const result = await pool.query(
    `
      SELECT ${customerReturning}
      FROM customers
      WHERE id = $1 AND deleted_at IS NULL;
    `,
    [id]
  );

  return result.rows[0];
};

const findCustomerByEmail = async (email) => {
  const result = await pool.query(
    `
      SELECT ${customerReturning}
      FROM customers
      WHERE email = $1 AND deleted_at IS NULL;
    `,
    [email]
  );

  return result.rows[0];
};

const updateCustomer = async (id, data) => {
  const query = buildUpdateQuery({
    table: "customers",
    id,
    data,
    columns: {
      fullName: "full_name",
      phone: "phone",
      email: "email",
      address: "address",
      isActive: "is_active",
    },
    returning: customerReturning,
  });

  if (!query) return findCustomerById(id);

  const result = await pool.query(query.text, query.values);

  return result.rows[0];
};

const deleteCustomer = async (id) => {
  const result = await pool.query(
    `
      UPDATE customers
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING ${customerReturning};
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  createCustomer,
  findAllCustomers,
  findCustomerById,
  findCustomerByEmail,
  updateCustomer,
  deleteCustomer,
};
