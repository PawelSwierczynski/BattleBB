"use strict";

var languages = require("../languages.json");
var subforum = require("../models/subforum")

var categoryPageController = {
    retrieveSubforum(req, res) {
        subforum.getSubforums(req.query.identifier, (subforums, parentCategoryName, threads)=> {
            res.render("categoryPage.ejs", {
                language: languages[req.session.language],
                subforums: subforums,
                parentCategoryName: parentCategoryName,
                threads: threads,
                lastVisitedUrl: req.path
            });
        });
    }
}

module.exports = categoryPageController;