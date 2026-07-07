// Sale service
// Contains sale-related business logic and coordinates between controllers
// and repositories.

const productService = require("../products/product.service");
const saleRepository = require("./sale.repository");
const { ensureFound, mapDatabaseError } = require("../../utils/service.helpers");

const createSale = async (payload, actor) => {
  try {
    const productIds = payload.items.map(item => item.productId);

const products = await productService.findProductsByIds(productIds);

console.log("Products fetched:", products);
    return await saleRepository.createSale({
      ...payload,
      userId: actor.id,
    });
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create sale");
  }
};

const getSales = async () => {
  return saleRepository.findAllSales();
};

const getOwnSales = async (actor) => {
  return saleRepository.findSalesByUserId(actor.id);
};

const getSaleById = async (id) => {
  const sale = await saleRepository.findSaleById(id);

  return ensureFound(sale, "Sale not found");
};

const updateSale = async (id, payload) => {
  try {
    const sale = await saleRepository.updateSale(id, payload);

    return ensureFound(sale, "Sale not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update sale");
  }
};

const deleteSale = async (id) => {
  try {
    const sale = await saleRepository.deleteSale(id);

    return ensureFound(sale, "Sale not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to delete sale");
  }
};

module.exports = {
  createSale,
  getSales,
  getOwnSales,
  getSaleById,
  updateSale,
  deleteSale,
};
