const productsService = require("../services/products.service");
const categoriesService = require("../services/categories.service");

const index = async (req, res, next) => {
  try {
    let products = [];
    let categories = [];
    try {
      products = await productsService.getProducts(req);
      categories = await categoriesService.getCategories(req);
    } catch (err) {
      console.error("Failed to fetch products or categories:", err.response?.data || err.message);
    }

    return res.render("layouts/main", {
      title: "Products",
      page: "products/index",
      products,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    let categories = [];
    try {
      categories = await categoriesService.getCategories(req);
    } catch (err) {
      console.error("Failed to fetch categories for create product:", err.message);
    }

    return res.render("layouts/main", {
      title: "New Product",
      page: "products/create",
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
      categoryId: Number(req.body.categoryId),
      costPrice: Number(req.body.costPrice),
      sellingPrice: Number(req.body.sellingPrice),
      unit: req.body.unit || "pcs",
      barcode: req.body.barcode || undefined,
      sku: req.body.sku || undefined,
      description: req.body.description || undefined,
      stockQuantity: req.body.stockQuantity ? Number(req.body.stockQuantity) : 0,
      minimumStock: req.body.minimumStock ? Number(req.body.minimumStock) : 5,
    };

    await productsService.createProduct(req, payload);
    req.flash("success", "Product created successfully.");
    return res.redirect("/products");
  } catch (err) {
    console.error("Create Product Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to create product.");
    return res.redirect("/products/create");
  }
};

const edit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productsService.getProductById(req, id);
    const categories = await categoriesService.getCategories(req);

    return res.render("layouts/main", {
      title: "Edit Product",
      page: "products/edit",
      product,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

const postEdit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = {
      name: req.body.name,
      categoryId: Number(req.body.categoryId),
      costPrice: Number(req.body.costPrice),
      sellingPrice: Number(req.body.sellingPrice),
      unit: req.body.unit || "pcs",
      barcode: req.body.barcode || undefined,
      sku: req.body.sku || undefined,
      description: req.body.description || undefined,
      minimumStock: req.body.minimumStock ? Number(req.body.minimumStock) : 5,
    };

    await productsService.updateProduct(req, id, payload);
    req.flash("success", "Product updated successfully.");
    return res.redirect("/products");
  } catch (err) {
    console.error("Edit Product Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to update product.");
    return res.redirect(`/products/${req.params.id}/edit`);
  }
};

const postDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productsService.deleteProduct(req, id);
    req.flash("success", "Product deleted successfully.");
    return res.redirect("/products");
  } catch (err) {
    console.error("Delete Product Error:", err.response?.data || err.message);
    req.flash("error", err.response?.data?.message || "Failed to delete product.");
    return res.redirect("/products");
  }
};

module.exports = {
  index,
  create,
  postCreate,
  edit,
  postEdit,
  postDelete,
};
