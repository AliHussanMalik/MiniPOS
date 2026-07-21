const testApi = require("../api/test.api");

const testConnection = async (req) => {
  return await testApi.testConnection(req);
};

module.exports = {
  testConnection,
};