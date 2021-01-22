"use strict";

var languages = require("../languages.json");
var admin = require("../models/admin");

var adminController = {
    retreiveCategories(req, res) {    
        admin.retreiveCategories(categories => {
            res.render("addCategoryPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                categories: categories
            });
        });    
            
    },
    retreiveSubforum(req, res) {    
        admin.retreiveCategories(categories => {
            res.render("addSubforumPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                categories: categories
            });
        });    
            
    },
    addCategory(req, res) {       
        admin.createNewCategory(req.body.categoryName, req.body.language, req.body.parentCategory, cat => {
            res.render("adminPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole
            });
        });
    },
    addSubforum(req, res) {       
        admin.createNewSubforum(req.body.subforumName, req.body.parentCategory, cat => {
            res.render("adminPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole
            });
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