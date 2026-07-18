// Customer controller
// Handles incoming HTTP requests for customers and sends HTTP responses.

const customerService = require("./customer.service");
const customerDto = require("./customer.dto");
const { asyncHandler, requireId } = require("../../utils/controller.helpers");

const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(
    req.storeId,
    customerDto.toCreateCustomerRequestDto(req.body)
  );

  res.status(201).json({ message: "Customer created successfully", data: customerDto.toCustomerResponseDto(customer) });
});

const getCustomers = asyncHandler(async (req, res) => {
  const customers = await customerService.getCustomers(req.storeId);

  res.status(200).json({ data: customerDto.toCustomersResponseDto(customers) });
});

const getCustomerById = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const customer = await customerService.getCustomerById(id, req.storeId);

  res.status(200).json({ data: customerDto.toCustomerResponseDto(customer) });
});

const getOwnCustomerProfile = asyncHandler(async (req, res) => {
  const customer = await customerService.getOwnCustomerProfile(req.user, req.storeId);

  res.status(200).json({ data: customerDto.toCustomerResponseDto(customer) });
});

const updateCustomer = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  const customer = await customerService.updateCustomer(id, req.storeId, customerDto.toUpdateCustomerRequestDto(req.body));

  res.status(200).json({ message: "Customer updated successfully", data: customerDto.toCustomerResponseDto(customer) });
});

const updateOwnCustomerProfile = asyncHandler(async (req, res) => {
  const customer = await customerService.updateOwnCustomerProfile(
    req.user,
    req.storeId,
    customerDto.toUpdateCustomerRequestDto(req.body)
  );

  res.status(200).json({ message: "Customer profile updated successfully", data: customerDto.toCustomerResponseDto(customer) });
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const id = requireId(req, res);
  if (!id) return;

  await customerService.deleteCustomer(id, req.storeId);

  res.status(200).json({ message: "Customer deleted successfully" });
});

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  getOwnCustomerProfile,
  updateCustomer,
  updateOwnCustomerProfile,
  deleteCustomer,
};
