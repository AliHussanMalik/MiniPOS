const { pickDefined, toDtoList } = require("../../utils/dto.helpers");

const storeFields = [
  "name",
  "slug",
  "email",
  "phone",
  "address",
  "status",
];

const storeResponseFields = ["id", "ownerId", ...storeFields, "createdAt", "updatedAt"];

const toCreateStoreRequestDto = (body) => {
  return pickDefined(body, storeFields);
};

const toUpdateStoreRequestDto = (body) => {
  return pickDefined(body, storeFields);
};

const toStoreResponseDto = (store) => {
  return pickDefined(store, storeResponseFields);
};

const toStoresResponseDto = (stores) => {
  return toDtoList(stores, toStoreResponseDto);
};

const toStoreUserResponseDto = (storeUser) => {
  return pickDefined(storeUser, ["id", "storeId", "userId", "isActive", "createdAt", "email", "fullName", "role"]);
};

const toStoreUsersResponseDto = (storeUsers) => {
  return toDtoList(storeUsers, toStoreUserResponseDto);
};

module.exports = {
  toCreateStoreRequestDto,
  toUpdateStoreRequestDto,
  toStoreResponseDto,
  toStoresResponseDto,
  toStoreUserResponseDto,
  toStoreUsersResponseDto,
};
