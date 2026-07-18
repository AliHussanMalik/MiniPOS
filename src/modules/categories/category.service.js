// Category service
// Contains category-related business logic and coordinates between controllers
// and repositories.

const categoryRepository = require("./category.repository");
const { ensureFound, mapDatabaseError } = require("../../utils/service.helpers");

const createCategory = async (storeId, payload) => {
  try {
    return await categoryRepository.createCategory(storeId, payload);
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create category");
  }
};

const getCategories = async (storeId) => {
  return categoryRepository.findAllCategories(storeId);
};

const getCategoryById = async (id, storeId) => {
  const category = await categoryRepository.findCategoryById(id, storeId);

  return ensureFound(category, "Category not found");
};

const updateCategory = async (id, storeId, payload) => {
  try {
    const category = await categoryRepository.updateCategory(id, storeId, payload);

    return ensureFound(category, "Category not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update category");
  }
};

const deleteCategory = async (id, storeId) => {
  try {
    const category = await categoryRepository.deleteCategory(id, storeId);

    return ensureFound(category, "Category not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to delete category");
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
