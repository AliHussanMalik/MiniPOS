// Category validation
// Defines and validates the expected request body format for category endpoints.

const createCategorySchema = {
  name: { required: true, type: "string", minLength: 2 },
  description: { type: "string" },
  isActive: { type: "boolean" },
};

const updateCategorySchema = {
  name: { type: "string", minLength: 2 },
  description: { type: "string" },
  isActive: { type: "boolean" },
};

module.exports = {
  createCategorySchema,
  updateCategorySchema,
};
