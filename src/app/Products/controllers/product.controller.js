const errorHandler = require("../../common/error/errorHandler");
const userService = require("../services/user.services");


exports.register = async (req, res, next) => {
  const { email, password } = req.body;             
    try {   
        const user = await userService.registerUser(email, password, req.correlationId);
        res.status(201).json({ message: "User registered successfully", email: user.email });
    } catch (error) {
        next(error);
       // res.status(400).json({ message: error.message });
    }
}   


exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const tokens = await userService.loginUser(email, password);
    res.status(200).json(tokens);
  } catch (error) {
    next(error);
    //res.status(401).json({ message: error.message });
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user);
    res.status(200).json({ email: user.email });
  } catch (error) {
    next(error);
   // res.status(401).json({ message: error.message });
  }
};

exports.refresh = async (req, res, next) => {
  const { token } = req.body;
  try {
    const accessToken = await userService.refreshToken(token);
    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
   // res.status(401).json({ message: "Unauthorized" });
  }
};



