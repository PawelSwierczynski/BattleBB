"use strict";

var express = require("express");
var indexController = require("../controllers/indexController");

var router = express.Router();

router.get("/", indexController.renderHomePage);

module.exports = router;