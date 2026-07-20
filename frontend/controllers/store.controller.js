const { renderPage } = require("./page.controller");
module.exports = { index: renderPage("stores/index", "Stores") };
