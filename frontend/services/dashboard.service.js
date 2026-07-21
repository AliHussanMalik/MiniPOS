const createApi = require("../utils/createApi");

/**
 * Fetch aggregated dashboard data from backend API
 */
const getDashboardData = async (req) => {
  const api = createApi(req);
  const response = await api.get("/dashboard");
  return response.data.data;
};

module.exports = {
  getDashboardData,
};
