const createApi = require("../utils/createApi");

const getReports = async (req, params = {}) => {
  const api = createApi(req);
  const response = await api.get("/reports", { params });
  return response.data.data;
};

const getSalesReport = async (req, params = {}) => {
  const api = createApi(req);
  const response = await api.get("/reports/sales", { params });
  return response.data.data;
};

const getInventoryReport = async (req, params = {}) => {
  const api = createApi(req);
  const response = await api.get("/reports/inventory", { params });
  return response.data.data;
};

module.exports = {
  getReports,
  getSalesReport,
  getInventoryReport,
};
