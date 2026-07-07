const express = require("express");
const routes = require("./routes");
const swaggerRoutes = require("./routes/swagger.routes");
const userRoutes = require("./modules/users/user.routes");

const app = express();

app.use(express.json());
app.use(swaggerRoutes);
app.use("/api", routes);
app.use("/user", userRoutes);
app.use("/users", userRoutes);

module.exports = app;
