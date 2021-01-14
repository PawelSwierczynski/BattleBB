"use strict";

var express = require("express");
var userController = require("../controllers/userController");

var router = express.Router();

router.get("/newAccount", userController.createNewUser);

module.exports = router;