"use strict";

var express = require("express");
var threadController = require("../controllers/threadController");

var router = express.Router();

router.get("/:identifier/:page", threadController.retrievePostsLatestVersions);

module.exports = router;