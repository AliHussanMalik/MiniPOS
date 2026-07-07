const inventoryService = require("../inventory/inventory.service");
const productRepository = require("./product.repository");
const { ensureFound, mapDatabaseError } = require("../../utils/service.helpers");

const createProduct = async (payload) => {
  try {
    const product = await productRepository.createProduct(payload);

    if (product.stockQuantity > 0) {
      await inventoryService.createInventoryItem({
        productId: product.id,
        quantity: product.stockQuantity,
        movementType: "STOCK_IN",
        notes: "Initial Stock",
      });
    }

    return product;
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create product");
  }
};

const getProducts = async () => {
  return productRepository.findAllProducts();
};

const getProductById = async (id) => {
  const product = await productRepository.findProductById(id);

  return ensureFound(product, "Product not found");
};

const updateProduct = async (id, payload) => {
  try {
    const product = await productRepository.updateProduct(id, payload);

    return ensureFound(product, "Product not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update product");
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await productRepository.deleteProduct(id);

    return ensureFound(product, "Product not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to delete product");
  }
};
const findProductsByIds = async (ids) => {
  return productRepository.findProductsByIds(ids);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  findProductsByIds,
};
