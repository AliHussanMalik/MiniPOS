// Category routes
// Defines category API endpoints and connects each route to its controller handler.

const { STAFF_ROLES } = require("../../utils/constants");
const express = require("express");
const categoryController = require("./category.controller");
const validate = require("../../middlewares/validation.middleware");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const requireStore = require("../../middlewares/store.middleware");
const { createCategorySchema, updateCategorySchema } = require("./category.validation");
const { ROLES } = require("../../utils/constants");

const router = express.Router();

router.use(authenticate, requireStore, authorize(...STAFF_ROLES, ROLES.CASHIER));

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.post(
  "/",
  authorize(...STAFF_ROLES),
  validate(createCategorySchema),
  categoryController.createCategory
);
router.put(
  "/:id",
  authorize(...STAFF_ROLES),
  validate(updateCategorySchema),
  categoryController.updateCategory
);
router.delete("/:id", authorize(...STAFF_ROLES), categoryController.deleteCategory);

module.exports = router;
