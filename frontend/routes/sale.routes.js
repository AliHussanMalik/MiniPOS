const express = require("express");
const { requirePageAuth } = require("../middleware/auth.middleware");
const controller = require("../controllers/sale.controller");

const router = express.Router();

router.use(requirePageAuth);

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.postCreate);

module.exports = router;
