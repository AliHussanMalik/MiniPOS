const axios = require("axios");

const createApi = (req) => {
  console.log("JWT:", req.session.token);

  return axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${req.session.token}`,
    },
  });
};

module.exports = createApi;