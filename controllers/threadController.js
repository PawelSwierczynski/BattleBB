"use strict";

const config = require("../config.json");

var languages = require("../languages.json");
var post = require("../models/post");

function calculateNumberOfPages(postCount) {
    return Math.ceil(postCount / config.postsPerPage);
}

var threadController = {
    retrievePostsLatestVersions(req, res) {
        post.getPostsLatestVersions(req.query.identifier, req.query.page, config.postsPerPage, (thread, postsLatestVersions) => {
            const numberOfPages = calculateNumberOfPages(thread.PostCount);
            
            res.render("thread.ejs", {
                language: languages[req.session.language],
                thread: thread,
                posts: postsLatestVersions,
                currentPage: req.query.page,
                numberOfPages: numberOfPages,
                lastVisitedUrl: req.originalUrl
            });
        });
    }
}

module.exports = threadController;