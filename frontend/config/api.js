require("dotenv").config()

const axios = require("axios")

const api = axios.create({
    baseURL:process.env.API_BASE_URL,
    timeout: 100000,
    headers:{
        "Content-Type":"application/json",
        Accept: "application/json",
    },
});

module.exports = api;