// Inventory routes
// Defines inventory API endpoints and connects each route to its controller handler.

const { STAFF_ROLES } = require("../../utils/constants");
const express = require("express");
const inventoryController = require("./inventory.controller");
const validate = require("../../middlewares/validation.middleware");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const {
  createInventoryItemSchema,
  updateInventoryItemSchema,
} = require("./inventory.validation");
const { ROLES } = require("../../utils/constants");

const router = express.Router();

router.use(authenticate, authorize(...STAFF_ROLES));

router.post("/", validate(createInventoryItemSchema), inventoryController.createInventoryItem);
router.get("/", inventoryController.getInventory);
router.get("/:id", inventoryController.getInventoryItemById);
router.put("/:id", validate(updateInventoryItemSchema), inventoryController.updateInventoryItem);
router.delete("/:id", inventoryController.deleteInventoryItem);

module.exports = router;
