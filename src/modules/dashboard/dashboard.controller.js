// Dashboard Controller
// Handles incoming HTTP requests for the dashboard endpoint.

const dashboardService = require("./dashboard.service");
const dashboardDto = require("./dashboard.dto");
const { asyncHandler } = require("../../utils/controller.helpers");

const getDashboard = asyncHandler(async (req, res) => {
  const dashboardData = await dashboardService.getDashboardData(req.storeId);

  res.status(200).json({ data: dashboardDto.toDashboardResponseDto(dashboardData) });
});

module.exports = {
  getDashboard,
};
