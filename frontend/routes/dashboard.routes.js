const router = require("express").Router();

const controller = require("../controllers/dashboard.controller");
const { requirePageAuth } = require("../middleware/auth.middleware");

// const { route } = require("./auth.routes");

router.use(requirePageAuth);

router.get("/", controller.index);

module.exports = router;
