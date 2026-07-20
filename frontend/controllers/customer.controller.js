const { renderPage } = require("./page.controller");
module.exports = { index: renderPage("customers/index", "Customers") };
