const createApi = require("../utils/createApi");

const getCategories = async (req) => {
  const api = createApi(req);
  const response = await api.get("/categories");
  return response.data.data;
};

const getCategoryById = async (req, id) => {
  const api = createApi(req);
  const response = await api.get(`/categories/${id}`);
  return response.data.data;
};

const createCategory = async (req, data) => {
  const api = createApi(req);
  const response = await api.post("/categories", data);
  return response.data.data;
};

const updateCategory = async (req, id, data) => {
  const api = createApi(req);
  const response = await api.put(`/categories/${id}`, data);
  return response.data.data;
};

const deleteCategory = async (req, id) => {
  const api = createApi(req);
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
