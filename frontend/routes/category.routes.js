const { requirePageAuth } = require("../middleware/auth.middleware");

const router = require("express").Router(); const controller = require("../controllers/category.controller");
router.get("/", controller.index); module.exports = router;
