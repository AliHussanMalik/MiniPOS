const customersService = require("../services/customers.service");

const index = async (req, res, next) => {
  try {
    let customers = [];
    try {
      customers = await customersService.getCustomers(req);
    } catch (err) {
      console.error("Failed to fetch customers:", err.response?.data || err.message);
    }

    return res.render("layouts/main", {
      title: "Customers",
      page: "customers/index",
      customers,
    });
  } catch (err) {
    next(err);
  }
};

const postCreate = async (req, res, next) => {
  try {
    const payload = {
      fullName: req.body.fullName,
      email: req.body.email || undefined,
      phone: req.body.phone || undefined,
      address: req.body.address || undefined,
    };

    await customersService.createCustomer(req, payload);
    req.flash("success", "Customer added successfully.");
    return res.redirect("/customers");
  } catch (err) {
    console.error("Create Customer Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to add customer.");
    return res.redirect("/customers");
  }
};

const postDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await customersService.deleteCustomer(req, id);
    req.flash("success", "Customer deleted successfully.");
    return res.redirect("/customers");
  } catch (err) {
    console.error("Delete Customer Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to delete customer.");
    return res.redirect("/customers");
  }
};

module.exports = {
  index,
  postCreate,
  postDelete,
};
