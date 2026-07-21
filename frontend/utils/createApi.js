const axios = require("axios")
// const api = require("../config/api");

const createApi = (req) => {
  const storeId = req?.session?.currentStoreId || req?.session?.user?.storeId || "";

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${req?.session?.token || ""}`,
  };

  if (storeId) {
    headers["X-Store-Id"] = storeId;
  }

  return axios.create({
    baseURL: process.env.API_BASE_URL || "http://localhost:3000/api",
    timeout: 10000,
    headers,
  });
};

module.exports = createApi;