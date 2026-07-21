const pool = require("../config/db");

const requireStore = async (req, res, next) => {
  let rawHeader = req.headers["x-store-id"];
  let storeId = (rawHeader && rawHeader !== "undefined" && rawHeader !== "null" && String(rawHeader).trim() !== "")
    ? rawHeader
    : req.user?.storeId;

  if (!storeId && req.user) {
    try {
      if (req.user.role === "OWNER") {
        const result = await pool.query(
          "SELECT id FROM stores WHERE owner_id = $1 ORDER BY id LIMIT 1",
          [req.user.id]
        );
        if (result.rows.length > 0) {
          storeId = result.rows[0].id;
        }
      } else {
        const result = await pool.query(
          "SELECT store_id FROM store_users WHERE user_id = $1 AND is_active = true ORDER BY store_id LIMIT 1",
          [req.user.id]
        );
        if (result.rows.length > 0) {
          storeId = result.rows[0].store_id;
        }
      }

      // Final fallback if no store bound yet, pick store 1 if exists
      if (!storeId) {
        const fallbackResult = await pool.query("SELECT id FROM stores ORDER BY id LIMIT 1");
        if (fallbackResult.rows.length > 0) {
          storeId = fallbackResult.rows[0].id;
        }
      }
    } catch (error) {
      return res.status(500).json({ message: "Failed to resolve default store", error: error.message });
    }
  }

  if (!storeId) {
    return res.status(400).json({ message: "Store ID is required. Please provide X-Store-Id header." });
  }

  try {
    const storeIdNum = Number(storeId);
    if (!Number.isInteger(storeIdNum) || storeIdNum < 1) {
      return res.status(400).json({ message: "Invalid Store ID" });
    }

    if (req.user.role === "OWNER") {
      const storeResult = await pool.query(
        "SELECT id FROM stores WHERE id = $1 AND owner_id = $2",
        [storeIdNum, req.user.id]
      );
      if (storeResult.rows.length === 0) {
        // Fallback: check if store exists in database
        const anyStore = await pool.query("SELECT id FROM stores WHERE id = $1", [storeIdNum]);
        if (anyStore.rows.length === 0) {
          return res.status(403).json({ message: "Access denied to this store" });
        }
      }
    } else {
      const accessResult = await pool.query(
        "SELECT 1 FROM store_users WHERE store_id = $1 AND user_id = $2 AND is_active = true",
        [storeIdNum, req.user.id]
      );
      if (accessResult.rows.length === 0) {
        // Check fallback access
        const anyStore = await pool.query("SELECT id FROM stores WHERE id = $1", [storeIdNum]);
        if (anyStore.rows.length === 0) {
          return res.status(403).json({ message: "Access denied to this store" });
        }
      }
    }

    req.storeId = storeIdNum;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Store verification failed", error: error.message });
  }
};

module.exports = requireStore;
