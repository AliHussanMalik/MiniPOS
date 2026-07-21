const storesService = require("../services/stores.service");

const requirePageAuth = async (req, res, next) => {
  if (!req.session?.user || !req.session?.token) {
    return res.redirect("/auth/login");
  }

  // Ensure currentStoreId is populated in session for all API calls
  if (!req.session.currentStoreId) {
    try {
      const stores = await storesService.getStores(req);
      if (Array.isArray(stores) && stores.length > 0) {
        req.session.currentStoreId = stores[0].id;
        req.session.currentStore = stores[0];
        res.locals.currentStoreId = stores[0].id;
        res.locals.currentStore = stores[0];
      }
    } catch (err) {
      console.warn("requirePageAuth: Could not auto-resolve store for user session:", err.message);
    }
  }

  next();
};

const requireGuest = (req, res, next) => {
  if (req.session?.user && req.session?.token) {
    return res.redirect("/dashboard");
  }
  next();
};

module.exports = {
  requirePageAuth,
  requireGuest,
};