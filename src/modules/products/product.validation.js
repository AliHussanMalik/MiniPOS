// Product validation
// Defines and validates the expected request body format for product endpoints.

const createProductSchema = {
  name: { required: true, type: "string", minLength: 2 },
  categoryId: { required: true, type: "integer", min: 1 },
  barcode: { type: "string", minLength: 2 },
  sku: { type: "string", minLength: 2 },
  description: { type: "string" },
  costPrice: { required: true, type: "number", min: 0 },
  sellingPrice: { required: true, type: "number", min: 0 },
  stockQuantity: { type: "integer", min: 0 },
  minimumStock: { type: "integer", min: 0 },
  unit: { required: true, type: "string", minLength: 1 },
  isActive: { type: "boolean" },
};

const updateProductSchema = {
  name: { type: "string", minLength: 2 },
  categoryId: { type: "integer", min: 1 },
  barcode: { type: "string", minLength: 2 },
  sku: { type: "string", minLength: 2 },
  description: { type: "string" },
  costPrice: { type: "number", min: 0 },
  sellingPrice: { type: "number", min: 0 },
  stockQuantity: { type: "integer", min: 0 },
  minimumStock: { type: "integer", min: 0 },
  unit: { type: "string", minLength: 1 },
  isActive: { type: "boolean" },
};

module.exports = {
  createProductSchema,
  updateProductSchema,
};
