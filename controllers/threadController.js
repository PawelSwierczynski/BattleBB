"use strict";

const config = require("../config.json");

var languages = require("../languages.json");
var post = require("../models/post");
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

var threadController = {
    retrievePostsLatestVersions(req, res) {
        post.getPostsLatestVersions(req.params.identifier, req.params.page, config.postsPerPage, (thread, postsLatestVersions) => {
            const numberOfPages = calculatePageNumber(thread.PostCount);

            postsLatestVersions.forEach(postLatestVersion => {
                postLatestVersion.Content = battlecodeParser.parseBattlecode(postLatestVersion.Content);

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
    },
    retrieveNewPostPage(req, res) {
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
            res.redirect("/user/logIn");
        }
    },
    addNewPost(req, res) {
        if (req.session.isLoggedIn) {
            post.addNewPost(req.params.identifier, req.session.username, req.body.post, (error, postNumber) => {
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
                    res.redirect("/thread/" + req.params.identifier + "/page/" + calculatePageNumber(postNumber));
                }
            });
        }
        else {
            res.redirect("/user/login");
        }
    },
    retrieveEditPostPage(req, res) {
        if (req.session.isLoggedIn) {
            retrieveIsUserPermittedToEditPost(req.session.username, req.session.userRole, req.params.postIdentifier).then(isUserPermittedToEditPost => {
                if (isUserPermittedToEditPost) {
                    post.getLatestPostVersion(req.params.postIdentifier, (error, latestPostVersion) => {
                        if (error) {
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
                    res.redirect("/");
                }
            });
        }
        else {
            res.redirect("/user/logIn");
        }
    },
    editPost(req, res) {
        if (req.session.isLoggedIn) {
            retrieveIsUserPermittedToEditPost(req.session.username, req.session.userRole, req.params.postIdentifier).then(isUserPermittedToEditPost => {
                if (isUserPermittedToEditPost) {
                    post.addPostNewVersion(req.body.post, req.params.postIdentifier, (error, postNumber) => {
                        if (error) {
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
                            res.redirect("/thread/" + req.params.threadIdentifier + "/page/" + calculatePageNumber(postNumber));
                        }
                    });
                }
                else {
                    res.redirect("/");
                }
            });
        }
        else {
            res.redirect("/user/logIn");
        }
    },
    retrieveReportPost(req, res) {
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
    }
}

module.exports = threadController;