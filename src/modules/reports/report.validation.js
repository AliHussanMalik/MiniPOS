// Report validation
// Reports currently use query parameters instead of request bodies.

const reportQuerySchema = {
  startDate: { type: "string" },
  endDate: { type: "string" },
  userId: { type: "integer", min: 1 },
  customerId: { type: "integer", min: 1 },
  productId: { type: "integer", min: 1 },
};

module.exports = {
  reportQuerySchema,
};
