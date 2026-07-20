const { renderPage } = require("./page.controller");
module.exports = { index: renderPage("sales/index", "Sales") };
