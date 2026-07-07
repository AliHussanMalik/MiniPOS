// Customer service
// Contains customer-related business logic and coordinates between controllers
// and repositories.

const customerRepository = require("./customer.repository");
const { ensureFound, mapDatabaseError } = require("../../utils/service.helpers");

const createCustomer = async (payload) => {
  try {
    return await customerRepository.createCustomer(payload);
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create customer");
  }
};

const getCustomers = async () => {
  return customerRepository.findAllCustomers();
};

const getCustomerById = async (id) => {
  const customer = await customerRepository.findCustomerById(id);

  return ensureFound(customer, "Customer not found");
};

const getOwnCustomerProfile = async (actor) => {
  const customer = await customerRepository.findCustomerByEmail(actor.email);

  return ensureFound(customer, "Customer profile not found");
};

const updateCustomer = async (id, payload) => {
  try {
    const customer = await customerRepository.updateCustomer(id, payload);

    return ensureFound(customer, "Customer not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update customer");
  }
};

const updateOwnCustomerProfile = async (actor, payload) => {
  const customer = await getOwnCustomerProfile(actor);

  return updateCustomer(customer.id, payload);
};

const deleteCustomer = async (id) => {
  try {
    const customer = await customerRepository.deleteCustomer(id);

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
