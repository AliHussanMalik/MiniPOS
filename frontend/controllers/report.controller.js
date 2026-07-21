const reportsService = require("../services/reports.service");

const index = async (req, res, next) => {
  try {
    let salesReport = null;
    let inventoryReport = null;
    try {
      salesReport = await reportsService.getSalesReport(req);
      inventoryReport = await reportsService.getInventoryReport(req);
    } catch (err) {
      console.error("Failed to fetch reports:", err.response?.data || err.message);
    }

    return res.render("layouts/main", {
      title: "Store Analytics & Reports",
      page: "reports/index",
      salesReport,
      inventoryReport,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  index,
};
