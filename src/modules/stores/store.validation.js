const createStoreSchema = {
  name: { required: true, type: "string", minLength: 2 },
  slug: { type: "string", minLength: 2 },
  email: { type: "string" },
  phone: { type: "string" },
  address: { type: "string" },
};

const updateStoreSchema = {
  name: { type: "string", minLength: 2 },
  slug: { type: "string", minLength: 2 },
  email: { type: "string" },
  phone: { type: "string" },
  address: { type: "string" },
  status: { type: "string", allowedValues: ["ACTIVE", "INACTIVE"] },
};

const assignUserSchema = {
  email: { required: true, type: "string" },
  isActive: { type: "boolean" },
};

module.exports = {
  createStoreSchema,
  updateStoreSchema,
  assignUserSchema,
};
