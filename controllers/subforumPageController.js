"use strict";

var languages = require("../languages.json");
var thread = require("../models/thread")

var subforumPageController = {
    retrieveThread(req, res) {
        thread.getThreads(req.query.identifier, (threads, parentSubforumName, posts)=> {
            res.render("subforumPage.ejs", {
                language: languages[req.session.language],
                threads: threads,
                parentSubforumName: parentSubforumName,
                posts: posts,                
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn
            });
        });
    }
}

module.exports = subforumPageController;