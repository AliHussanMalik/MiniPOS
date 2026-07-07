// Sale validation
// Defines and validates the expected request body format for sale endpoints.

const saleItemSchema = {
  productId: { required: true, type: "integer", min: 1 },
  quantity: { required: true, type: "integer", min: 1 },
  unitPrice: { required: true, type: "number", min: 0 },
  subtotal: { required: true, type: "number", min: 0 },
};

const createSaleSchema = {
  customerId: { type: "integer", min: 1 },
  userId: { type: "integer", min: 1 },
  subtotal: { required: true, type: "number", min: 0 },
  discount: { type: "number", min: 0 },
  tax: { type: "number", min: 0 },
  totalAmount: { required: true, type: "number", min: 0 },
  paymentMethod: {
    required: true,
    type: "string",
    allowedValues: ["CASH", "CARD", "ONLINE"],
  },
  status: {
    type: "string",
    allowedValues: ["COMPLETED", "CANCELLED"],
  },
  items: {
    required: true,
    type: "array",
    itemSchema: saleItemSchema,
  },
};

const updateSaleSchema = {
  customerId: { type: "integer", min: 1 },
  userId: { type: "integer", min: 1 },
  subtotal: { type: "number", min: 0 },
  discount: { type: "number", min: 0 },
  tax: { type: "number", min: 0 },
  totalAmount: { type: "number", min: 0 },
  paymentMethod: {
    type: "string",
    allowedValues: ["CASH", "CARD", "ONLINE"],
  },
  status: {
    type: "string",
    allowedValues: ["COMPLETED", "CANCELLED"],
  },
  items: {
    type: "array",
    itemSchema: saleItemSchema,
  },
};

module.exports = {
  createSaleSchema,
  updateSaleSchema,
};
