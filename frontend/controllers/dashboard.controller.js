const { renderPage } = require("./page.controller");
module.exports = { index: renderPage("dashboard/index", "Dashboard") };
