"use strict";

var express = require("express");
var threadController = require("../controllers/threadController");

var router = express.Router();

router.get("/:threadIdentifier/page/:page", threadController.validatePostsLatestVersions(), threadController.retrievePostsLatestVersions);
router.get("/:threadIdentifier/newPost", threadController.validateThreadIdentifier(), threadController.retrieveNewPostPage);
router.post("/:threadIdentifier/newPost", threadController.validateNewPost(), threadController.addNewPost);
router.get("/:threadIdentifier/editPost/:postIdentifier", threadController.validateRetrieveEditPost(), threadController.retrieveEditPostPage);
router.post("/:threadIdentifier/editPost/:postIdentifier", threadController.validateEditPost(), threadController.editPost);
router.get("/:threadIdentifier/reportPost/:postIdentifier", threadController.validateRetrieveReportPost(), threadController.retrieveReportPost);
router.post("/:threadIdentifier/reportPost/:postIdentifier", threadController.validateReportPost(), threadController.reportPost);

module.exports = router;