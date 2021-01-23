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
    retreiveUsers(req, res) {   
        admin.retreiveUsers(users => { 
            res.render("changeUserRolePage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                users: users
            });    
        });  
    },
    addCategory(req, res) {       
        admin.createNewCategory(req.body.categoryName, req.body.language, req.body.parentCategory, text => {
            res.render("adminPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                text: text
            });
        });
    },
    addSubforum(req, res) {       
        admin.createNewSubforum(req.body.subforumName, req.body.parentCategory, text => {
            res.render("adminPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                text: text
            });
        });
    },
    changeUserRole(req, res) {   
            admin.changeUserRole(req.body.username, req.body.userRole, text => {
                res.render("adminPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                text: text
            });
        });  
    },
    retreivePanel(req, res) {        
        res.render("adminPage.ejs", {
            language: languages[req.session.language],
            lastVisitedUrl: req.originalUrl,
            isLoggedIn: req.session.isLoggedIn,
            userRole: req.session.userRole,
            text: ""
        });
}
}

module.exports = adminController;