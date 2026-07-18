// Report controller
// Handles incoming HTTP requests for reports and sends HTTP responses.

const reportService = require("./report.service");
const reportDto = require("./report.dto");
const { asyncHandler } = require("../../utils/controller.helpers");

const getReports = asyncHandler(async (req, res) => {
  const reports = await reportService.getReports(req.storeId, reportDto.toReportQueryDto(req.query));

  res.status(200).json({ data: reportDto.toReportsResponseDto(reports) });
});

const getSalesReport = asyncHandler(async (req, res) => {
  const report = await reportService.getSalesReport(req.storeId, reportDto.toReportQueryDto(req.query));

  res.status(200).json({ data: reportDto.toSalesReportResponseDto(report) });
});

const getInventoryReport = asyncHandler(async (req, res) => {
  const report = await reportService.getInventoryReport(req.storeId, reportDto.toReportQueryDto(req.query));

  res.status(200).json({ data: reportDto.toInventoryReportResponseDto(report) });
});

module.exports = {
  getReports,
  getSalesReport,
  getInventoryReport,
};
