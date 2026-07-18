// Customer routes
// Defines customer API endpoints and connects each route to its controller handler.

const { STAFF_ROLES } = require("../../utils/constants");
const express = require("express");
const customerController = require("./customer.controller");
const validate = require("../../middlewares/validation.middleware");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const requireStore = require("../../middlewares/store.middleware");
const { createCustomerSchema, updateCustomerSchema } = require("./customer.validation");
const { ROLES } = require("../../utils/constants");

const router = express.Router();

router.use(authenticate, requireStore);

router.get("/me", authorize(ROLES.CUSTOMER), customerController.getOwnCustomerProfile);
router.put(
  "/me",
  authorize(ROLES.CUSTOMER),
  validate(updateCustomerSchema),
  customerController.updateOwnCustomerProfile
);

router.post("/", authorize(...STAFF_ROLES, ROLES.CASHIER), validate(createCustomerSchema), customerController.createCustomer);
router.get("/", authorize(...STAFF_ROLES, ROLES.CASHIER), customerController.getCustomers);
router.get("/:id", authorize(...STAFF_ROLES, ROLES.CASHIER), customerController.getCustomerById);
router.put("/:id", authorize(...STAFF_ROLES, ROLES.CASHIER), validate(updateCustomerSchema), customerController.updateCustomer);
router.delete("/:id", authorize(...STAFF_ROLES), customerController.deleteCustomer);

module.exports = router;
