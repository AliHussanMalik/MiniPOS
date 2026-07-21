const createApi = require("../utils/createApi");

const getStores = async (req) => {
  const api = createApi(req);
  const response = await api.get("/stores");
  return response.data.data;
};

const getStoreById = async (req, id) => {
  const api = createApi(req);
  const response = await api.get(`/stores/${id}`);
  return response.data.data;
};

const createStore = async (req, data) => {
  const api = createApi(req);
  const response = await api.post("/stores", data);
  return response.data.data;
};

const updateStore = async (req, id, data) => {
  const api = createApi(req);
  const response = await api.put(`/stores/${id}`, data);
  return response.data.data;
};

const deleteStore = async (req, id) => {
  const api = createApi(req);
  const response = await api.delete(`/stores/${id}`);
  return response.data;
};

module.exports = {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
};
