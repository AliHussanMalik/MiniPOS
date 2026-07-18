// Sale routes
// Defines sale API endpoints and connects each route to its controller handler.
const { STAFF_ROLES } = require("../../utils/constants");
const express = require("express");
const saleController = require("./sale.controller");
const validate = require("../../middlewares/validation.middleware");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const requireStore = require("../../middlewares/store.middleware");
const { createSaleSchema, updateSaleSchema } = require("./sale.validation");
const { ROLES, CUSTOMER_ROLES } = require("../../utils/constants");

const router = express.Router();

router.use(authenticate, requireStore);

router.post("/", authorize(...STAFF_ROLES, ROLES.CASHIER), validate(createSaleSchema), saleController.createSale);
router.get("/", authorize(...STAFF_ROLES), saleController.getSales);
router.get("/my", authorize(...STAFF_ROLES, ROLES.CASHIER, ...CUSTOMER_ROLES), saleController.getOwnSales);
router.get("/:id", authorize(...STAFF_ROLES), saleController.getSaleById);
router.put("/:id", authorize(...STAFF_ROLES, ROLES.CASHIER), validate(updateSaleSchema), saleController.updateSale);
router.delete("/:id", authorize(...STAFF_ROLES, ROLES.CASHIER), saleController.deleteSale);

module.exports = router;
