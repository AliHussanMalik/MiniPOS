// Category service
// Contains category-related business logic and coordinates between controllers
// and repositories.

const categoryRepository = require("./category.repository");
const { ensureFound, mapDatabaseError } = require("../../utils/service.helpers");

const createCategory = async (payload) => {
  try {
    return await categoryRepository.createCategory(payload);
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create category");
  }
};

const getCategories = async () => {
  return categoryRepository.findAllCategories();
};

const getCategoryById = async (id) => {
  const category = await categoryRepository.findCategoryById(id);

  return ensureFound(category, "Category not found");
};

const updateCategory = async (id, payload) => {
  try {
    const category = await categoryRepository.updateCategory(id, payload);

    return ensureFound(category, "Category not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update category");
  }
};

const deleteCategory = async (id) => {
  try {
    const category = await categoryRepository.deleteCategory(id);

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
