const userApi = require("../api/user.api");

const getUsers = async (req) => {
  return await userApi.getUsers(req);
};

module.exports = {
  getUsers,
};