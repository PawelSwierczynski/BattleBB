"use strict";

var express = require("express");
var categoryPageController = require("../controllers/categoryPageController");

var router = express.Router();

router.get("/", categoryPageController.retrieveSubforum);

module.exports = router;