const fs = require("fs");
const path = require("path");
const pool = require("../config/db")

async function migrate(){
    try{
        const client = await pool.connect();

        console.log("Connected To PostgreSQL");

        client.release();
    }
    catch(e){
        console.error("Migration Failed");
        console.error(e.message);

    }

}
migrate()