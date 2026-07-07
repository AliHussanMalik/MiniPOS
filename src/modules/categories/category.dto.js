const { pickDefined, toDtoList } = require("../../utils/dto.helpers");

const categoryFields = ["name", "description", "isActive"];
const categoryResponseFields = ["id", "name", "description", "isActive", "createdAt", "updatedAt"];

const toCreateCategoryRequestDto = (body) => {
  return pickDefined(body, categoryFields);
};

const toUpdateCategoryRequestDto = (body) => {
  return pickDefined(body, categoryFields);
};

const toCategoryResponseDto = (category) => {
  return pickDefined(category, categoryResponseFields);
};

const toCategoriesResponseDto = (categories) => {
  return toDtoList(categories, toCategoryResponseDto);
};

module.exports = {
  toCreateCategoryRequestDto,
  toUpdateCategoryRequestDto,
  toCategoryResponseDto,
  toCategoriesResponseDto,
};
