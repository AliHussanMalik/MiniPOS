// Dashboard Service
// Business logic for combining aggregated statistics, recent sales, and low-stock alerts.

const dashboardRepository = require("./dashboard.repository");

const getDashboardData = async (storeId) => {
  const [stats, recentSales, lowStockProducts] = await Promise.all([
    dashboardRepository.getDashboardStats(storeId),
    dashboardRepository.getRecentSales(storeId, 5),
    dashboardRepository.getLowStockProducts(storeId),
  ]);

  return {
    stats,
    recentSales,
    lowStockProducts,
  };
};

module.exports = {
  getDashboardData,
};
