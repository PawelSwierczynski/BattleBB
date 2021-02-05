"use strict";

const config = require("../config.json");

var { body, param, validationResult } = require("express-validator");
var languages = require("../languages.json");
var post = require("../models/post");
var roll = require("../models/roll");
var battlecodeParser = require("../utilities/battlecodeParser");
var messageHandler = require("../utilities/messageHandler");

function calculatePageNumber(postCount) {
    return Math.ceil(postCount / config.postsPerPage);
}

function retrieveIsUserPermittedToEditPost(username, userRole, postIdentifier) {
    return new Promise((resolve) => {
        if (userRole <= 2) {
            resolve(true);
        }
        else {
            post.retrieveAuthorUsername(postIdentifier, (error, authorUsername) => {
                resolve(!error && username === authorUsername);
            });
        }
    });
}

function isUserPermittedToEditPost(isLoggedIn, username, postAuthorUsername, userRole) {
    if (isLoggedIn) {
        return username === postAuthorUsername || userRole <= 2;
    }
    else {
        return false;
    }
}

function validatePage() {
    return [
        param("page", "pageMissing").exists(),
        param("page", "pageInvalid").isInt({ min: 1 })
    ];
}

function validatePost() {
    return [
        body("post", "postMissing").exists(),
        body("post", "postEmpty").isString().isLength({ min: 1 })
    ];
}

function validatePostIdentifier() {
    return [
        param("postIdentifier", "postIdentifierMissing").exists(),
        param("postIdentifier", "postIdentifierInvalid").isInt({ min: 1 })
    ];
}

function validateReportReason() {
    return [
        body("reportReason", "reportReasonMissing").exists(),
        body("reportReason", "reportReasonEmpty").isString().isLength({ min: 1 })
    ];
}

