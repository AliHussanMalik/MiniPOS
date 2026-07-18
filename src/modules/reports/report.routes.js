// Report routes
// Defines report API endpoints and connects each route to its controller handler.

const { STAFF_ROLES } = require("../../utils/constants");
const express = require("express");
const reportController = require("./report.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const requireStore = require("../../middlewares/store.middleware");
const validate = require("../../middlewares/validation.middleware");
const { reportQuerySchema } = require("./report.validation");

const router = express.Router();

router.use(authenticate, requireStore, authorize(...STAFF_ROLES));

router.get("/", validate(reportQuerySchema, "query"), reportController.getReports);
router.get("/sales", validate(reportQuerySchema, "query"), reportController.getSalesReport);
router.get("/inventory", validate(reportQuerySchema, "query"), reportController.getInventoryReport);

module.exports = router;
