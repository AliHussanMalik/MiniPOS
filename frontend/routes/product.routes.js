const { requirePageAuth } = require("../middleware/auth.middleware");

const router = require("express").Router(); const controller = require("../controllers/product.controller");
router.use(requirePageAuth);
router.get("/", controller.index); router.get("/create", controller.create); router.get("/:id/edit", controller.edit); router.get("/:id", controller.details); module.exports = router;
