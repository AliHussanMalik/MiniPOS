// Report service
// Contains report-related business logic and coordinates between controllers
// and repositories.

const reportRepository = require("./report.repository");

const getReports = async (filters) => {
  return reportRepository.findReports(filters);
};

const getSalesReport = async (filters) => {
  return reportRepository.findSalesReport(filters);
};

const getInventoryReport = async (filters) => {
  return reportRepository.findInventoryReport(filters);
};

module.exports = {
  getReports,
  getSalesReport,
  getInventoryReport,
};
