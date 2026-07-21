const salesService = require("../services/sales.service");
const productsService = require("../services/products.service");
const customersService = require("../services/customers.service");

const index = async (req, res, next) => {
  try {
    let sales = [];
    try {
      sales = await salesService.getSales(req);
    } catch (err) {
      console.error("Failed to fetch sales:", err.response?.data || err.message);
    }

    return res.render("layouts/main", {
      title: "Sales History",
      page: "sales/index",
      sales,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    let products = [];
    let customers = [];
    try {
      products = await productsService.getProducts(req);
      customers = await customersService.getCustomers(req);
    } catch (err) {
      console.error("Failed to fetch products/customers for sale:", err.message);
    }

    return res.render("layouts/main", {
      title: "New Sale (POS)",
      page: "sales/create",
      products,
      customers,
    });
  } catch (err) {
    next(err);
  }
};

const postCreate = async (req, res, next) => {
  try {
    let items = [];
    // If single item posted or array of items posted
    if (req.body.productId) {
      const prodIds = Array.isArray(req.body.productId) ? req.body.productId : [req.body.productId];
      const quantities = Array.isArray(req.body.quantity) ? req.body.quantity : [req.body.quantity];

      for (let i = 0; i < prodIds.length; i++) {
        if (prodIds[i] && Number(quantities[i]) > 0) {
          items.push({
            productId: Number(prodIds[i]),
            quantity: Number(quantities[i]),
          });
        }
      }
    }

    if (items.length === 0) {
      req.flash("error", "At least one product item is required for a sale.");
      return res.redirect("/sales/create");
    }

    const payload = {
      customerId: req.body.customerId ? Number(req.body.customerId) : undefined,
      paymentMethod: req.body.paymentMethod || "CASH",
      discount: req.body.discount ? Number(req.body.discount) : 0,
      items,
    };

    await salesService.createSale(req, payload);
    req.flash("success", "Sale transaction completed successfully.");
    return res.redirect("/sales");
  } catch (err) {
    console.error("Create Sale Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to process sale.");
    return res.redirect("/sales/create");
  }
};

module.exports = {
  index,
  create,
  postCreate,
};
