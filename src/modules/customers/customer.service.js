// Customer service
// Contains customer-related business logic and coordinates between controllers
// and repositories.

const customerRepository = require("./customer.repository");
const { ensureFound, mapDatabaseError } = require("../../utils/service.helpers");

const createCustomer = async (storeId, payload) => {
  try {
    return await customerRepository.createCustomer(storeId, payload);
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create customer");
  }
};

const getCustomers = async (storeId) => {
  return customerRepository.findAllCustomers(storeId);
};

const getCustomerById = async (id, storeId) => {
  const customer = await customerRepository.findCustomerById(id, storeId);

  return ensureFound(customer, "Customer not found");
};

const getOwnCustomerProfile = async (actor, storeId) => {
  const customer = await customerRepository.findCustomerByEmail(actor.email, storeId);

  return ensureFound(customer, "Customer profile not found");
};

const updateCustomer = async (id, storeId, payload) => {
  try {
    const customer = await customerRepository.updateCustomer(id, storeId, payload);

    return ensureFound(customer, "Customer not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update customer");
  }
};

const updateOwnCustomerProfile = async (actor, storeId, payload) => {
  const customer = await getOwnCustomerProfile(actor, storeId);

  return updateCustomer(customer.id, storeId, payload);
};

const deleteCustomer = async (id, storeId) => {
  try {
    const customer = await customerRepository.deleteCustomer(id, storeId);

    return ensureFound(customer, "Customer not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to delete customer");
  }
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  getOwnCustomerProfile,
  updateCustomer,
  updateOwnCustomerProfile,
  deleteCustomer,
};
