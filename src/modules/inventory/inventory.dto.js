const { pickDefined, toDtoList } = require("../../utils/dto.helpers");

const inventoryFields = ["productId", "quantity", "movementType", "notes"];
const inventoryResponseFields = ["id", ...inventoryFields, "createdAt", "updatedAt"];

const toCreateInventoryRequestDto = (body) => {
  return pickDefined(body, inventoryFields);
};

const toUpdateInventoryRequestDto = (body) => {
  return pickDefined(body, inventoryFields);
};

const toInventoryResponseDto = (item) => {
  return pickDefined(item, inventoryResponseFields);
};

const toInventoryListResponseDto = (items) => {
  return toDtoList(items, toInventoryResponseDto);
};

module.exports = {
  toCreateInventoryRequestDto,
  toUpdateInventoryRequestDto,
  toInventoryResponseDto,
  toInventoryListResponseDto,
};
