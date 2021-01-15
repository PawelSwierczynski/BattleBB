"use strict";

var express = require("express");
var subforumPageController = require("../controllers/subforumPageController");

var router = express.Router();

router.get("/", subforumPageController.retrieveThread);

module.exports = router;