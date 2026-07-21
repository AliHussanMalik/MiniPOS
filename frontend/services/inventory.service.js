const createApi = require("../utils/createApi");

const getInventory = async (req) => {
  const api = createApi(req);
  const response = await api.get("/inventory");
  return response.data.data;
};

const getInventoryItemById = async (req, id) => {
  const api = createApi(req);
  const response = await api.get(`/inventory/${id}`);
  return response.data.data;
};

const createInventoryItem = async (req, data) => {
  const api = createApi(req);
  const response = await api.post("/inventory", data);
  return response.data.data;
};

const updateInventoryItem = async (req, id, data) => {
  const api = createApi(req);
  const response = await api.put(`/inventory/${id}`, data);
  return response.data.data;
};

const deleteInventoryItem = async (req, id) => {
  const api = createApi(req);
  const response = await api.delete(`/inventory/${id}`);
  return response.data;
};

module.exports = {
  getInventory,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
};
