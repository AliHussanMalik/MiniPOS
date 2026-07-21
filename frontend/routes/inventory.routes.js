const express = require("express");
const { requirePageAuth } = require("../middleware/auth.middleware");
const controller = require("../controllers/inventory.controller");

const router = express.Router();

router.use(requirePageAuth);

router.get("/", controller.index);
router.post("/create", controller.postCreate);

module.exports = router;
