"use strict";

var languages = require("../languages.json");
var subforum = require("../models/subforum")

var subforumController = {
    retrieveSubforum(req, res) {
        subforum.getSubforums(req.query.identifier, (subforums, parentCategoryName)=> {
            res.render("categoryPage.ejs", {
                language: languages[req.session.language],
                subforums: subforums,
                parentCategoryName: parentCategoryName,
                lastVisitedUrl: req.path
            });
        });
    }
}

module.exports = subforumController;