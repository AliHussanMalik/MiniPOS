// Dashboard Routes
// Defines dashboard API routes with JWT authentication and store requirement middlewares.

const express = require("express");
const dashboardController = require("./dashboard.controller");
const authenticate = require("../../middlewares/auth.middleware");
const requireStore = require("../../middlewares/store.middleware");

const router = express.Router();

router.use(authenticate, requireStore);

router.get("/", dashboardController.getDashboard);

module.exports = router;
