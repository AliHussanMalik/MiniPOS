// Sale service
// Contains sale-related business logic and coordinates between controllers
// and repositories.

const saleRepository = require("./sale.repository");
const { ensureFound, mapDatabaseError,createError } = require("../../utils/service.helpers");

const createSale = async (storeId, payload, actor) => {
  try {
    return await saleRepository.createSale({
      storeId,
      customerId: payload.customerId,
      userId: actor.id,
      discount: payload.discount,
      paymentMethod: payload.paymentMethod,
      items: payload.items,
    });
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to create sale");
  }
};

const getSales = async (storeId) => {
  return saleRepository.findAllSales(storeId);
};

const getOwnSales = async (actor, storeId) => {
  return saleRepository.findSalesByUserId(actor.id, storeId);
};

const getSaleById = async (id, storeId) => {
  const sale = await saleRepository.findSaleById(id, storeId);

  return ensureFound(sale, "Sale not found");
};

const updateSale = async (id, storeId, payload) => {
  try {
    const sale = await saleRepository.cancelSale(id, storeId);

    return ensureFound(sale, "Sale not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update sale");
  }
};

const deleteSale = async (id, storeId) => {
  throw createError(409, "Sales cannot be deleted. Cancel the sale instead.");
};

module.exports = {
  createSale,
  getSales,
  getOwnSales,
  getSaleById,
  updateSale,
  deleteSale,
};
