// Inventory repository
// Responsible for inventory data access and database communication.

const pool = require("../../config/db");
const { buildUpdateQuery } = require("../../utils/repository.helpers");

const inventoryReturning = `
  im.id,
  im.product_id AS "productId",
  im.quantity,
  im.movement_type AS "movementType",
  im.notes,
  im.created_at AS "createdAt",
  im.updated_at AS "updatedAt"
`;

const createInventoryItem = async ({ productId, quantity, movementType, notes = null }) => {
  const result = await pool.query(
    `
      INSERT INTO inventory_movements (product_id, quantity, movement_type, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        product_id AS "productId",
        quantity,
        movement_type AS "movementType",
        notes,
        created_at AS "createdAt",
        updated_at AS "updatedAt";
    `,
    [productId, quantity, movementType, notes]
  );

  return result.rows[0];
};

const findAllInventoryItems = async (storeId) => {
  const result = await pool.query(
    `
      SELECT ${inventoryReturning}
      FROM inventory_movements im
      JOIN products p ON p.id = im.product_id
      WHERE p.store_id = $1
      ORDER BY im.id;
    `,
    [storeId]
  );

  return result.rows;
};

const findInventoryItemById = async (id, storeId) => {
  const result = await pool.query(
    `
      SELECT ${inventoryReturning}
      FROM inventory_movements im
      JOIN products p ON p.id = im.product_id
      WHERE im.id = $1 AND p.store_id = $2;
    `,
    [id, storeId]
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
    returning: `
      id,
      product_id AS "productId",
      quantity,
      movement_type AS "movementType",
      notes,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    `,
  });

  if (!query) {
    const r = await pool.query(
      `SELECT id, product_id AS "productId", quantity, movement_type AS "movementType", notes, created_at AS "createdAt", updated_at AS "updatedAt" FROM inventory_movements WHERE id = $1`,
      [id]
    );
    return r.rows[0];
  }

  const result = await pool.query(query.text, query.values);

  return result.rows[0];
};

const deleteInventoryItem = async (id) => {
  const result = await pool.query(
    `
      DELETE FROM inventory_movements
      WHERE id = $1
      RETURNING
        id,
        product_id AS "productId",
        quantity,
        movement_type AS "movementType",
        notes,
        created_at AS "createdAt",
        updated_at AS "updatedAt";
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
