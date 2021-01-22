"use strict";

var languages = require("../languages.json");

var adminController = {
    retreiveCategories(req, res) {        
            res.render("addCategoryPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole
            });
    },
    retreivePanel(req, res) {        
        res.render("adminPage.ejs", {
            language: languages[req.session.language],
            lastVisitedUrl: req.originalUrl,
            isLoggedIn: req.session.isLoggedIn,
            userRole: req.session.userRole
        });
}
}

module.exports = adminController;