// Sale controller
// Handles incoming HTTP requests for sales and sends HTTP responses.

const saleService = require("./sale.service");
const saleDto = require("./sale.dto");
const { asyncHandler, requireId } = require("../../utils/controller.helpers");

const createSale = asyncHandler(async (req, res) => {
  const sale = await saleService.createSale(req.storeId, saleDto.toCreateSaleRequestDto(req.body), req.user);

  res.status(201).json({ message: "Sale created successfully", data: saleDto.toSaleResponseDto(sale) });
});

const getSales = asyncHandler(async (req, res) => {
  const sales = await saleService.getSales(req.storeId);

  res.status(200).json({ data: saleDto.toSalesResponseDto(sales) });
});

const getOwnSales = asyncHandler(async (req, res) => {
  const sales = await saleService.getOwnSales(req.user, req.storeId);

  res.status(200).json({ data: saleDto.toSalesResponseDto(sales) });
});

const getSaleById = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const sale = await saleService.getSaleById(id, req.storeId);

  res.status(200).json({ data: saleDto.toSaleResponseDto(sale) });
});

const updateSale = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const sale = await saleService.updateSale(id, req.storeId, saleDto.toUpdateSaleRequestDto(req.body));

  res.status(200).json({ message: "Sale updated successfully", data: saleDto.toSaleResponseDto(sale) });
});

const deleteSale = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  await saleService.deleteSale(id, req.storeId);

  res.status(200).json({ message: "Sale deleted successfully" });
});

module.exports = {
  createSale,
  getSales,
  getOwnSales,
  getSaleById,
  updateSale,
  deleteSale,
};
