const inventoryService = require("../services/inventory.service");
const productsService = require("../services/products.service");

const index = async (req, res, next) => {
  try {
    let inventory = [];
    let products = [];
    try {
      inventory = await inventoryService.getInventory(req);
      products = await productsService.getProducts(req);
    } catch (err) {
      console.error("Failed to fetch inventory or products:", err.response?.data || err.message);
    }

    return res.render("layouts/main", {
      title: "Inventory Movements",
      page: "inventory/index",
      inventory,
      products,
    });
  } catch (err) {
    next(err);
  }
};

const postCreate = async (req, res, next) => {
  try {
    const payload = {
      productId: Number(req.body.productId),
      quantity: Number(req.body.quantity),
      movementType: req.body.movementType || "ADJUSTMENT",
      notes: req.body.notes || undefined,
    };

    await inventoryService.createInventoryItem(req, payload);
    req.flash("success", "Inventory stock movement recorded successfully.");
    return res.redirect("/inventory");
  } catch (err) {
    console.error("Create Inventory Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to record inventory movement.");
    return res.redirect("/inventory");
  }
};

module.exports = {
  index,
  postCreate,
};
