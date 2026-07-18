const storeRepository = require("./store.repository");
const userRepository = require("../users/user.repository");
const { ensureFound, mapDatabaseError, createError } = require("../../utils/service.helpers");

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

const createStore = async (ownerId, payload) => {
  const slug = payload.slug || slugify(payload.name);

  try {
    return await storeRepository.createStore({
      ownerId,
      name: payload.name,
      slug,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
    });

  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to create store");
  }
};

const getStoreById = async (id) => {
  const store = await storeRepository.findStoreById(id);
  return ensureFound(store, "Store not found");
};

const canAccessStore = (id, actor) => storeRepository.hasStoreAccess(id, actor.id, actor.role);

const getStores = async (actor) => {
  if (actor.role === "OWNER") {
    return storeRepository.findStoresByOwnerId(actor.id);
  } else {
    return storeRepository.findStoresByUserId(actor.id);
  }
};

const updateStore = async (id, payload) => {
  if (payload.name && !payload.slug) {
    payload.slug = slugify(payload.name);
  }

  try {
    const store = await storeRepository.updateStore(id, payload);
    return ensureFound(store, "Store not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update store");
  }
};

const deleteStore = async (id) => {
  try {
    const store = await storeRepository.deleteStore(id);
    return ensureFound(store, "Store not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to delete store");
  }
};

const addUserToStore = async (storeId, { email, isActive = true }) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) {
    throw createError(404, "User not found with the provided email");
  }

  try {
    return await storeRepository.addUserToStore({
      storeId,
      userId: user.id,
      isActive,
    });
  } catch (error) {
    throw mapDatabaseError(error, "Unable to add user to store");
  }
};

const getStoreUsers = async (storeId) => {
  return storeRepository.findUsersByStoreId(storeId);
};

const removeUserFromStore = async (storeId, userId) => {
  const result = await storeRepository.removeUserFromStore(storeId, userId);
  return ensureFound(result, "User association not found in this store");
};

module.exports = {
  createStore,
  getStoreById,
  canAccessStore,
  getStores,
  updateStore,
  deleteStore,
  addUserToStore,
  getStoreUsers,
  removeUserFromStore,
};
