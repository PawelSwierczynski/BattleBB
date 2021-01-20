"use strict";

const config = require("../config.json");

var languages = require("../languages.json");
var post = require("../models/post");
var battlecodeParser = require("../utilities/battlecodeParser");

function calculatePageNumber(postCount) {
    return Math.ceil(postCount / config.postsPerPage);
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
                isLoggedIn: req.session.isLoggedIn
            });
        });
    },
    retrieveNewPostPage(req, res) {
        if (req.session.isLoggedIn) {
            res.render("newPost.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                errorMessage: false
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
                        errorMessage: languages[req.session.language].unknownError
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
    }
}

module.exports = threadController;