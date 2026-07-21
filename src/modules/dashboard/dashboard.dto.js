// Dashboard DTO
// Formats dashboard service response into API response structures.

const toDashboardResponseDto = (data) => {
  return {
    stats: {
      totalProducts: data.stats.totalProducts,
      totalCategories: data.stats.totalCategories,
      totalCustomers: data.stats.totalCustomers,
      totalStores: data.stats.totalStores,
      totalUsers: data.stats.totalUsers,
      todaySalesCount: data.stats.todaySalesCount,
      todayRevenue: data.stats.todayRevenue,
      lowStockCount: data.stats.lowStockCount,
    },
    recentSales: data.recentSales.map((sale) => ({
      id: sale.id,
      sale_number: sale.sale_number,
      customer: sale.customer,
      total: sale.total,
      createdAt: sale.createdAt,
    })),
    lowStockProducts: data.lowStockProducts.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      quantity: product.quantity,
      reorder_level: product.reorder_level,
    })),
  };
};

module.exports = {
  toDashboardResponseDto,
};
