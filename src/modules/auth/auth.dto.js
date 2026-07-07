const { pickDefined } = require("../../utils/dto.helpers");

const toSignupRequestDto = (body) => {
  return pickDefined(body, ["fullName", "email", "password", "role"]);
};

const toLoginRequestDto = (body) => {
  return pickDefined(body, ["email", "password"]);
};

const toUserResponseDto = (user) => {
  return pickDefined(user, ["id", "fullName", "email", "role", "isActive", "createdAt", "updatedAt"]);
};

const toAuthResponseDto = ({ user, token }) => {
  return {
    user: toUserResponseDto(user),
    token,
  };
};

module.exports = {
  toSignupRequestDto,
  toLoginRequestDto,
  toAuthResponseDto,
  toUserResponseDto,
};
