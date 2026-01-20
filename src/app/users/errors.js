const AppError = require("../common/error/appError");

const UserAlreadyExistsError = new AppError("User already exists", 400);

module.exports = {
    UserAlreadyExistsError
};  