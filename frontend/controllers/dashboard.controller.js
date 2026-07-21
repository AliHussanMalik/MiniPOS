const dashboardService = require("../services/dashboard.service");
const storesService = require("../services/stores.service");
const path = require("path");
const ejs = require("ejs");

const index = async (req, res, next) => {
  try {
    // If no active store selected in session, try fetching user's stores and select the first one
    if (!req.session.currentStoreId) {
      try {
        const stores = await storesService.getStores(req);
        if (Array.isArray(stores) && stores.length > 0) {
          req.session.currentStoreId = stores[0].id;
          req.session.currentStore = stores[0];
          res.locals.currentStoreId = stores[0].id;
          res.locals.currentStore = stores[0];
        }
      } catch (e) {
        console.warn("Could not auto-fetch stores for dashboard:", e.message);
      }
    }

    let dashboardData;
    try {
      dashboardData = await dashboardService.getDashboardData(req);
    } catch (apiErr) {
      console.error("Dashboard API Error:", apiErr.response?.data || apiErr.message);
      dashboardData = {
        stats: {
          totalProducts: 0,
          totalCategories: 0,
          totalCustomers: 0,
          totalStores: 0,
          totalUsers: 0,
          todaySalesCount: 0,
          todayRevenue: 0,
          lowStockCount: 0,
        },
        recentSales: [],
        lowStockProducts: [],
      };
    }

    const user = req.session?.user || null;

    const body = await ejs.renderFile(
      path.join(__dirname, "../views/dashboard/index.ejs"),
      {
        title: "Dashboard",
        page: "dashboard/index",
        user,
        dashboard: dashboardData,
      }
    );

    return res.render("layouts/main", {
      title: "Dashboard",
      page: "dashboard/index",
      user,
      body,
      dashboard: dashboardData,
    });
  } catch (err) {
    console.error("Dashboard Controller Error:", err);
    next(err);
  }
};

module.exports = {
  index,
};