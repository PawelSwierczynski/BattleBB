"use strict";

var express = require("express");
var subforumController = require("../controllers/subforumController");

var router = express.Router();


router.get("/", subforumController.retrieveSubforum);

module.exports = router;