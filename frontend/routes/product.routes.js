const express = require("express");
const { requirePageAuth } = require("../middleware/auth.middleware");
const controller = require("../controllers/product.controller");

const router = express.Router();

router.use(requirePageAuth);

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.postCreate);
router.get("/:id/edit", controller.edit);
router.post("/:id/edit", controller.postEdit);
router.post("/:id/delete", controller.postDelete);

module.exports = router;
