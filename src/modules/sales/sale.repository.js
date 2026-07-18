const pool = require("../../config/db");
const { createError } = require("../../utils/service.helpers");

const TAX_RATE_PERCENT = 17;

const saleReturning = `
  id, store_id AS "storeId", customer_id AS "customerId", user_id AS "userId",
  subtotal, discount, tax, total_amount AS "totalAmount", payment_method AS "paymentMethod",
  status, created_at AS "createdAt", updated_at AS "updatedAt"
`;

const saleItemReturning = `
  id, sale_id AS "saleId", product_id AS "productId", quantity, unit_price AS "unitPrice",
  subtotal, created_at AS "createdAt"
`;

const toCents = (value) => Math.round(Number(value) * 100);
const fromCents = (value) => (value / 100).toFixed(2);

const attachItems = async (sale) => {
  if (!sale) return undefined;
  const result = await pool.query(`SELECT ${saleItemReturning} FROM sale_items WHERE sale_id = $1 ORDER BY id`, [sale.id]);
  return { ...sale, items: result.rows };
};

const insertSaleItems = async (client, saleId, items) => {
  const savedItems = [];
  for (const item of items) {
    const result = await client.query(
      `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
       VALUES ($1, $2, $3, $4, $5) RETURNING ${saleItemReturning}`,
      [saleId, item.productId, item.quantity, item.unitPrice, item.subtotal]
    );
    savedItems.push(result.rows[0]);
  }
  return savedItems;
};

const createSale = async ({ storeId, customerId = null, userId, discount = 0, paymentMethod, items }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    if (customerId) {
      const customer = await client.query(
        "SELECT 1 FROM customers WHERE id = $1 AND store_id = $2 AND deleted_at IS NULL",
        [customerId, storeId]
      );
      if (!customer.rowCount) throw createError(404, "Customer not found");
    }

    const quantities = new Map();
    for (const item of items) quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
    const productIds = [...quantities.keys()];
    const products = await client.query(
      `SELECT id, name, selling_price AS "sellingPrice", stock_quantity AS "stockQuantity", is_active AS "isActive"
       FROM products WHERE id = ANY($1::int[]) AND store_id = $2 AND deleted_at IS NULL FOR UPDATE`,
      [productIds, storeId]
    );
    if (products.rowCount !== productIds.length) throw createError(404, "One or more products were not found");

    let subtotalCents = 0;
    const saleItems = products.rows.map((product) => {
      const quantity = quantities.get(product.id);
      if (!product.isActive) throw createError(400, `${product.name} is inactive`);
      if (product.stockQuantity < quantity) throw createError(400, `Insufficient stock for ${product.name}`);
      const unitPriceCents = toCents(product.sellingPrice);
      const itemSubtotalCents = unitPriceCents * quantity;
      subtotalCents += itemSubtotalCents;
      return { productId: product.id, quantity, unitPrice: fromCents(unitPriceCents), subtotal: fromCents(itemSubtotalCents) };
    });

    const discountCents = toCents(discount);
    const taxCents = Math.round((subtotalCents * TAX_RATE_PERCENT) / 100);
    const totalCents = subtotalCents - discountCents + taxCents;
    if (discountCents < 0 || totalCents < 0) throw createError(400, "Discount exceeds sale total");

    const saleResult = await client.query(
      `INSERT INTO sales (store_id, customer_id, user_id, subtotal, discount, tax, total_amount, payment_method, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'COMPLETED') RETURNING ${saleReturning}`,
      [storeId, customerId, userId, fromCents(subtotalCents), fromCents(discountCents), fromCents(taxCents), fromCents(totalCents), paymentMethod]
    );
    const sale = saleResult.rows[0];
    const savedItems = await insertSaleItems(client, sale.id, saleItems);

    for (const item of saleItems) {
      await client.query("UPDATE products SET stock_quantity = stock_quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [item.quantity, item.productId]);
      await client.query(
        "INSERT INTO inventory_movements (product_id, quantity, movement_type, notes) VALUES ($1, $2, 'STOCK_OUT', $3)",
        [item.productId, item.quantity, `Sale #${sale.id}`]
      );
    }
    await client.query("COMMIT");
    return { ...sale, items: savedItems };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findAllSales = async (storeId) => (await pool.query(`SELECT ${saleReturning} FROM sales WHERE store_id = $1 ORDER BY id`, [storeId])).rows;
const findSalesByUserId = async (userId, storeId) => (await pool.query(`SELECT ${saleReturning} FROM sales WHERE user_id = $1 AND store_id = $2 ORDER BY id`, [userId, storeId])).rows;
const findSaleById = async (id, storeId) => attachItems((await pool.query(`SELECT ${saleReturning} FROM sales WHERE id = $1 AND store_id = $2`, [id, storeId])).rows[0]);

const cancelSale = async (id, storeId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const saleResult = await client.query(`SELECT ${saleReturning} FROM sales WHERE id = $1 AND store_id = $2 FOR UPDATE`, [id, storeId]);
    const sale = saleResult.rows[0];
    if (!sale) {
      await client.query("COMMIT");
      return undefined;
    }
    if (sale.status === "CANCELLED") throw createError(409, "Sale is already cancelled");
    const itemResult = await client.query(`SELECT ${saleItemReturning} FROM sale_items WHERE sale_id = $1 ORDER BY id`, [id]);
    for (const item of itemResult.rows) {
      await client.query("UPDATE products SET stock_quantity = stock_quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [item.quantity, item.productId]);
      await client.query("INSERT INTO inventory_movements (product_id, quantity, movement_type, notes) VALUES ($1, $2, 'STOCK_IN', $3)", [item.productId, item.quantity, `Cancellation of sale #${id}`]);
    }
    const updated = await client.query(`UPDATE sales SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING ${saleReturning}`, [id]);
    await client.query("COMMIT");
    return { ...updated.rows[0], items: itemResult.rows };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { createSale, findAllSales, findSalesByUserId, findSaleById, cancelSale };
