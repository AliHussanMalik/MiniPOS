const { renderPage } = require("./page.controller");
module.exports = { index: renderPage("users/index", "Users") };
