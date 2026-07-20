const authService = require("./auth.service");
const authDto = require("./auth.dto");
const { asyncHandler } = require("../../utils/controller.helpers");

const signup = asyncHandler(async (req, res) => {
  console.log("Backend Signup Hit")
  console.log(req.body)
  const result = await authService.signup(authDto.toSignupRequestDto(req.body));

  res.status(201).json({ message: "Signup successful", data: authDto.toAuthResponseDto(result) });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(authDto.toLoginRequestDto(req.body));

  res.status(200).json({ message: "Login successful", data: authDto.toAuthResponseDto(result) });
});

module.exports = {
  signup,
  login,
};
