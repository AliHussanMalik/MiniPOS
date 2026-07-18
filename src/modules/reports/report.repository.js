// Report repository
// Responsible for report data access and database communication.

const pool = require("../../config/db");

const buildSalesFilters = ({ storeId, startDate, endDate, userId, customerId }) => {
  const conditions = ["store_id = $1"];
  const values = [storeId];

  if (startDate) {
    values.push(startDate);
    conditions.push(`created_at >= $${values.length}`);
  }

  if (endDate) {
    values.push(endDate);
    conditions.push(`created_at <= $${values.length}`);
  }

  if (userId) {
    values.push(Number(userId));
    conditions.push(`user_id = $${values.length}`);
  }

  if (customerId) {
    values.push(Number(customerId));
    conditions.push(`customer_id = $${values.length}`);
  }

  return {
    where: `WHERE ${conditions.join(" AND ")}`,
    values,
  };
};

const findReports = async (storeId, filters) => {
  const [sales, inventory] = await Promise.all([
    findSalesReport(storeId, filters),
    findInventoryReport(storeId, filters),
  ]);

  return { sales, inventory };
};

const findSalesReport = async (storeId, filters = {}) => {
  const { where, values } = buildSalesFilters({ storeId, ...filters });
  const result = await pool.query(
    `
      SELECT
        COUNT(*)::int AS "saleCount",
        COALESCE(SUM(subtotal), 0) AS subtotal,
        COALESCE(SUM(discount), 0) AS discount,
        COALESCE(SUM(tax), 0) AS tax,
        COALESCE(SUM(total_amount), 0) AS "totalAmount"
      FROM sales
      ${where};
    `,
    values
  );

  return result.rows[0];
};

const findInventoryReport = async (storeId, { productId } = {}) => {
  const values = [storeId];
  const conditions = ["p.store_id = $1"];

  if (productId) {
    values.push(Number(productId));
    conditions.push(`im.product_id = $${values.length}`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;
  const result = await pool.query(
    `
      SELECT
        im.product_id AS "productId",
        p.name AS "productName",
        COALESCE(SUM(CASE WHEN im.movement_type = 'STOCK_IN' THEN im.quantity ELSE 0 END), 0)::int AS "stockIn",
        COALESCE(SUM(CASE WHEN im.movement_type = 'STOCK_OUT' THEN im.quantity ELSE 0 END), 0)::int AS "stockOut",
        COALESCE(SUM(CASE WHEN im.movement_type = 'ADJUSTMENT' THEN im.quantity ELSE 0 END), 0)::int AS adjustments
      FROM inventory_movements im
      JOIN products p ON p.id = im.product_id
      ${where}
      GROUP BY im.product_id, p.name
      ORDER BY im.product_id;
    `,
    values
  );

  return result.rows;
};

module.exports = {
  findReports,
  findSalesReport,
  findInventoryReport,
};
