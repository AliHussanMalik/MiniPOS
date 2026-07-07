// Inventory service
// Contains inventory-related business logic and coordinates between controllers
// and repositories.

const inventoryRepository = require("./inventory.repository");
const { ensureFound, mapDatabaseError } = require("../../utils/service.helpers");

const createInventoryItem = async (payload) => {
  try {
    return await inventoryRepository.createInventoryItem(payload);
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create inventory movement");
  }
};

const getInventory = async () => {
  return inventoryRepository.findAllInventoryItems();
};

const getInventoryItemById = async (id) => {
  const item = await inventoryRepository.findInventoryItemById(id);

  return ensureFound(item, "Inventory movement not found");
};

const updateInventoryItem = async (id, payload) => {
  try {
    const item = await inventoryRepository.updateInventoryItem(id, payload);

    return ensureFound(item, "Inventory movement not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update inventory movement");
  }
};

const deleteInventoryItem = async (id) => {
  try {
    const item = await inventoryRepository.deleteInventoryItem(id);

    return ensureFound(item, "Inventory movement not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to delete inventory movement");
  }
};

module.exports = {
  createInventoryItem,
  getInventory,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
};
