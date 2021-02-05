"use strict";

var express = require("express");
var rollController = require("../controllers/rollController");

var router = express.Router();

router.get("/newRoll", rollController.retrieveNewRollPage);
router.post("/newRoll", rollController.validateNewRoll(), rollController.addNewRoll);
router.get("/stopRolling", rollController.stopRolling);

module.exports = router;