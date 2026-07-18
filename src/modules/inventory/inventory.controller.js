// Inventory controller
// Handles incoming HTTP requests for inventory and sends HTTP responses.

const inventoryService = require("./inventory.service");
const inventoryDto = require("./inventory.dto");
const { asyncHandler, requireId } = require("../../utils/controller.helpers");

const createInventoryItem = asyncHandler(async (req, res) => {
  const item = await inventoryService.createInventoryItem(inventoryDto.toCreateInventoryRequestDto(req.body));

  res.status(201).json({ message: "Inventory movement created successfully", data: inventoryDto.toInventoryResponseDto(item) });
});

const getInventory = asyncHandler(async (req, res) => {
  const items = await inventoryService.getInventory(req.storeId);

  res.status(200).json({ data: inventoryDto.toInventoryListResponseDto(items) });
});

const getInventoryItemById = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const item = await inventoryService.getInventoryItemById(id, req.storeId);

  res.status(200).json({ data: inventoryDto.toInventoryResponseDto(item) });
});

const updateInventoryItem = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const item = await inventoryService.updateInventoryItem(id, inventoryDto.toUpdateInventoryRequestDto(req.body));

  res.status(200).json({ message: "Inventory movement updated successfully", data: inventoryDto.toInventoryResponseDto(item) });
});

const deleteInventoryItem = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  await inventoryService.deleteInventoryItem(id);

  res.status(200).json({ message: "Inventory movement deleted successfully" });
});

module.exports = {
  createInventoryItem,
  getInventory,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
};
