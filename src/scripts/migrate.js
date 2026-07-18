const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

async function migrate() {
    let client;

    try {
        client = await pool.connect();
        console.log(" Connected to PostgreSQL");

        await client.query("BEGIN");

        // Create migrations table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log(" Migrations table is ready.");

        // Get already executed migrations
        const result = await client.query(`
            SELECT filename
            FROM migrations;
        `);

        const executedFiles = [];

        for (const row of result.rows) {
            executedFiles.push(row.filename);
        }

        // Read migration files
        const migrationsPath = path.join(__dirname, "../../sql/migrations");

        const files = fs
            .readdirSync(migrationsPath)
            .sort();

        for (const file of files) {

            // Skip already executed migrations
            if (executedFiles.includes(file)) {
                console.log(` Already Developed So Skipping ${file}`);
                continue;
            }

            console.log(` Executing ${file}`);

            const filePath = path.join(migrationsPath, file);

            const sql = fs.readFileSync(filePath, "utf8");

            await client.query(sql);

            // Save migration history
            await client.query(
                `INSERT INTO migrations (filename)
                 VALUES ($1);`,
                [file]
            );

            console.log(` ${file} executed successfully`);
        }

        await client.query("COMMIT");

        console.log(" All migrations completed successfully.");

    } catch (err) {

        if (client) {
            await client.query("ROLLBACK");
        }

        console.error(" Migration Failed");
        console.error(err.message);
        process.exitCode = 1;

    } finally {

        if (client) {
            client.release();
        }

    }
}

migrate();
