// User service
// Contains user-related business logic and coordinates between controllers
// and repositories.

const userRepository = require("./user.repository");
const { hashPassword } = require("../../utils/password");
const { ensureFound, mapDatabaseError } = require("../../utils/service.helpers");

const createUser = async (payload) => {
  try {
    const userData = {
      ...payload,
      password: hashPassword(payload.password),
    };

    return await userRepository.createUser(userData);
  } catch (error) {
    throw mapDatabaseError(error, "Unable to create user");
  }
};

const getUsers = async () => {
  return userRepository.findAllUsers();
};

const getUserById = async (id) => {
  const user = await userRepository.findUserById(id);

  return ensureFound(user, "User not found");
};

const updateUser = async (id, payload) => {
  try {
    const userData = { ...payload };

    if (userData.password) {
      userData.password = hashPassword(userData.password);
    }

    const user = await userRepository.updateUser(id, userData);

    return ensureFound(user, "User not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to update user");
  }
};

const deleteUser = async (id) => {
  try {
    const user = await userRepository.deleteUser(id);

    return ensureFound(user, "User not found");
  } catch (error) {
    if (error.statusCode) throw error;
    throw mapDatabaseError(error, "Unable to delete user");
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
