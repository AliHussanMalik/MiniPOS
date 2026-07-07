const userRepository = require("../users/user.repository");
const pool = require("../../config/db");

const userReturning = `
  id,
  full_name AS "fullName",
  email,
  role,
  is_active AS "isActive",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

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
