const express = require("express");
const { requirePageAuth } = require("../middleware/auth.middleware");
const controller = require("../controllers/store.controller");

const router = express.Router();

router.use(requirePageAuth);

router.get("/", controller.index);
router.post("/create", controller.postCreate);
router.post("/select", controller.selectStore);
router.post("/:id/select", controller.selectStore);

module.exports = router;
