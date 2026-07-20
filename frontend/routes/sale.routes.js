const { requirePageAuth } = require("../middleware/auth.middleware");

const router = require("express").Router(); const controller = require("../controllers/sale.controller");
router.use(requirePageAuth);
router.get("/", controller.index); module.exports = router;
