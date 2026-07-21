const createApi = require("../utils/createApi");

const getCustomers = async (req) => {
  const api = createApi(req);
  const response = await api.get("/customers");
  return response.data.data;
};

const getCustomerById = async (req, id) => {
  const api = createApi(req);
  const response = await api.get(`/customers/${id}`);
  return response.data.data;
};

const createCustomer = async (req, data) => {
  const api = createApi(req);
  const response = await api.post("/customers", data);
  return response.data.data;
};

const updateCustomer = async (req, id, data) => {
  const api = createApi(req);
  const response = await api.put(`/customers/${id}`, data);
  return response.data.data;
};

const deleteCustomer = async (req, id) => {
  const api = createApi(req);
  const response = await api.delete(`/customers/${id}`);
  return response.data;
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
