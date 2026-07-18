const userRepository = require("../users/user.repository");

const createUser = (payload) => {
  return userRepository.createUser(payload);
};

const findUserByEmail = (email) => {
  return userRepository.findUserByEmail(email);
};

module.exports = {
  createUser,
  findUserByEmail,
};