var threadController = {
    retrievePostsLatestVersions(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/");

            return;
        }

        post.getPostsLatestVersions(req.params.threadIdentifier, req.params.page, config.postsPerPage, (error, thread, postsLatestVersions) => {
            if (error) {
                messageHandler.setErrorMessage(req, "threadNotFound");

                res.redirect("/");

                return;
            }

            const numberOfPages = calculatePageNumber(thread.PostCount);

            var postDiceRolls = Promise.all(postsLatestVersions.map(roll.retrievePostsRolls));

            postDiceRolls.then(postDiceRollsResults => {
                var i = 0;

                postsLatestVersions.forEach(postLatestVersion => {
                    postLatestVersion.Content = battlecodeParser.parseBattlecode(postLatestVersion.Content);
                    postLatestVersion.DiceRolls = postDiceRollsResults[i];

                    i++;

                    if (isUserPermittedToEditPost(req.session.isLoggedIn, req.session.username, postLatestVersion.Login, req.session.userRole)) {
                        postLatestVersion.IsUserPermittedToEditPost = true;
                    }
                });
                
                res.render("thread.ejs", {
                    language: languages[req.session.language],
                    thread: thread,
                    posts: postsLatestVersions,
                    currentPage: req.params.page,
                    numberOfPages: numberOfPages,
                    lastVisitedUrl: req.originalUrl,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole,
                    username: req.session.username,
                    errorMessage: messageHandler.retrieveErrorMessage(req),
                    noticeMessage: messageHandler.retrieveNoticeMessage(req)
                });
            });
        });
    },
    retrieveNewPostPage(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/");

            return;
        }

        if (req.session.isLoggedIn) {
            res.render("newPost.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req)
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    addNewPost(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/");

            return;
        }

        if (req.session.isLoggedIn) {
            post.addNewPost(req.params.threadIdentifier, req.session.username, req.body.post, (error, postNumber) => {
                if (error) {
                    res.render("newPost.ejs", {
                        language: languages[req.session.language],
                        lastVisitedUrl: req.originalUrl,
                        isLoggedIn: req.session.isLoggedIn,
                        userRole: req.session.userRole,
                        errorMessage: messageHandler.retrieveErrorMessage(req),
                        noticeMessage: messageHandler.retrieveNoticeMessage(req)
                    });
                }
                else {
                    if (req.body.isUserWillingToRollDice != null && req.body.isUserWillingToRollDice == "on") {
                        req.session.isUserWillingToRollDice = true;

                        post.retrievePostIdentifier(req.params.threadIdentifier, postNumber, postIdentifier => {
                            req.session.postIdentifierWithRoll = postIdentifier;
                            req.session.postWithRollsAddress = "/thread/" + req.params.threadIdentifier + "/page/" + calculatePageNumber(postNumber) + "#" + postNumber;

                            res.redirect("/roll/newRoll");
                        });

                        return;
                    }
                    else {
                        req.session.isUserWillingToRollDice = false;

                        res.redirect("/thread/" + req.params.threadIdentifier + "/page/" + calculatePageNumber(postNumber) + "#" + postNumber);
                    }
                }
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/login");
        }
    },
    retrieveEditPostPage(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/");

            return;
        }

        if (req.session.isLoggedIn) {
            retrieveIsUserPermittedToEditPost(req.session.username, req.session.userRole, req.params.postIdentifier).then(isUserPermittedToEditPost => {
                if (isUserPermittedToEditPost) {
                    post.getLatestPostVersion(req.params.postIdentifier, (error, latestPostVersion) => {
                        if (error) {
                            messageHandler.setErrorMessage(req, "invalidData");

                            res.redirect("/");
                        }
                        else {
                            res.render("editPost.ejs", {
                                language: languages[req.session.language],
                                lastVisitedUrl: req.originalUrl,
                                isLoggedIn: req.session.isLoggedIn,
                                userRole: req.session.userRole,
                                latestPostVersion: latestPostVersion,
                                errorMessage: messageHandler.retrieveErrorMessage(req),
                                noticeMessage: messageHandler.retrieveNoticeMessage(req)
                            });
                        }
                    });
                }
                else {
                    messageHandler.setErrorMessage(req, "userNoPermission")

                    res.redirect("/");
                }
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    editPost(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/");

            return;
        }

        if (req.session.isLoggedIn) {
            retrieveIsUserPermittedToEditPost(req.session.username, req.session.userRole, req.params.postIdentifier).then(isUserPermittedToEditPost => {
                if (isUserPermittedToEditPost) {
                    post.addPostNewVersion(req.body.post, req.params.postIdentifier, (error, postNumber) => {
                        if (error) {
                            messageHandler.setErrorMessage(req, "cannotAddPostVersion");

                            res.render("editPost.ejs", {
                                language: languages[req.session.language],
                                lastVisitedUrl: req.originalUrl,
                                isLoggedIn: req.session.isLoggedIn,
                                userRole: req.session.userRole,
                                latestPostVersion: req.body.post,
                                errorMessage: messageHandler.retrieveErrorMessage(req),
                                noticeMessage: messageHandler.retrieveNoticeMessage(req)
                            });
                        }
                        else {
                            if (req.body.isUserWillingToRollDice != null && req.body.isUserWillingToRollDice == "on") {
                                req.session.isUserWillingToRollDice = true;
                                req.session.postIdentifierWithRoll = req.params.postIdentifier;
                                req.session.postWithRollsAddress = "/thread/" + req.params.threadIdentifier + "/page/" + calculatePageNumber(postNumber) + "#" + postNumber;
    
                                res.redirect("/roll/newRoll");
                            }
                            else {
                                req.session.isUserWillingToRollDice = false;

                                res.redirect("/thread/" + req.params.threadIdentifier + "/page/" + calculatePageNumber(postNumber) + "#" + postNumber);
                            }
                        }
                    });
                }
                else {
                    messageHandler.setErrorMessage(req, "userNoPermission")

                    res.redirect("/");
                }
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    retrieveReportPost(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/");

            return;
        }

        if (req.session.isLoggedIn) {
            res.render("reportPost.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req)
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    reportPost(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/");

            return;
        }

        if (req.session.isLoggedIn) {
            post.reportPost(req.body.reportReason, req.params.postIdentifier, req.session.username, (error, postNumber) => {
                if (error) {
                    messageHandler.setErrorMessage(req, "invalidData");
                }
                else {
                    messageHandler.setNoticeMessage(req, "reportSent");
                }

                res.redirect("/thread/" + req.params.threadIdentifier + "/page/" + calculatePageNumber(postNumber));
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    validateThreadIdentifier() {
        return [
            param("threadIdentifier", "threadIdentifierMissing").exists(),
            param("threadIdentifier", "threadIdentifierInvalid").isInt({ min: 1 })
        ];
    },
    validatePostsLatestVersions() {
        const threadIdentifierErrors = this.validateThreadIdentifier();
        const pageErrors = validatePage();

        return threadIdentifierErrors.concat(pageErrors);
    },
    validateNewPost() {
        const threadIdentifierErrors = this.validateThreadIdentifier();
        const postErrors = validatePost();

        return threadIdentifierErrors.concat(postErrors);
    },
    validateRetrieveEditPost() {
        const threadIdentifierErrors = this.validateThreadIdentifier();
        const postIdentifierErrors = validatePostIdentifier();

        return threadIdentifierErrors.concat(postIdentifierErrors);
    },
    validateEditPost() {
        const threadIdentifierErrors = this.validateThreadIdentifier();
        const postIdentifierErrors = validatePostIdentifier();
        const postErrors = validatePost();

        return threadIdentifierErrors.concat(postIdentifierErrors, postErrors);
    },
    validateRetrieveReportPost() {
        return this.validateRetrieveEditPost();
    },
    validateReportPost() {
        const threadIdentifierErrors = this.validateThreadIdentifier();
        const postIdentifierErrors = validatePostIdentifier();
        const reportReasonErrors = validateReportReason();

        return threadIdentifierErrors.concat(postIdentifierErrors, reportReasonErrors);
    }
}

module.exports = threadController;