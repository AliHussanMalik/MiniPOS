// Customer validation
// Defines and validates the expected request body format for customer endpoints.

const createCustomerSchema = {
  fullName: { required: true, type: "string", minLength: 2 },
  phone: { type: "string", minLength: 7 },
  email: {
    type: "string",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  address: { type: "string" },
  isActive: { type: "boolean" },
};

const updateCustomerSchema = {
  fullName: { type: "string", minLength: 2 },
  phone: { type: "string", minLength: 7 },
  email: {
    type: "string",
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  address: { type: "string" },
  isActive: { type: "boolean" },
};

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
};
