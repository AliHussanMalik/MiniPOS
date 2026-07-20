const router = require("express").Router();


const pageController = require("../controllers/page.controller");
const authController = require("../controllers/auth.controller");
// const { response } = require("express");
const {requireGuest,} = require("../middleware/auth.middleware")


router.get("/login", requireGuest, pageController.renderPage("auth/login", "Sign In"));
// router.get("/login", (req, res)=>{
    // res.send("Login Page Success")
// });
router.get("/register", requireGuest, pageController.renderPage("auth/register", "Create Account"));

router.post("/login", authController.login);
router.post("/register", authController.signup);

router.post("/logout", authController.logout);

module.exports = router;
