"use strict";

var express = require("express");
var languageController = require("../controllers/languageController");

var router = express.Router();

router.get("/pl", languageController.setLanguageToPolish);
router.get("/en-us", languageController.setLanguageToAmericanEnglish);

module.exports = router;