const inventoryService = require("../inventory/inventory.service");
const productRepository = require("./product.repository");
const { ensureFound, mapDatabaseError } = require("../../utils/service.helpers");

const createProduct = async (storeId, payload) => {
  try {
    const product = await productRepository.createProduct(storeId, payload);

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

const getProducts = async (storeId) => {
  return productRepository.findAllProducts(storeId);
};

const getProductById = async (id, storeId) => {
  const product = await productRepository.findProductById(id, storeId);

  return ensureFound(product, "Product not found");
};

const updateProduct = async (id, storeId, payload) => {
  try {
    const product = await productRepository.updateProduct(id, storeId, payload);

    return ensureFound(product, "Product not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update product");
  }
};

const deleteProduct = async (id, storeId) => {
  try {
    const product = await productRepository.deleteProduct(id, storeId);

    return ensureFound(product, "Product not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to delete product");
  }
};

const findProductsByIds = async (ids, storeId) => {
  return productRepository.findProductsByIds(ids, storeId);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  findProductsByIds,
};
