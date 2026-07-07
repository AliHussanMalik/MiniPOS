// Inventory validation
// Defines and validates the expected request body format for inventory endpoints.

const createInventoryItemSchema = {
  productId: { required: true, type: "integer", min: 1 },
  quantity: { required: true, type: "integer", min: 0 },
  movementType: {
    required: true,
    type: "string",
    allowedValues: ["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"],
  },
  notes: { type: "string" },
};

const updateInventoryItemSchema = {
  productId: { type: "integer", min: 1 },
  quantity: { type: "integer", min: 0 },
  movementType: {
    type: "string",
    allowedValues: ["STOCK_IN", "STOCK_OUT", "ADJUSTMENT"],
  },
  notes: { type: "string" },
};

module.exports = {
  createInventoryItemSchema,
  updateInventoryItemSchema,
};
