"use strict";

var express = require("express");
var userController = require("../controllers/userController");

var router = express.Router();

router.get("/register", userController.retrieveRegisterPage);
router.post("/register", userController.createNewUser);
router.get("/logIn", userController.retrieveLogInPage);

module.exports = router;