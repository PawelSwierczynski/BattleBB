"use strict";

var languages = require("../languages.json");
var category = require("../models/category");

var homePageController = {
    retrieveHomePage(req, res) {
        category.getCategoriesWithChildren(null, req.session.language, (categoriesWithChildren, threads) => {
            res.render("homePage.ejs", {
                language: languages[req.session.language],
                categories: categoriesWithChildren,
                threads: threads,
                lastVisitedUrl: req.originalUrl
            });
        });
    }
}

module.exports = homePageController;