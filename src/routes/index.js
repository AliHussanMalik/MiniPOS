// Main application router
// Registers all module routes in one place so app.js can mount them cleanly.

const express = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const userRoutes = require("../modules/users/user.routes");
const productRoutes = require("../modules/products/product.routes");
const categoryRoutes = require("../modules/categories/category.routes");
const customerRoutes = require("../modules/customers/customer.routes");
const inventoryRoutes = require("../modules/inventory/inventory.routes");
const saleRoutes = require("../modules/sales/sale.routes");
const reportRoutes = require("../modules/reports/report.routes");
const storeRoutes = require("../modules/stores/store.routes");
const dashboardRoutes = require("../modules/dashboard/dashboard.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/customers", customerRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/sales", saleRoutes);
router.use("/reports", reportRoutes);
router.use("/stores", storeRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;
