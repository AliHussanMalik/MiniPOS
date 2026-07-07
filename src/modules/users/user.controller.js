// User controller
// Handles incoming HTTP requests for users and sends HTTP responses.
// Business rules should live in the service layer when implementation is added.

const userService = require("./user.service");
const userDto = require("./user.dto");
const { asyncHandler, requireId } = require("../../utils/controller.helpers");

const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(userDto.toCreateUserRequestDto(req.body));

  res.status(201).json({ message: "User created successfully", data: userDto.toUserResponseDto(user) });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getUsers();

  res.status(200).json({ data: userDto.toUsersResponseDto(users) });
});

const getUserById = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const user = await userService.getUserById(id);

  res.status(200).json({ data: userDto.toUserResponseDto(user) });
});

const updateUser = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const user = await userService.updateUser(id, userDto.toUpdateUserRequestDto(req.body));

  res.status(200).json({ message: "User updated successfully", data: userDto.toUserResponseDto(user) });
});

const deleteUser = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  await userService.deleteUser(id);

  res.status(200).json({ message: "User deleted successfully" });
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
