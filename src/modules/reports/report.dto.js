const { pickDefined, toDtoList } = require("../../utils/dto.helpers");

const reportQueryFields = ["startDate", "endDate", "userId", "customerId", "productId"];
const salesReportFields = ["saleCount", "subtotal", "discount", "tax", "totalAmount"];
const inventoryReportFields = ["productId", "productName", "stockIn", "stockOut", "adjustments"];

const toReportQueryDto = (query) => {
  return pickDefined(query, reportQueryFields);
};

const toSalesReportResponseDto = (report) => {
  return pickDefined(report, salesReportFields);
};

const toInventoryReportItemResponseDto = (item) => {
  return pickDefined(item, inventoryReportFields);
};

const toInventoryReportResponseDto = (report) => {
  return toDtoList(report, toInventoryReportItemResponseDto);
};

const toReportsResponseDto = (reports) => {
  return {
    sales: toSalesReportResponseDto(reports.sales),
    inventory: toInventoryReportResponseDto(reports.inventory),
  };
};

module.exports = {
  toReportQueryDto,
  toSalesReportResponseDto,
  toInventoryReportResponseDto,
  toReportsResponseDto,
};
