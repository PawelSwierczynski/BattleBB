"use strict";

var languages = require("../languages.json");
var moderator = require("../models/moderator");
var messageHandler = require("../utilities/messageHandler");

var moderatorController = {
    retreiveUsers(req, res) {   
        moderator.retreiveUsers(users => { 
            res.render("banUserPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                users: users,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req)
            });    
        });  
    },
    changeUserRole(req, res) {   
            moderator.changeUserRole(req.body.username, req.body.userRole, text => {
                res.render("moderatorPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                text: text,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req)
            });
        });  
    },
    retreivePanel(req, res) {        
        res.render("moderatorPage.ejs", {
            language: languages[req.session.language],
            lastVisitedUrl: req.originalUrl,
            isLoggedIn: req.session.isLoggedIn,
            userRole: req.session.userRole,
            text: "",
            errorMessage: messageHandler.retrieveErrorMessage(req),
            noticeMessage: messageHandler.retrieveNoticeMessage(req)
        });
}
}

module.exports = moderatorController;