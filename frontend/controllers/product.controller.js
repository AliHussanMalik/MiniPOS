const { renderPage } = require("./page.controller");
module.exports = { index: renderPage("products/index", "Products"), create: renderPage("products/create", "New product"), edit: renderPage("products/edit", "Edit product"), details: renderPage("products/details", "Product details") };
