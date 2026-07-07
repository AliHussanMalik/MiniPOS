// User routes
// Defines user API endpoints and connects each route to its controller handler.
const { ROLES, STAFF_ROLES } = require("../../utils/constants");
const express = require("express");
const userController = require("./user.controller");
const validate = require("../../middlewares/validation.middleware");
const authenticate = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/role.middleware");
const { createUserSchema, updateUserSchema } = require("./user.validation");
// const { ROLES } = require("../../utils/constants");

const router = express.Router();

router.use(authenticate, authorize(...STAFF_ROLES));

router.post("/", validate(createUserSchema), userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", validate(updateUserSchema), userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
