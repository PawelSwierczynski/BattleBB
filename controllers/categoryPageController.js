"use strict";

var languages = require("../languages.json");
var subforum = require("../models/subforum");
var messageHandler = require("../utilities/messageHandler");

var categoryPageController = {
    retrieveSubforum(req, res) {
        subforum.getSubforums(req.query.identifier, (subforums, parentCategoryName, threads) => {
            res.render("categoryPage.ejs", {
                language: languages[req.session.language],
                subforums: subforums,
                parentCategoryName: parentCategoryName,
                threads: threads,
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req)
            });
        });
    }
}

module.exports = categoryPageController;