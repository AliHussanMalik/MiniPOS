const { ROLES } = require("../../utils/constants");

const signupSchema = {
  fullName: { required: true, type: "string", minLength: 2 },
  email: {
    required: true,
    type: "string",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: { required: true, type: "string", minLength: 6 },
  role: {
    type: "string",
    allowedValues: [ROLES.OWNER, ROLES.CUSTOMER],
  },
};
// const { CUSTOMER_ROLES } = require("../../utils/constants");

// const signupSchema = {
//   fullName: { required: true, type: "string", minLength: 2 },
//   email: {
//     required: true,
//     type: "string",
//     pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//   },
//   password: { required: true, type: "string", minLength: 6 },
//   role: {
//     type: "string",
//     allowedValues: CUSTOMER_ROLES,
//   },
// };

const loginSchema = {
  email: {
    required: true,
    type: "string",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: { required: true, type: "string", minLength: 6 },
};

module.exports = {
  signupSchema,
  loginSchema,
};
