const { renderPage } = require("./page.controller");
module.exports = { index: renderPage("inventory/index", "Inventory") };
