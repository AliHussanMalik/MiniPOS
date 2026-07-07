// Report controller
// Handles incoming HTTP requests for reports and sends HTTP responses.
// Report generation rules should live in the service layer when implementation is added.

const reportService = require("./report.service");
const reportDto = require("./report.dto");
const { asyncHandler } = require("../../utils/controller.helpers");

const getReports = asyncHandler(async (req, res) => {
  const reports = await reportService.getReports(reportDto.toReportQueryDto(req.query));

  res.status(200).json({ data: reportDto.toReportsResponseDto(reports) });
});

const getSalesReport = asyncHandler(async (req, res) => {
  const report = await reportService.getSalesReport(reportDto.toReportQueryDto(req.query));

  res.status(200).json({ data: reportDto.toSalesReportResponseDto(report) });
});

const getInventoryReport = asyncHandler(async (req, res) => {
  const report = await reportService.getInventoryReport(reportDto.toReportQueryDto(req.query));

  res.status(200).json({ data: reportDto.toInventoryReportResponseDto(report) });
});

module.exports = {
  getReports,
  getSalesReport,
  getInventoryReport,
};
