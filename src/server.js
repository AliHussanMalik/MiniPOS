const app = require("./app")
const pool = require("./config/db")

const PORT = process.env.PORT

async function startServer() {
    try {
        await pool.query("Select 1");

        console.log("PostgreSQL connected successfully.");

        app.listen(PORT, () => {
            console.log(`server is running on port !{PORT}`)
        })
    }
    catch (e) {
        console.error("Failed to connect to PostgreSQL")
        console.error(e.message)
        process.exit(1)
    }
} startServer()

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});