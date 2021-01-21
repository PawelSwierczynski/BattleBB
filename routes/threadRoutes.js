"use strict";

var express = require("express");
var threadController = require("../controllers/threadController");

var router = express.Router();

router.get("/:identifier/page/:page", threadController.retrievePostsLatestVersions);
router.get("/:identifier/newPost", threadController.retrieveNewPostPage);
router.post("/:identifier/newPost", threadController.addNewPost);

module.exports = router;