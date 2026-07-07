const { pickDefined, toDtoList } = require("../../utils/dto.helpers");

const customerFields = ["fullName", "phone", "email", "address", "isActive"];
const customerResponseFields = ["id", "fullName", "phone", "email", "address", "isActive", "createdAt", "updatedAt"];

const toCreateCustomerRequestDto = (body) => {
  return pickDefined(body, customerFields);
};

const toUpdateCustomerRequestDto = (body) => {
  return pickDefined(body, customerFields);
};

const toCustomerResponseDto = (customer) => {
  return pickDefined(customer, customerResponseFields);
};

const toCustomersResponseDto = (customers) => {
  return toDtoList(customers, toCustomerResponseDto);
};

module.exports = {
  toCreateCustomerRequestDto,
  toUpdateCustomerRequestDto,
  toCustomerResponseDto,
  toCustomersResponseDto,
};
