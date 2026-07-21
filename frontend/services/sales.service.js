const createApi = require("../utils/createApi");

const getSales = async (req) => {
  const api = createApi(req);
  const response = await api.get("/sales");
  return response.data.data;
};

const getSaleById = async (req, id) => {
  const api = createApi(req);
  const response = await api.get(`/sales/${id}`);
  return response.data.data;
};

const createSale = async (req, data) => {
  const api = createApi(req);
  const response = await api.post("/sales", data);
  return response.data.data;
};

module.exports = {
  getSales,
  getSaleById,
  createSale,
};
