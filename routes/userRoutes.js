"use strict";

var express = require("express");
var userController = require("../controllers/userController");

var router = express.Router();

router.get("/register", userController.retrieveRegisterPage);
router.post("/register", userController.validateRegister(), userController.registerNewUser);
router.get("/logIn", userController.retrieveLogInPage);
router.post("/logIn", userController.validateLogIn(), userController.logIn);
router.get("/logOut", userController.logOut);
router.get("/panel", userController.retrieveUserPanel);
router.post("/changePassword", userController.validateChangePassword(), userController.changePassword);
router.get("/:identifier", userController.validateUserProfile(), userController.retrieveUserProfile);

module.exports = router;