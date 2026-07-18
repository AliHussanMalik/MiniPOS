// Report service
// Contains report-related business logic and coordinates between controllers
// and repositories.

const reportRepository = require("./report.repository");

const getReports = async (storeId, filters) => {
  return reportRepository.findReports(storeId, filters);
};

const getSalesReport = async (storeId, filters) => {
  return reportRepository.findSalesReport(storeId, filters);
};

const getInventoryReport = async (storeId, filters) => {
  return reportRepository.findInventoryReport(storeId, filters);
};

module.exports = {
  getReports,
  getSalesReport,
  getInventoryReport,
};
