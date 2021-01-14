"use strict";

var express = require("express");
var userController = require("../controllers/userController");

var router = express.Router();

//TODO change get to PUT/POST
router.get("/newAccount", userController.createNewUser);

module.exports = router;