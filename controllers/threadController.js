"use strict";

const postsPerPageCount = 20;

var languages = require("../languages.json");
var post = require("../models/post");

var threadController = {
    retrievePostsLatestVersions(req, res) {
        post.getPostsLatestVersions(req.query.identifier, req.query.page, postsPerPageCount, postsLatestVersions => {
            console.log(postsLatestVersions);

            res.render("thread.ejs", {
                language: languages[req.session.language],
                posts: postsLatestVersions,
                lastVisitedUrl: req.originalUrl
            });
        });
    }
}

module.exports = threadController;