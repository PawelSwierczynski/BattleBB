"use strict";

var express = require("express");
var adminController = require("../controllers/adminController");

var router = express.Router();

router.get("/addCategory", adminController.retreiveCategories);
router.post("/addCategory", adminController.addCategory);
router.get("/addSubforum", adminController.retreiveSubforum);
router.post("/addSubforum", adminController.addSubforum);
router.get("/", adminController.retreivePanel);

module.exports = router;