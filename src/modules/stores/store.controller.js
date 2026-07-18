const storeService = require("./store.service");
const storeDto = require("./store.dto");
const { asyncHandler, requireId } = require("../../utils/controller.helpers");

const createStore = asyncHandler(async (req, res) => {
  const store = await storeService.createStore(
    req.user.id,
    storeDto.toCreateStoreRequestDto(req.body)
  );

  res.status(201).json({
    message: "Store created successfully",
    data: storeDto.toStoreResponseDto(store),
  });
});

const getStores = asyncHandler(async (req, res) => {
  const stores = await storeService.getStores(req.user);

  res.status(200).json({
    data: storeDto.toStoresResponseDto(stores),
  });
});

const getStoreById = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const store = await storeService.getStoreById(id);
  const hasAccess = await storeService.canAccessStore(id, req.user);
  if (!hasAccess) return res.status(403).json({ message: "Access denied to this store" });

  res.status(200).json({
    data: storeDto.toStoreResponseDto(store),
  });
});

const updateStore = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const store = await storeService.getStoreById(id);
  if (store.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied. Only the owner can update the store." });
  }

  const updatedStore = await storeService.updateStore(id, storeDto.toUpdateStoreRequestDto(req.body));

  res.status(200).json({
    message: "Store updated successfully",
    data: storeDto.toStoreResponseDto(updatedStore),
  });
});

const deleteStore = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const store = await storeService.getStoreById(id);
  if (store.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied. Only the owner can delete the store." });
  }

  await storeService.deleteStore(id);

  res.status(200).json({
    message: "Store deleted successfully",
  });
});

const addUserToStore = asyncHandler(async (req, res) => {
  const storeId = Number(req.params.id);
  if (!Number.isInteger(storeId) || storeId < 1) {
    return res.status(400).json({ message: "Invalid Store ID" });
  }

  const store = await storeService.getStoreById(storeId);
  if (store.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied. Only the owner can assign users." });
  }

  const association = await storeService.addUserToStore(storeId, req.body);

  res.status(200).json({
    message: "User assigned to store successfully",
    data: association,
  });
});

const getStoreUsers = asyncHandler(async (req, res) => {
  const storeId = Number(req.params.id);
  if (!Number.isInteger(storeId) || storeId < 1) {
    return res.status(400).json({ message: "Invalid Store ID" });
  }

  // Ensure user has access to this store
  const store = await storeService.getStoreById(storeId);
  if (store.ownerId !== req.user.id && req.user.role !== "CUSTOMER") {
    // Basic verification: user is owner or they're browsing.
    // If not owner, they can't list staff
    if (req.user.role !== "OWNER") {
      return res.status(403).json({ message: "Access denied." });
    }
  }

  const users = await storeService.getStoreUsers(storeId);

  res.status(200).json({
    data: storeDto.toStoreUsersResponseDto(users),
  });
});

const removeUserFromStore = asyncHandler(async (req, res) => {
  const storeId = Number(req.params.id);
  const userId = Number(req.params.userId);
  if (!Number.isInteger(storeId) || storeId < 1 || !Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ message: "Invalid Store or User ID" });
  }

  const store = await storeService.getStoreById(storeId);
  if (store.ownerId !== req.user.id) {
    return res.status(403).json({ message: "Access denied. Only the owner can remove users." });
  }

  await storeService.removeUserFromStore(storeId, userId);

  res.status(200).json({
    message: "User removed from store successfully",
  });
});

module.exports = {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
  addUserToStore,
  getStoreUsers,
  removeUserFromStore,
};
