const { pickDefined, toDtoList } = require("../../utils/dto.helpers");

const saleItemFields = ["productId", "quantity", "unitPrice", "subtotal"];
const saleFields = [
  "customerId",
  "subtotal",
  "discount",
  "tax",
  "totalAmount",
  "paymentMethod",
  "status",
  "items",
];

const saleUpdateFields = ["userId", ...saleFields];
const saleResponseFields = ["id", "customerId", "userId", "subtotal", "discount", "tax", "totalAmount", "paymentMethod", "status", "createdAt", "updatedAt"];
const saleItemResponseFields = ["id", "saleId", ...saleItemFields, "createdAt"];

const toSaleItemRequestDto = (item) => {
  return pickDefined(item, saleItemFields);
};

const toSaleItemsRequestDto = (items = []) => {
  return toDtoList(items, toSaleItemRequestDto);
};

const withSaleItemsDto = (dto) => {
  if (dto.items) {
    return {
      ...dto,
      items: toSaleItemsRequestDto(dto.items),
    };
  }

  return dto;
};

const toCreateSaleRequestDto = (body) => {
  return withSaleItemsDto(pickDefined(body, saleFields));
};

const toUpdateSaleRequestDto = (body) => {
  return withSaleItemsDto(pickDefined(body, saleUpdateFields));
};

const toSaleItemResponseDto = (item) => {
  return pickDefined(item, saleItemResponseFields);
};

const toSaleResponseDto = (sale) => {
  const dto = pickDefined(sale, saleResponseFields);

  if (sale.items) {
    dto.items = toDtoList(sale.items, toSaleItemResponseDto);
  }

  return dto;
};

const toSalesResponseDto = (sales) => {
  return toDtoList(sales, toSaleResponseDto);
};

module.exports = {
  toCreateSaleRequestDto,
  toUpdateSaleRequestDto,
  toSaleResponseDto,
  toSalesResponseDto,
};
