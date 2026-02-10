const express = require("express");
const router = express.Router(); //like a mini app
const userController = require("./controllers/user.controller");
const {authMiddleware} = require("../middleWares/auth.middleWare");

router.post("/register",userController.register);
router.post("/login", userController.login);
router.get("/me", authMiddleware, userController.me);
router.post("/refresh", userController.refresh);

module.exports = router;    