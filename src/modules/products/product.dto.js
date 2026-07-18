const { pickDefined, toDtoList } = require("../../utils/dto.helpers");

const productFields = [
  "name",
  "categoryId",
  "barcode",
  "sku",
  "description",
  "costPrice",
  "sellingPrice",
  "stockQuantity",
  "minimumStock",
  "unit",
  "isActive",
];

const productResponseFields = ["id", ...productFields, "createdAt", "updatedAt"];
const productUpdateFields = productFields.filter((field) => field !== "stockQuantity");

const toCreateProductRequestDto = (body) => {
  return pickDefined(body, productFields);
};

const toUpdateProductRequestDto = (body) => {
  return pickDefined(body, productUpdateFields);
};

const toProductResponseDto = (product) => {
  return pickDefined(product, productResponseFields);
};

const toProductsResponseDto = (products) => {
  return toDtoList(products, toProductResponseDto);
};

module.exports = {
  toCreateProductRequestDto,
  toUpdateProductRequestDto,
  toProductResponseDto,
  toProductsResponseDto,
};
