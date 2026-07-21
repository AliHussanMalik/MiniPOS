const storesService = require("../services/stores.service");

const index = async (req, res, next) => {
  try {
    let stores = [];
    try {
      stores = await storesService.getStores(req);
    } catch (err) {
      console.error("Failed to fetch stores:", err.response?.data || err.message);
    }

    return res.render("layouts/main", {
      title: "Store Management",
      page: "stores/index",
      stores,
    });
  } catch (err) {
    next(err);
  }
};

const postCreate = async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      email: req.body.email || undefined,
      phone: req.body.phone || undefined,
      address: req.body.address || undefined,
    };

    const newStore = await storesService.createStore(req, payload);
    req.session.currentStoreId = newStore.id;
    req.session.currentStore = newStore;

    req.flash("success", `Store "${newStore.name}" created and set as active.`);
    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Create Store Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to create store.");
    return res.redirect("/stores");
  }
};

const selectStore = async (req, res, next) => {
  try {
    const storeId = Number(req.body.storeId || req.params.id);
    if (!storeId) {
      req.flash("error", "Invalid store selected.");
      return res.redirect("/stores");
    }

    const stores = await storesService.getStores(req);
    const matched = stores.find((s) => s.id === storeId);

    if (matched) {
      req.session.currentStoreId = matched.id;
      req.session.currentStore = matched;
      req.flash("success", `Switched active store to "${matched.name}".`);
    } else {
      req.flash("error", "Selected store not found.");
    }

    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Select Store Error:", err.message);
    req.flash("error", "Failed to switch store.");
    return res.redirect("/stores");
  }
};

module.exports = {
  index,
  postCreate,
  selectStore,
};
