// Customer repository
// Responsible for customer data access and database communication.

const pool = require("../../config/db");
const { buildUpdateQuery } = require("../../utils/repository.helpers");

const customerReturning = `
  id,
  store_id AS "storeId",
  full_name AS "fullName",
  phone,
  email,
  address,
  is_active AS "isActive",
  created_at AS "createdAt",
  updated_at AS "updatedAt",
  deleted_at AS "deletedAt"
`;

const createCustomer = async (storeId, { fullName, phone = null, email = null, address = null, isActive = true }) => {
  const result = await pool.query(
    `
      INSERT INTO customers (store_id, full_name, phone, email, address, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING ${customerReturning};
    `,
    [storeId, fullName, phone, email, address, isActive]
  );

  return result.rows[0];
};

const findAllCustomers = async (storeId) => {
  const result = await pool.query(
    `
      SELECT ${customerReturning}
      FROM customers
      WHERE store_id = $1 AND deleted_at IS NULL
      ORDER BY id;
    `,
    [storeId]
  );

  return result.rows;
};

const findCustomerById = async (id, storeId) => {
  const result = await pool.query(
    `
      SELECT ${customerReturning}
      FROM customers
      WHERE id = $1 AND store_id = $2 AND deleted_at IS NULL;
    `,
    [id, storeId]
  );

  return result.rows[0];
};

const findCustomerByEmail = async (email, storeId) => {
  const result = await pool.query(
    `
      SELECT ${customerReturning}
      FROM customers
      WHERE email = $1 AND store_id = $2 AND deleted_at IS NULL;
    `,
    [email, storeId]
  );

  return result.rows[0];
};

const updateCustomer = async (id, storeId, data) => {
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

  if (!query) return findCustomerById(id, storeId);

  query.text = query.text.replace(
    `WHERE id = $${query.values.length}`,
    `WHERE id = $${query.values.length} AND store_id = $${query.values.length + 1}`
  );
  query.values.push(storeId);

  const result = await pool.query(query.text, query.values);

  return result.rows[0];
};

const deleteCustomer = async (id, storeId) => {
  const result = await pool.query(
    `
      UPDATE customers
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND store_id = $2 AND deleted_at IS NULL
      RETURNING ${customerReturning};
    `,
    [id, storeId]
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
