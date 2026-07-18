// Category controller
// Handles incoming HTTP requests for categories and sends HTTP responses.

const categoryService = require("./category.service");
const categoryDto = require("./category.dto");
const { asyncHandler, requireId } = require("../../utils/controller.helpers");

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(
    req.storeId,
    categoryDto.toCreateCategoryRequestDto(req.body)
  );

  res.status(201).json({ message: "Category created successfully", data: categoryDto.toCategoryResponseDto(category) });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories(req.storeId);

  res.status(200).json({ data: categoryDto.toCategoriesResponseDto(categories) });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const category = await categoryService.getCategoryById(id, req.storeId);

  res.status(200).json({ data: categoryDto.toCategoryResponseDto(category) });
});

const updateCategory = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const category = await categoryService.updateCategory(id, req.storeId, categoryDto.toUpdateCategoryRequestDto(req.body));

  res.status(200).json({ message: "Category updated successfully", data: categoryDto.toCategoryResponseDto(category) });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  await categoryService.deleteCategory(id, req.storeId);

  res.status(200).json({ message: "Category deleted successfully" });
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
