const { UserAlreadyExistsError , UserNotFoundError, NoTokenProvidedError} = require("../errors");
const userRepo=require("../repositories/user.repository");
const {hashPassword,comparePassword}=require("../utils/hash");
const {createAccessToken,createRefreshToken,verifyRefreshToken,verifyAccessToken}=require("../utils/jwt");

//register user
exports.registerUser=async(email,password)=>{
    const exists=userRepo.findEmail(email);
    if(exists){
        throw UserAlreadyExistsError;
    }

    const hashedPassword=await hashPassword(password);
    return userRepo.create(email,hashedPassword);
}

//login user
exports.loginUser = async (email, password) => {
  const user = userRepo.findEmail(email);
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
  const user = userRepo.findEmail(decodedUser.email);
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

  const user = userRepo.findEmail(decoded.email);
  if (!user) {
    throw UserNotFoundError;
  }

  return createAccessToken(user);
};



