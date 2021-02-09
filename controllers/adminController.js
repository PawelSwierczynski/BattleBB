"use strict";

var languages = require("../languages.json");
var admin = require("../models/admin");
var messageHandler = require("../utilities/messageHandler");

var adminController = {
    retreiveCategories(req, res) {   
        if (req.session.userRole === 1) {     
            admin.retreiveCategories(categories => {
                res.render("addCategoryPage.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole,
                    categories: categories,
                    errorMessage: messageHandler.retrieveErrorMessage(req),
                    noticeMessage: messageHandler.retrieveNoticeMessage(req)
                });
            });  
        }
        else{
            messageHandler.setErrorMessage(req, "adminRoleRequired");
            res.redirect("/");
        } 
          
            
    },
    retreiveSubforums(req, res) {   
        if (req.session.userRole === 1) {     
            admin.retreiveSubforums(subforums => {
                res.render("removeSubforumPage.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole,
                    subforums: subforums,
                    errorMessage: messageHandler.retrieveErrorMessage(req),
                    noticeMessage: messageHandler.retrieveNoticeMessage(req)
                });
            });  
        }
        else{
            messageHandler.setErrorMessage(req, "adminRoleRequired");
            res.redirect("/");
        } 
          
            
    },
    retreiveCategories2(req, res) {   
        if (req.session.userRole === 1) {     
            admin.retreiveCategories(categories => {
                res.render("removeCategoryPage.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole,
                    categories: categories,
                    errorMessage: messageHandler.retrieveErrorMessage(req),
                    noticeMessage: messageHandler.retrieveNoticeMessage(req)
                });
            });  
        }
        else{
            messageHandler.setErrorMessage(req, "adminRoleRequired");
            res.redirect("/");
        } 
          
            
    },
    retreiveSubforum(req, res) {   
        if (req.session.userRole === 1) {     
            admin.retreiveCategories(categories => {
                res.render("addSubforumPage.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole,
                    categories: categories,
                    errorMessage: messageHandler.retrieveErrorMessage(req),
                    noticeMessage: messageHandler.retrieveNoticeMessage(req)
                });
            });  
        }
        else{
            messageHandler.setErrorMessage(req, "adminRoleRequired");
            res.redirect("/");
        } 
          
            
    },
    retreiveUsers(req, res) {  
        if (req.session.userRole === 1) {     
            admin.retreiveUsers(users => { 
                res.render("changeUserRolePage.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole,
                    users: users,
                    errorMessage: messageHandler.retrieveErrorMessage(req),
                    noticeMessage: messageHandler.retrieveNoticeMessage(req)
                });    
            }); 
        }
        else{
            messageHandler.setErrorMessage(req, "adminRoleRequired");
            res.redirect("/");
        } 
         
    },
    addCategory(req, res) {      
        if (req.session.userRole === 1) {     
            admin.createNewCategory(req.body.categoryName, req.body.language, req.body.parentCategory, error => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "addedCategory");
                }

                res.redirect("/admin/");
            });
        }
        else{
            messageHandler.setErrorMessage(req, "adminRoleRequired");
            res.redirect("/");
        } 
        
    },
    addSubforum(req, res) {     
        if (req.session.userRole === 1) {     
            admin.createNewSubforum(req.body.subforumName, req.body.parentCategory, error => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "addedSubforum");
                }

                res.redirect("/admin/");
            });
        }
        else{
            messageHandler.setErrorMessage(req, "adminRoleRequired");
            res.redirect("/");
        }  
        
    },
    changeUserRole(req, res) {   
        if (req.session.userRole === 1) {     
            admin.changeUserRole(req.body.username, req.body.userRole, error => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "changedUserRole");
                }

                res.redirect("/admin/");
        }); 
        }
        else{
            messageHandler.setErrorMessage(req, "adminRoleRequired");
            res.redirect("/");
        }
             
    },
    retreivePanel(req, res) {   
        if (req.session.userRole === 1) {     
        res.render("adminPage.ejs", {
            language: languages[req.session.language],
            lastVisitedUrl: req.originalUrl,
            isLoggedIn: req.session.isLoggedIn,
            userRole: req.session.userRole,
            text: "",
            errorMessage: messageHandler.retrieveErrorMessage(req),
            noticeMessage: messageHandler.retrieveNoticeMessage(req)
        });
    }
    else{
        messageHandler.setErrorMessage(req, "adminRoleRequired");
        res.redirect("/");
    }
    },
    removeCategory(req, res) {
        if (req.session.userRole === 1) {
            admin.removeCategory(req.body.categoryName, (error) => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "removedCategory");
                }

                res.redirect("/admin/");
            });
        }
        else {
            messageHandler.setErrorMessage(req, "adminRoleRequired");
            res.redirect("/");
        }
    },
    removeSubforum(req, res) {
        if (req.session.userRole === 1) {
            admin.removeSubforum(req.body.categoryName, (error) => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "removedSubforum");
                }

                res.redirect("/admin/");
            });
        }
        else {
            messageHandler.setErrorMessage(req, "adminRoleRequired");
            res.redirect("/");
        }
    },
}

module.exports = adminController;

