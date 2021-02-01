"use strict"

var express = require("express");
var searchController = require("../controllers/searchController");

var router = express.Router();

router.get("/", searchController.validatePhrase(), searchController.retrieveSearchPage);

module.exports = router;