const path = require("path");

module.exports = (app) => {
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "../views"));
  app.use("/frontend-assets", expressStatic(path.join(__dirname, "../public")));
};

const expressStatic = (directory) => require("express").static(directory);
