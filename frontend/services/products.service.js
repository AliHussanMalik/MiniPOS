const createApi = require("../utils/createApi");

const getProducts = async (req) => {
  const api = createApi(req);
  const response = await api.get("/products");
  return response.data.data;
};

const getProductById = async (req, id) => {
  const api = createApi(req);
  const response = await api.get(`/products/${id}`);
  return response.data.data;
};

const createProduct = async (req, data) => {
  const api = createApi(req);
  const response = await api.post("/products", data);
  return response.data.data;
};

const updateProduct = async (req, id, data) => {
  const api = createApi(req);
  const response = await api.put(`/products/${id}`, data);
  return response.data.data;
};

const deleteProduct = async (req, id) => {
  const api = createApi(req);
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
