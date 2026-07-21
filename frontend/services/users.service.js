const createApi = require("../utils/createApi");

const getUsers = async (req) => {
  const api = createApi(req);
  const response = await api.get("/users");
  return response.data.data;
};

const getUserById = async (req, id) => {
  const api = createApi(req);
  const response = await api.get(`/users/${id}`);
  return response.data.data;
};

const createUser = async (req, data) => {
  const api = createApi(req);
  const response = await api.post("/users", data);
  return response.data.data;
};

const updateUser = async (req, id, data) => {
  const api = createApi(req);
  const response = await api.put(`/users/${id}`, data);
  return response.data.data;
};

const deleteUser = async (req, id) => {
  const api = createApi(req);
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};