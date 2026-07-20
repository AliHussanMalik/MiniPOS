const { renderPage } = require("./page.controller");
module.exports = { index: renderPage("categories/index", "Categories") };
