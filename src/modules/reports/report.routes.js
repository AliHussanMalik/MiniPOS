// Report routes
// Defines report API endpoints and connects each route to its controller handler.

const { STAFF_ROLES } = require("../../utils/constants");
const express = require("express");
const reportController = require("./report.controller");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const { ROLES } = require("../../utils/constants");

const router = express.Router();

router.use(authenticate, authorize(...STAFF_ROLES));

router.get("/", reportController.getReports);
router.get("/sales", reportController.getSalesReport);
router.get("/inventory", reportController.getInventoryReport);

module.exports = router;
