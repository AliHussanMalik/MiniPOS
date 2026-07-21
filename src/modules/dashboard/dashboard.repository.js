// Dashboard Repository
// Database access and SQL aggregation queries for dashboard stats, recent sales, and low stock items.

const pool = require("../../config/db");

const getDashboardStats = async (storeId) => {
  const result = await pool.query(
    `
      SELECT
        (SELECT COUNT(*)::int FROM products WHERE store_id = $1 AND deleted_at IS NULL) AS "totalProducts",
        (SELECT COUNT(*)::int FROM categories WHERE store_id = $1) AS "totalCategories",
        (SELECT COUNT(*)::int FROM customers WHERE store_id = $1 AND deleted_at IS NULL) AS "totalCustomers",
        (SELECT COUNT(*)::int FROM stores WHERE status = 'ACTIVE') AS "totalStores",
        (SELECT COUNT(*)::int FROM store_users WHERE store_id = $1 AND is_active = true) AS "totalUsers",
        (SELECT COUNT(*)::int FROM sales WHERE store_id = $1 AND status = 'COMPLETED' AND created_at >= CURRENT_DATE) AS "todaySalesCount",
        (SELECT COALESCE(SUM(total_amount), 0) FROM sales WHERE store_id = $1 AND status = 'COMPLETED' AND created_at >= CURRENT_DATE) AS "todayRevenue",
        (SELECT COUNT(*)::int FROM products WHERE store_id = $1 AND deleted_at IS NULL AND stock_quantity <= minimum_stock) AS "lowStockCount";
    `,
    [storeId]
  );

  const row = result.rows[0];

  return {
    totalProducts: Number(row.totalProducts) || 0,
    totalCategories: Number(row.totalCategories) || 0,
    totalCustomers: Number(row.totalCustomers) || 0,
    totalStores: Number(row.totalStores) || 0,
    totalUsers: Number(row.totalUsers) || 0,
    todaySalesCount: Number(row.todaySalesCount) || 0,
    todayRevenue: Number(row.todayRevenue) || 0,
    lowStockCount: Number(row.lowStockCount) || 0,
  };
};

const getRecentSales = async (storeId, limit = 5) => {
  const result = await pool.query(
    `
      SELECT
        s.id,
        CONCAT('#', s.id) AS "sale_number",
        COALESCE(c.full_name, 'Walk-in Customer') AS "customer",
        s.total_amount AS "total",
        s.created_at AS "createdAt"
      FROM sales s
      LEFT JOIN customers c ON c.id = s.customer_id
      WHERE s.store_id = $1
      ORDER BY s.created_at DESC, s.id DESC
      LIMIT $2;
    `,
    [storeId, limit]
  );

  return result.rows.map((row) => ({
    id: row.id,
    sale_number: row.sale_number,
    customer: row.customer,
    total: Number(row.total) || 0,
    createdAt: row.createdAt,
  }));
};

const getLowStockProducts = async (storeId) => {
  const result = await pool.query(
    `
      SELECT
        id,
        name,
        sku,
        stock_quantity AS "quantity",
        minimum_stock AS "reorder_level"
      FROM products
      WHERE store_id = $1 AND deleted_at IS NULL AND stock_quantity <= minimum_stock
      ORDER BY stock_quantity ASC, id ASC;
    `,
    [storeId]
  );

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    sku: row.sku,
    quantity: Number(row.quantity) || 0,
    reorder_level: Number(row.reorder_level) || 0,
  }));
};

module.exports = {
  getDashboardStats,
  getRecentSales,
  getLowStockProducts,
};
