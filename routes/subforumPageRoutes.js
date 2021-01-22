"use strict";

var express = require("express");
var subforumPageController = require("../controllers/subforumPageController");

var router = express.Router();

router.get("/", subforumPageController.retrieveThread);
router.get("/:identifier/newThread", subforumPageController.retrieveNewThreadPage);
router.post("/:identifier/newThread", subforumPageController.addNewThread);

module.exports = router;