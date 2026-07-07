const authRepository = require("./auth.repository");
const { signToken } = require("../../config/jwt");
const { hashPassword, verifyPassword } = require("../../utils/password");
const { CUSTOMER_ROLES, ROLES } = require("../../utils/constants");
const { createError, mapDatabaseError } = require("../../utils/service.helpers");

const toAuthResponse = (user) => {
  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  });

  return { user, token };
};

const signup = async (payload) => {
  const role = payload.role || ROLES.CUSTOMER;

  // if (!CUSTOMER_ROLES.includes(role)) {
  //   throw createError(400, "Signup is only available for the CUSTOMER role");
  if (![ROLES.OWNER, ROLES.CUSTOMER].includes(role)) {
  throw createError(400, "Invalid role");
  }

  let user;

  try {
    user = await authRepository.createUser({
      fullName: payload.fullName,
      email: payload.email,
      password: hashPassword(payload.password),
      role,
      isActive: true,
    });
  } catch (error) {
    console.error(error)
    throw error
    // throw mapDatabaseError(error, "Unable to create signup user");
  }

  return toAuthResponse(user);
};

const login = async ({ email, password }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user || !verifyPassword(password, user.password)) {
    throw createError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw createError(403, "User account is inactive");
  }

  const { password: _password, ...safeUser } = user;

  return toAuthResponse(safeUser);
};

module.exports = {
  signup,
  login,
};
