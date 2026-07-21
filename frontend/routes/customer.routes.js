const express = require("express");
const { requirePageAuth } = require("../middleware/auth.middleware");
const controller = require("../controllers/customer.controller");

const router = express.Router();

router.use(requirePageAuth);

router.get("/", controller.index);
router.post("/create", controller.postCreate);
router.post("/:id/delete", controller.postDelete);

module.exports = router;
