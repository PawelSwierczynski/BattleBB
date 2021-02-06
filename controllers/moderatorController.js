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
    retreiveReportedPosts(req, res) {   
        moderator.retreiveReportedPosts(reportedPosts => { 
            res.render("reportedPostsPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                reportedPosts: reportedPosts,
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
    deletePostAndBanUser(req, res) {  
        if (req.session.isLoggedIn) {
            moderator.deletePostAndBanUser(req.params.IdPost, req.params.IdUser, (error) => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "bannedUserAndDeletedPost");
                }

                res.redirect("/moderator/reports");
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    deletePost(req, res) {  
        if (req.session.isLoggedIn) {
            moderator.deletePost(req.params.IdPost, (error) => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "deletedPost");
                }

                res.redirect("/moderator/reports");
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    deleteReport(req, res) {  
        if (req.session.isLoggedIn) {
            moderator.deleteReport(req.params.IdPost, (error) => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "deletedReport");
                }

                res.redirect("/moderator/reports");
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
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