const { pickDefined, toDtoList } = require("../../utils/dto.helpers");

const userFields = ["fullName", "email", "password", "role", "isActive"];
const userResponseFields = ["id", "fullName", "email", "role", "isActive", "createdAt", "updatedAt"];

const toCreateUserRequestDto = (body) => {
  return pickDefined(body, userFields);
};

const toUpdateUserRequestDto = (body) => {
  return pickDefined(body, userFields);
};

const toUserResponseDto = (user) => {
  return pickDefined(user, userResponseFields);
};

const toUsersResponseDto = (users) => {
  return toDtoList(users, toUserResponseDto);
};

module.exports = {
  toCreateUserRequestDto,
  toUpdateUserRequestDto,
  toUserResponseDto,
  toUsersResponseDto,
};
