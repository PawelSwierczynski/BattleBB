"use strict";

var express = require("express");
var homePageController = require("../controllers/homePageController");

var router = express.Router();

router.get("/", homePageController.retrieveHomePage);

module.exports = router;