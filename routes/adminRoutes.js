"use strict";

var express = require("express");
var adminController = require("../controllers/adminController");

var router = express.Router();

router.get("/addCategory", adminController.retreiveCategories);
router.post("/addCategory", adminController.addCategory);
router.get("/addSubforum", adminController.retreiveSubforum);
router.post("/addSubforum", adminController.addSubforum);
router.get("/changeUserRole", adminController.retreiveUsers);
router.post("/changeUserRole", adminController.changeUserRole);
router.get("/removeCategory", adminController.retreiveCategories2);
router.post("/removeCategory", adminController.removeCategory);
router.get("/removeSubforum", adminController.retreiveSubforums);
router.post("/removeSubforum", adminController.removeSubforum);
router.get("/", adminController.retreivePanel);

module.exports = router;