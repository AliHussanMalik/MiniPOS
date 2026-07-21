const createApi = require("./api.factory");

const getProducts = async (req) => {
  const api = createApi(req);

  const response = await api.get("/products");

  return response.data;
};

module.exports = {
  getProducts,
};