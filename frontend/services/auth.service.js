const api = require("../config/api");

/**
 * Authenticate user
 */
const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
};

/**
 * Register new owner
 */
const signup = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data.data;
};

module.exports = {
  login,
  signup,
};