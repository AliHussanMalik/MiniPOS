const categoriesService = require("../services/categories.service");

const index = async (req, res, next) => {
  try {
    let categories = [];
    try {
      categories = await categoriesService.getCategories(req);
    } catch (err) {
      console.error("Failed to fetch categories:", err.response?.data || err.message);
    }

    return res.render("layouts/main", {
      title: "Categories",
      page: "categories/index",
      categories,
    });
  } catch (err) {
    next(err);
  }
};

const postCreate = async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      description: req.body.description || undefined,
    };

    await categoriesService.createCategory(req, payload);
    req.flash("success", "Category created successfully.");
    return res.redirect("/categories");
  } catch (err) {
    console.error("Create Category Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to create category.");
    return res.redirect("/categories");
  }
};

const postDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await categoriesService.deleteCategory(req, id);
    req.flash("success", "Category deleted successfully.");
    return res.redirect("/categories");
  } catch (err) {
    console.error("Delete Category Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to delete category.");
    return res.redirect("/categories");
  }
};

module.exports = {
  index,
  postCreate,
  postDelete,
};
