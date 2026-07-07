require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "minipos-development-secret",
  jwtExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS || 60 * 60 * 24),
};
