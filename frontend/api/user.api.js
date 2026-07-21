const createApi = require("./api.factory");

const getUsers = async (req) => {
  const api = createApi(req);

  const response = await api.get("/users");

  return response.data;
};

module.exports = {
  getUsers,
};