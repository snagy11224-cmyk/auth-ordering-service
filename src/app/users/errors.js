const AppError = require("../common/error/appError");

const UserAlreadyExistsError = new AppError("User already exists", 409);
const UnauthorizedError = new AppError("Unauthorized", 401);
const UserNotFoundError = new AppError("User Not Found", 404);
const NoTokenProvidedError = new AppError("No token provided", 401);    

module.exports = {
    UserAlreadyExistsError,
    UnauthorizedError,
    UserNotFoundError,
    NoTokenProvidedError
};  