// User validation
// Defines and validates the expected request body format for user endpoints.

const { ROLES } = require("../../utils/constants");

const allowedRoles = Object.values(ROLES);

const createUserSchema = {
  fullName: { required: true, type: "string", minLength: 2 },
  email: {
    required: true,
    type: "string",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: { required: true, type: "string", minLength: 6 },
  role: {
    type: "string",
    allowedValues: allowedRoles,
  },
  isActive: { type: "boolean" },
};

const updateUserSchema = {
  fullName: { type: "string", minLength: 2 },
  email: {
    type: "string",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: { type: "string", minLength: 6 },
  role: {
    type: "string",
    allowedValues: allowedRoles,
  },
  isActive: { type: "boolean" },
};

module.exports = {
  createUserSchema,
  updateUserSchema,
};
