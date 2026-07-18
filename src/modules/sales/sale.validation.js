// Sale validation
// Defines and validates the expected request body format for sale endpoints.

const saleItemSchema = {
  productId: { required: true, type: "integer", min: 1 },
  quantity: { required: true, type: "integer", min: 1 },
};

const createSaleSchema = {
  customerId: { type: "integer", min: 1 },
  // userId: { type: "integer", min: 1 },
  // subtotal: { required: true, type: "number", min: 0 },
  discount: { type: "number", min: 0 },
  // tax: { type: "number", min: 0 },
  // totalAmount: { required: true, type: "number", min: 0 },
  paymentMethod: {
    required: true,
    type: "string",
    allowedValues: ["CASH", "CARD", "ONLINE"],
  },
  items: {
    required: true,
    type: "array",
    minItems: 1,
    itemSchema: saleItemSchema,
  },
};

const updateSaleSchema = {
  status: {
    required: true,
    type: "string",
    allowedValues: ["CANCELLED"],
  },
};

module.exports = {
  createSaleSchema,
  updateSaleSchema,
};
