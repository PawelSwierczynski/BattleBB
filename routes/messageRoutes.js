"use strict";

var express = require("express");
var messageController = require("../controllers/messageController");

var router = express.Router();

router.get("/received", messageController.retrieveReceivedMessages);
router.get("/sent", messageController.retrieveSentMessages);
router.get("/new", messageController.validateRetrieveNewMessage(), messageController.retrieveNewMessagePage);
router.post("/new", messageController.validateNewMessage(), messageController.sendMessage);
router.get("/read/:messageIdentifier", messageController.validateRead(), messageController.retrieveMessage);

module.exports = router;