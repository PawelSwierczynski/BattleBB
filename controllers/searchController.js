"use strict"

var { query, validationResult } = require("express-validator");
var languages = require("../languages.json");
var thread = require("../models/thread");
var dateFormatter = require("../utilities/dateFormatter");
var messageHandler = require("../utilities/messageHandler");

var searchController = {
    retrieveSearchPage(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/");

            return;
        }

        const lowercasePhrase = req.query.phrase.toLowerCase();

        thread.findThreadsMatchingPhase(lowercasePhrase, (error, matchedThreads) => {
            if (error) {
                messageHandler.setErrorMessage(req, "noMatchingThreads");
            }
            else {
                matchedThreads.forEach(matchedThread => {
                    matchedThread.SubmitDate = dateFormatter.formatDate(matchedThread.SubmitDate);
                });
            }

            res.render("searchPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req),
                phrase: req.query.phrase,
                matchedThreads: matchedThreads
            });
        });
    },
    validatePhrase() {
        return [
            query("phrase", "phraseMissing").exists(),
            query("phrase", "phraseInvalid").isString(),
            query("phrase", "phraseEmpty").isLength({ min: 1 }),
            query("phrase", "phraseTooLong").isLength({ max: 40 })
        ];
    }
}

module.exports = searchController;