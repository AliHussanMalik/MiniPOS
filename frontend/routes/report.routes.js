const express = require("express");
const { requirePageAuth } = require("../middleware/auth.middleware");
const controller = require("../controllers/report.controller");

const router = express.Router();

router.use(requirePageAuth);

router.get("/", controller.index);

module.exports = router;
