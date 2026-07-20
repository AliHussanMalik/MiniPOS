const express = require("express");
const frontendController = require("../controllers/frontend.controller");

const router = express.Router();

router.get("/", frontendController.dashboard);

module.exports = router;
