const path = require("path");

const dashboard = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/dashboard/index.html"));
};

module.exports = { dashboard };
