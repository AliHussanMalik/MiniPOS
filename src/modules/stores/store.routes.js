const express = require("express");
const storeController = require("./store.controller");
const validate = require("../../middlewares/validation.middleware");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const { createStoreSchema, updateStoreSchema, assignUserSchema } = require("./store.validation");
const { ROLES } = require("../../utils/constants");

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(ROLES.OWNER),
  validate(createStoreSchema),
  storeController.createStore
);

router.get("/", storeController.getStores);
router.get("/:id", storeController.getStoreById);

router.put(
  "/:id",
  authorize(ROLES.OWNER),
  validate(updateStoreSchema),
  storeController.updateStore
);

router.delete(
  "/:id",
  authorize(ROLES.OWNER),
  storeController.deleteStore
);

// Store users assignment
router.post(
  "/:id/users",
  authorize(ROLES.OWNER),
  validate(assignUserSchema),
  storeController.addUserToStore
);

router.get(
  "/:id/users",
  authorize(ROLES.OWNER),
  storeController.getStoreUsers
);

router.delete(
  "/:id/users/:userId",
  authorize(ROLES.OWNER),
  storeController.removeUserFromStore
);

module.exports = router;
