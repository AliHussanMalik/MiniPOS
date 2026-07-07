const app = require("./app");
const pool = require("./config/db");
const env = require("./config/env");

const PORT = env.port;

async function startServer() {
  try {
    await pool.query("SELECT 1");

    console.log("PostgreSQL connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();
