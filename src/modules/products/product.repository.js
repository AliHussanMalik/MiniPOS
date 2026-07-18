const pool = require("../../config/db");
const { buildUpdateQuery } = require("../../utils/repository.helpers");

const productReturning = `
  id,
  store_id AS "storeId",
  name,
  category_id AS "categoryId",
  barcode,
  sku,
  description,
  cost_price AS "costPrice",
  selling_price AS "sellingPrice",
  stock_quantity AS "stockQuantity",
  minimum_stock AS "minimumStock",
  unit,
  is_active AS "isActive",
  created_at AS "createdAt",
  updated_at AS "updatedAt",
  deleted_at AS "deletedAt"
`;

const createProduct = async (storeId, {
  name,
  categoryId,
  barcode = null,
  sku = null,
  description = null,
  costPrice,
  sellingPrice,
  stockQuantity = 0,
  minimumStock = 0,
  unit,
  isActive = true,
}) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
    `
      INSERT INTO products (
        store_id,
        name,
        category_id,
        barcode,
        sku,
        description,
        cost_price,
        selling_price,
        stock_quantity,
        minimum_stock,
        unit,
        is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING ${productReturning};
    `,
    [
      storeId,
      name,
      categoryId,
      barcode,
      sku,
      description,
      costPrice,
      sellingPrice,
      0,
      minimumStock,
      unit,
      isActive,
    ]
    );
    const product = result.rows[0];
    if (stockQuantity > 0) {
      await client.query(
        "UPDATE products SET stock_quantity = $1 WHERE id = $2",
        [stockQuantity, product.id]
      );
      await client.query(
        "INSERT INTO inventory_movements (product_id, quantity, movement_type, notes) VALUES ($1, $2, 'STOCK_IN', 'Initial stock')",
        [product.id, stockQuantity]
      );
      product.stockQuantity = stockQuantity;
    }
    await client.query("COMMIT");
    return product;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findAllProducts = async (storeId) => {
  const result = await pool.query(
    `
      SELECT ${productReturning}
      FROM products
      WHERE store_id = $1 AND deleted_at IS NULL
      ORDER BY id;
    `,
    [storeId]
  );

  return result.rows;
};

const findProductById = async (id, storeId) => {
  const result = await pool.query(
    `
      SELECT ${productReturning}
      FROM products
      WHERE id = $1 AND store_id = $2 AND deleted_at IS NULL;
    `,
    [id, storeId]
  );

  return result.rows[0];
};

const updateProduct = async (id, storeId, data) => {
  const query = buildUpdateQuery({
    table: "products",
    id,
    data,
    columns: {
      name: "name",
      categoryId: "category_id",
      barcode: "barcode",
      sku: "sku",
      description: "description",
      costPrice: "cost_price",
      sellingPrice: "selling_price",
      minimumStock: "minimum_stock",
      unit: "unit",
      isActive: "is_active",
    },
    returning: productReturning,
  });

  if (!query) return findProductById(id, storeId);

  query.text = query.text.replace(
    `WHERE id = $${query.values.length}`,
    `WHERE id = $${query.values.length} AND store_id = $${query.values.length + 1}`
  );
  query.values.push(storeId);

  const result = await pool.query(query.text, query.values);

  return result.rows[0];
};

const deleteProduct = async (id, storeId) => {
  const result = await pool.query(
    `
      UPDATE products
      SET deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP , is_active = false
      WHERE id = $1 AND store_id = $2 AND deleted_at IS NULL
      RETURNING ${productReturning};
    `,
    [id, storeId]
  );

  return result.rows[0];
};

const findProductsByIds = async (productIds, storeId) => {
  const result = await pool.query(
    `
      SELECT ${productReturning}
      FROM products
      WHERE id = ANY($1::int[]) AND store_id = $2 AND deleted_at IS NULL;
    `,
    [productIds, storeId]
  );

  return result.rows;
};

module.exports = {
  createProduct,
  findAllProducts,
  findProductById,
  updateProduct,
  deleteProduct,
  findProductsByIds,
};
