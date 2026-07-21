const axios = require("axios")
// const api = require("../config/api");

const createApi = (req) => {
  return axios.create({
    baseURL: process.env.API_BASE_URL,
    timeout: 10000,
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization:`Bearer ${req.session.token}`
    }
  })
//   api.defaults.headers.common.Authorization =
//     `Bearer ${req.session.token}`;

//   return api;
};

module.exports = createApi;