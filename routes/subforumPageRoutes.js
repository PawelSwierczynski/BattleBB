"use strict";

var express = require("express");
var subforumPageController = require("../controllers/subforumPageController");

var router = express.Router();

router.get("/", subforumPageController.retrieveThread);
router.get("/:identifier/newThread", subforumPageController.retrieveNewThreadPage);
router.post("/:identifier/newThread", subforumPageController.addNewThread);
router.post("/:identifier/closeThread/:threadIdentifier", subforumPageController.closeThread);
router.post("/:identifier/openThread/:threadIdentifier", subforumPageController.openThread);
router.post("/:identifier/pinThread/:threadIdentifier", subforumPageController.pinThread);
router.post("/:identifier/unpinThread/:threadIdentifier", subforumPageController.unpinThread);
router.post("/:identifier/deleteThread/:threadIdentifier", subforumPageController.deleteThread);

module.exports = router;