// Inventory repository
// Responsible for inventory data access and database communication.

const pool = require("../../config/db");
const { buildUpdateQuery } = require("../../utils/repository.helpers");

const inventoryReturning = `
  id,
  product_id AS "productId",
  quantity,
  movement_type AS "movementType",
  notes,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

const createInventoryItem = async ({ productId, quantity, movementType, notes = null }) => {
  const result = await pool.query(
    `
      INSERT INTO inventory_movements (product_id, quantity, movement_type, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING ${inventoryReturning};
    `,
    [productId, quantity, movementType, notes]
  );

  return result.rows[0];
};

const findAllInventoryItems = async () => {
  const result = await pool.query(`
    SELECT ${inventoryReturning}
    FROM inventory_movements
    ORDER BY id;
  `);

  return result.rows;
};

const findInventoryItemById = async (id) => {
  const result = await pool.query(
    `
      SELECT ${inventoryReturning}
      FROM inventory_movements
      WHERE id = $1;
    `,
    [id]
  );

  return result.rows[0];
};

const updateInventoryItem = async (id, data) => {
  const query = buildUpdateQuery({
    table: "inventory_movements",
    id,
    data,
    columns: {
      productId: "product_id",
      quantity: "quantity",
      movementType: "movement_type",
      notes: "notes",
    },
    returning: inventoryReturning,
  });

  if (!query) return findInventoryItemById(id);

  const result = await pool.query(query.text, query.values);

  return result.rows[0];
};

const deleteInventoryItem = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM inventory_movements
      WHERE id = $1
      RETURNING ${inventoryReturning};
    `,
    [id]
  );

  return result.rows[0];
};

module.exports = {
  createInventoryItem,
  findAllInventoryItems,
  findInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
};
