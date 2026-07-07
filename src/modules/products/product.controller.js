// Product controller
// Handles incoming HTTP requests for products and sends HTTP responses.
// Business rules should live in the service layer when implementation is added.

const productService = require("./product.service");
const productDto = require("./product.dto");
const { asyncHandler, requireId } = require("../../utils/controller.helpers");

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(productDto.toCreateProductRequestDto(req.body));

  res.status(201).json({ message: "Product created successfully", data: productDto.toProductResponseDto(product) });
});

const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getProducts();

  res.status(200).json({ data: productDto.toProductsResponseDto(products) });
});

const getProductById = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const product = await productService.getProductById(id);

  res.status(200).json({ data: productDto.toProductResponseDto(product) });
});

const updateProduct = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const product = await productService.updateProduct(id, productDto.toUpdateProductRequestDto(req.body));

  res.status(200).json({ message: "Product updated successfully", data: productDto.toProductResponseDto(product) });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  await productService.deleteProduct(id);

  res.status(200).json({ message: "Product deleted successfully" });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
