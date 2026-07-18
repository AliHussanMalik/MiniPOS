const pool = require("../../config/db");
const { createError } = require("../../utils/service.helpers");

const inventoryReturning = `
  im.id, im.product_id AS "productId", im.quantity, im.movement_type AS "movementType",
  im.notes, im.created_at AS "createdAt", im.updated_at AS "updatedAt"
`;

const createInventoryItem = async (storeId, { productId, quantity, movementType, notes = null }) => {
  const delta = movementType === "STOCK_OUT" ? -quantity : quantity;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const product = await client.query(
      `UPDATE products SET stock_quantity = stock_quantity + $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND store_id = $3 AND deleted_at IS NULL AND stock_quantity + $1 >= 0
       RETURNING id`,
      [delta, productId, storeId]
    );
    if (!product.rowCount) throw createError(400, "Product not found or insufficient stock");
    const result = await client.query(
      `INSERT INTO inventory_movements (product_id, quantity, movement_type, notes)
       VALUES ($1, $2, $3, $4) RETURNING id, product_id AS "productId", quantity,
       movement_type AS "movementType", notes, created_at AS "createdAt", updated_at AS "updatedAt"`,
      [productId, quantity, movementType, notes]
    );
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findAllInventoryItems = async (storeId) => {
  const result = await pool.query(`SELECT ${inventoryReturning} FROM inventory_movements im JOIN products p ON p.id = im.product_id WHERE p.store_id = $1 ORDER BY im.id`, [storeId]);
  return result.rows;
};

const findInventoryItemById = async (id, storeId) => {
  const result = await pool.query(`SELECT ${inventoryReturning} FROM inventory_movements im JOIN products p ON p.id = im.product_id WHERE im.id = $1 AND p.store_id = $2`, [id, storeId]);
  return result.rows[0];
};

module.exports = { createInventoryItem, findAllInventoryItems, findInventoryItemById };
