"use strict";

var languages = require("../languages.json");
var category = require("../models/category");

var homePageController = {
    retrieveHomePage(req, res) {
        category.getCategoriesWithChildren(null, req.session.language, categoriesWithChildren => {
            res.render("homePage.ejs", {
                language: languages[req.session.language],
                categories: categoriesWithChildren,
                lastVisitedUrl: req.path
            });
        });
    }
}

module.exports = homePageController;