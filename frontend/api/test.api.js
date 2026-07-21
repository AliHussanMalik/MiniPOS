const createApi = require("./api.factory");

const testConnection = async (req) => {
  const api = createApi(req);

  // Replace "/users" with any protected endpoint that works in Postman
  const response = await api.get("/users");

  return response.data;
};

module.exports = {
  testConnection,
};