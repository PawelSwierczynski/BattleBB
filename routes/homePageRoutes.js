"use strict";

var express = require("express");
var homePageController = require("../controllers/homePageController");
var subforumController = require("../controllers/subforumController");

var router = express.Router();

router.get("/", homePageController.retrieveHomePage);

router.get("/category/", subforumController.retrieveSubforum);

module.exports = router;