// Product routes
// Defines product API endpoints and connects each route to its controller handler.

const { STAFF_ROLES } = require("../../utils/constants");
const express = require("express");
const productController = require("./product.controller");
const validate = require("../../middlewares/validation.middleware");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const { createProductSchema, updateProductSchema } = require("./product.validation");
const { ROLES } = require("../../utils/constants");

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(createProductSchema),
  productController.createProduct
);
router.put(
  "/:id",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(updateProductSchema),
  productController.updateProduct
);
router.delete("/:id", authenticate, authorize(...STAFF_ROLES), productController.deleteProduct);

module.exports = router;
