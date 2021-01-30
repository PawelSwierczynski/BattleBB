"use strict";

var express = require("express");
var threadController = require("../controllers/threadController");

var router = express.Router();

router.get("/:identifier/page/:page", threadController.retrievePostsLatestVersions);
router.get("/:identifier/newPost", threadController.retrieveNewPostPage);
router.post("/:identifier/newPost", threadController.addNewPost);
router.get("/:threadIdentifier/editPost/:postIdentifier", threadController.retrieveEditPostPage);
router.post("/:threadIdentifier/editPost/:postIdentifier", threadController.editPost);
router.get("/:threadIdentifier/reportPost/:postIdentifier", threadController.retrieveReportPost);
router.post("/:threadIdentifier/reportPost/:postIdentifier", threadController.reportPost);

module.exports = router;