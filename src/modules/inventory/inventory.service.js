const inventoryRepository = require("./inventory.repository");
const { ensureFound, mapDatabaseError, createError } = require("../../utils/service.helpers");

const createInventoryItem = async (storeId, payload) => {
  try {
    return await inventoryRepository.createInventoryItem(storeId, payload);
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to create inventory movement");
  }
};

const getInventory = (storeId) => inventoryRepository.findAllInventoryItems(storeId);

const getInventoryItemById = async (id, storeId) => {
  return ensureFound(await inventoryRepository.findInventoryItemById(id, storeId), "Inventory movement not found");
};

const updateInventoryItem = async () => {
  throw createError(409, "Inventory movements are immutable. Create an offsetting movement instead.");
};

const deleteInventoryItem = async () => {
  throw createError(409, "Inventory movements are immutable. Create an offsetting movement instead.");
};

module.exports = { createInventoryItem, getInventory, getInventoryItemById, updateInventoryItem, deleteInventoryItem };
