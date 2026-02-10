const AppError = require("../common/error/appError");

const ProductNotFoundError = new AppError("Product not found", 404);
const ProductOutOfStockError = new AppError("Product out of stock", 400);
const InvalidProductDataError = new AppError("Invalid product data", 400);
const OrderNotFoundError = new AppError("Order not found", 404);
const OrderCannotBeCancelledError = new AppError("Order cannot be cancelled",400);
const UnauthorizedOrderAccessError = new AppError("Unauthorized access to order",403);
const EmptyOrderItemsError = new AppError("Order must contain items", 400);

module.exports = {
  ProductNotFoundError,
  ProductOutOfStockError,
  InvalidProductDataError,

  OrderNotFoundError,
  OrderCannotBeCancelledError,
  UnauthorizedOrderAccessError,
  EmptyOrderItemsError,
};
