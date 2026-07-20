const express = require("express");

const router = express.Router();

router.use("/auth", require("./auth.routes"));

router.use("/dashboard", require("./dashboard.routes"));
router.use("/products", require("./product.routes"));
router.use("/categories", require("./category.routes"));
router.use("/customers", require("./customer.routes"));
router.use("/inventory", require("./inventory.routes"));
router.use("/sales", require("./sale.routes"));
router.use("/reports", require("./report.routes"));
router.use("/stores", require("./store.routes"));
router.use("/users", require("./user.routes"));

router.get("/", (req, res) => {
    if (req.session.user  && req.session.token){
        return res.redirect("/dashboard");
    }

    res.redirect("/auth/login");
});

module.exports = router;
