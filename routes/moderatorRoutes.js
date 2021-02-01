"use strict";

var express = require("express");
var moderatorController = require("../controllers/moderatorController");

var router = express.Router();

router.get("/banUser", moderatorController.retreiveUsers);
router.post("/banUser", moderatorController.changeUserRole);
router.get("/", moderatorController.retreivePanel);

module.exports = router;