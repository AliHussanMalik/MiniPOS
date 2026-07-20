const { renderPage } = require("./page.controller");
module.exports = { index: renderPage("reports/index", "Reports") };
