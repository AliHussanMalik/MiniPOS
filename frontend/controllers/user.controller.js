const usersService = require("../services/users.service");

const index = async (req, res, next) => {
  try {
    let users = [];
    try {
      users = await usersService.getUsers(req);
    } catch (err) {
      console.error("Failed to fetch users:", err.response?.data || err.message);
    }

    return res.render("layouts/main", {
      title: "User Management",
      page: "users/index",
      users,
    });
  } catch (err) {
    next(err);
  }
};

const postCreate = async (req, res, next) => {
  try {
    const payload = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || "CASHIER",
    };

    await usersService.createUser(req, payload);
    req.flash("success", "Staff user created successfully.");
    return res.redirect("/users");
  } catch (err) {
    console.error("Create User Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to create user.");
    return res.redirect("/users");
  }
};

const postDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await usersService.deleteUser(req, id);
    req.flash("success", "User account removed.");
    return res.redirect("/users");
  } catch (err) {
    console.error("Delete User Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to remove user.");
    return res.redirect("/users");
  }
};

module.exports = {
  index,
  postCreate,
  postDelete,
};
