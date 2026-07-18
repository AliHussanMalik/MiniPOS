const pool = require("../config/db");

const requireStore = async (req, res, next) => {
  let storeId = req.headers["x-store-id"] || req.user?.storeId;

  if (!storeId && req.user) {
    // If OWNER, default to their first store if they have one
    if (req.user.role === "OWNER") {
      try {
        const result = await pool.query(
          "SELECT id FROM stores WHERE owner_id = $1 ORDER BY id LIMIT 1",
          [req.user.id]
        );
        if (result.rows.length > 0) {
          storeId = result.rows[0].id;
        }
      } catch (error) {
        return res.status(500).json({ message: "Failed to default store for owner", error: error.message });
      }
    }
  }

  if (!storeId) {
    return res.status(400).json({ message: "Store ID is required. Please provide X-Store-Id header." });
  }

  try {
    const storeIdNum = Number(storeId);
    if (isNaN(storeIdNum)) {
      return res.status(400).json({ message: "Invalid Store ID" });
    }

    if (req.user.role === "OWNER") {
      const storeResult = await pool.query(
        "SELECT id FROM stores WHERE id = $1 AND owner_id = $2",
        [storeIdNum, req.user.id]
      );
      if (storeResult.rows.length === 0) {
        return res.status(403).json({ message: "Access denied to this store" });
      }
    } else {
      const accessResult = await pool.query(
        "SELECT 1 FROM store_users WHERE store_id = $1 AND user_id = $2 AND is_active = true",
        [storeIdNum, req.user.id]
      );
      if (accessResult.rows.length === 0) {
        return res.status(403).json({ message: "Access denied to this store" });
      }
    }

    req.storeId = storeIdNum;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Store verification failed", error: error.message });
  }
};

module.exports = requireStore;
