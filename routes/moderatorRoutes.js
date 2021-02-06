"use strict";

var express = require("express");
var moderatorController = require("../controllers/moderatorController");

var router = express.Router();

router.get("/banUser", moderatorController.retreiveUsers);
router.post("/banUser", moderatorController.changeUserRole);
router.get("/reports", moderatorController.retreiveReportedPosts);
router.post("/reports/:IdPost/ban/:IdUser", moderatorController.deletePostAndBanUser);
router.post("/reports/:IdPost", moderatorController.deletePost);
router.post("/reports/deletereport/:IdPost", moderatorController.deleteReport);
router.get("/reports/view/:IdPost", moderatorController.retreiveReports);
router.get("/", moderatorController.retreivePanel);
module.exports = router;