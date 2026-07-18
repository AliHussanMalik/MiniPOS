// Sale service
// Contains sale-related business logic and coordinates between controllers
// and repositories.

const productService = require("../products/product.service");
const saleRepository = require("./sale.repository");
const { ensureFound, mapDatabaseError,createError } = require("../../utils/service.helpers");

const TAX_RATE = 0.17;

const createSale = async (storeId, payload, actor) => {
  try {
    const productIds = payload.items.map(item => item.productId);
    const products = await productService.findProductsByIds(productIds, storeId);

    if (products.length !== productIds.length){
      throw createError(404, "One one more products not found")
    }

    let subtotal = 0;

    const items = payload.items.map(item => {
      const product = products.find(p=> p.id === item.productId);

      if(!product){
        throw createError( 404 , `Product ${item.productId} was not found`);
      }

      if(!product.isActive){
        throw createError(400, `${product.name} is inactive`)
      }

      if (product.stockQuantity < item.quantity){
        throw createError(400, `insufficent stock for ${product.name}`)
      }

      const unitPrice = Number(product.sellingPrice);
      const itemSubtotal = unitPrice * item.quantity;
      
      subtotal+= itemSubtotal;

      return{
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        subtotal: itemSubtotal,
      };
    }
  );

  const discount = payload.discount ?? 0;
  const tax = subtotal * TAX_RATE;
  const totalAmount = subtotal - discount + tax;

    return await saleRepository.createSale({
      storeId,
      customerId: payload.customerId,
      userId: actor.id,
      subtotal,
      discount,
      tax,
      totalAmount,
      paymentMethod: payload.paymentMethod,
      status: payload.status,
      items,
    });
  } catch (error) {
    console.error(error)
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
    const sale = await saleRepository.updateSale(id, storeId, payload);

    return ensureFound(sale, "Sale not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update sale");
  }
};

const deleteSale = async (id, storeId) => {
  try {
    const sale = await saleRepository.deleteSale(id, storeId);

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
