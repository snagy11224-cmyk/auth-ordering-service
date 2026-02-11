const {
  UserAlreadyExistsError,
  UserNotFoundError,
  NoTokenProvidedError,
} = require("../errors");
const userRepo = require("../repositories/user.repository");
const { hashPassword, comparePassword } = require("../utils/hash");
const {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require("../utils/jwt");
const logger = require("../../common/logger/logger");

//register user
exports.registerUser = async (email, password, correlationId) => {

logger.info("Register user request received", {
  correlationId,
  email,
});

const exists = await userRepo.findEmail(email);
  if (exists) {
    logger.warn("User already exists", { email, correlationId });
    throw UserAlreadyExistsError;
  }
  const hashedPassword = await hashPassword(password);
  const user = await userRepo.create(email, hashedPassword);
  logger.info("User registered successfully", {
    userId: user.id,
    correlationId,
  });

  return user;
};

//login user
exports.loginUser = async (email, password) => {
  const user =await userRepo.findEmail(email);
  if (!user) {
    throw UserNotFoundError;
  }

  const isCorrect = await comparePassword(password, user.password);
  if (!isCorrect) {
    throw UserNotFoundError;
  }

  return {
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user),
  };
};

//get my profile
exports.getProfile = async (decodedUser) => {
  const user = await userRepo.findEmail(decodedUser.email);
  if (!user) {
    throw UserNotFoundError;
  }
  return user;
};

//refresh token
exports.refreshToken = async (token) => {
  if (!token) {
    throw NoTokenProvidedError;
  }

  const decoded = verifyRefreshToken(token);

  const user = await userRepo.findEmail(decoded.email);
  if (!user) {
    throw UserNotFoundError;
  }

  return createAccessToken(user);
};

exports.ensureUserExistsById = async (userId) => {
  const user = await userRepo.findById(userId);
  if (!user) {
    throw UserNotFoundError;
  }
  return user;
};


exports.findByEmail = async (email) => {
  const user = await userRepo.findEmail(email);

  if (!user) {
    throw UserNotFoundError;
  }

  return user;
};
