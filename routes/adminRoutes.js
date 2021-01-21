"use strict";

var express = require("express");
var adminController = require("../controllers/adminController");

var router = express.Router();

router.get("/addCategory", adminController.retreiveCategories);

router.get("/", adminController.retreivePanel);

module.exports = router;