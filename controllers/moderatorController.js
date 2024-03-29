"use strict";

var languages = require("../languages.json");
var moderator = require("../models/moderator");
var messageHandler = require("../utilities/messageHandler");

var moderatorController = {
    retreiveUsers(req, res) {  
        if (req.session.userRole === 1 || req.session.userRole === 2) { 
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
        }
        else{
            messageHandler.setErrorMessage(req, "moderatorRoleRequired");

            res.redirect("/");
        }
    },
    retreiveReportedPosts(req, res) {   
        if (req.session.userRole === 1 || req.session.userRole === 2) {
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
        } 
        else{
            messageHandler.setErrorMessage(req, "moderatorRoleRequired");

            res.redirect("/");
        }
    },
    changeUserRole(req, res) {   
        if (req.session.userRole === 1 || req.session.userRole === 2) {
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
        }
        else{
            messageHandler.setErrorMessage(req, "moderatorRoleRequired");

            res.redirect("/");
        } 
    },
    deletePostAndBanUser(req, res) {  
        if (req.session.userRole === 1 || req.session.userRole === 2) {
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
            messageHandler.setErrorMessage(req, "moderatorRoleRequired");

            res.redirect("/");
        }
    },
    deletePost(req, res) {  
        if (req.session.userRole === 1 || req.session.userRole === 2) {
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
            messageHandler.setErrorMessage(req, "moderatorRoleRequired");

            res.redirect("/");
        }
    },
    deleteReport(req, res) {  
        if (req.session.userRole === 1 || req.session.userRole === 2) {
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
            messageHandler.setErrorMessage(req, "moderatorRoleRequired");

            res.redirect("/");
        }
    },
    retreiveReports(req, res) {  
        if (req.session.userRole === 1 || req.session.userRole === 2) {
            moderator.retreiveReports(req.params.IdPost, (reports) => {
                    res.render("reportsPage.ejs", {
                        language: languages[req.session.language],
                        lastVisitedUrl: req.originalUrl,
                        isLoggedIn: req.session.isLoggedIn,
                        userRole: req.session.userRole,
                        reports: reports,
                        errorMessage: messageHandler.retrieveErrorMessage(req),
                        noticeMessage: messageHandler.retrieveNoticeMessage(req)  
                });
            });
        }
        else {
            messageHandler.setErrorMessage(req, "moderatorRoleRequired");

            res.redirect("/");
        }
    },
    retreivePanel(req, res) {      
        if (req.session.userRole === 1 || req.session.userRole === 2) {

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
        else{
            messageHandler.setErrorMessage(req, "moderatorRoleRequired");

            res.redirect("/");
        }
}
}

module.exports = moderatorController;