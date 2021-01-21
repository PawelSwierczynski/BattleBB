"use strict";

const config = require("../config.json");

var languages = require("../languages.json");
var post = require("../models/post");
var battlecodeParser = require("../utilities/battlecodeParser");

function calculateNumberOfPages(postCount) {
    return Math.ceil(postCount / config.postsPerPage);
}

var threadController = {
    retrievePostsLatestVersions(req, res) {
        post.getPostsLatestVersions(req.params.identifier, req.params.page, config.postsPerPage, (thread, postsLatestVersions) => {
            const numberOfPages = calculateNumberOfPages(thread.PostCount);

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
                isAdmin: req.session.isAdmin
            });
        });
    }
}

module.exports = threadController;