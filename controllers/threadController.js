"use strict";

const config = require("../config.json");

var languages = require("../languages.json");
var post = require("../models/post");
var battlecodeParser = require("../utilities/battlecodeParser");

function calculatePageNumber(postCount) {
    return Math.ceil(postCount / config.postsPerPage);
}

function isUserPermittedToEditPost(username, userRole, postIdentifier) {
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

var threadController = {
    retrievePostsLatestVersions(req, res) {
        post.getPostsLatestVersions(req.params.identifier, req.params.page, config.postsPerPage, (thread, postsLatestVersions) => {
            const numberOfPages = calculatePageNumber(thread.PostCount);

            postsLatestVersions.forEach(postLatestVersion => {
                postLatestVersion.Content = battlecodeParser.parseBattlecode(postLatestVersion.Content);
            });
            
            res.render("thread.ejs", {
                language: languages[req.session.language],
                thread: thread,
                posts: postsLatestVersions,
                currentPage: req.params.page,
                numberOfPages: numberOfPages,
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole
            });
        });
    },
    retrieveNewPostPage(req, res) {
        if (req.session.isLoggedIn) {
            res.render("newPost.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                errorMessage: false,
                userRole: req.session.userRole
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
                        errorMessage: languages[req.session.language].unknownError,
                        userRole: req.session.userRole
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
            isUserPermittedToEditPost(req.session.username, req.session.userRole, req.params.postIdentifier).then(isUserPermittedToEditPost => {
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
                                errorMessage: false,
                                userRole: req.session.userRole,
                                latestPostVersion: latestPostVersion
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
            isUserPermittedToEditPost(req.session.username, req.session.userRole, req.params.postIdentifier).then(isUserPermittedToEditPost => {
                if (isUserPermittedToEditPost) {
                    post.addPostNewVersion(req.body.post, req.params.postIdentifier, (error, postNumber) => {
                        if (error) {
                            res.render("editPost.ejs", {
                                language: languages[req.session.language],
                                lastVisitedUrl: req.originalUrl,
                                isLoggedIn: req.session.isLoggedIn,
                                errorMessage: languages[req.session.language].unknownError,
                                userRole: req.session.userRole,
                                latestPostVersion: req.body.post
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
    }
}

module.exports = threadController;