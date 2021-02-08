"use strict";

var languages = require("../languages.json");
var thread = require("../models/thread");
var messageHandler = require("../utilities/messageHandler");

var subforumPageController = {
    retrieveThread(req, res) {
        thread.getThreads(req.query.identifier, (threads, parentSubforumName, posts)=> {
            res.render("subforumPage.ejs", {
                language: languages[req.session.language],
                threads: threads,
                parentSubforumName: parentSubforumName,
                posts: posts,                
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                subforumIdentifier: req.query.identifier,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req)
            });
        });
    },
    retrieveNewThreadPage(req, res) {
        if (req.session.isLoggedIn) {
            res.render("newThread.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req)
            });
        }
        else {
            res.redirect("/user/logIn");
        }
    },
    addNewThread(req, res) {
        if(req.session.userRole === 4)
        {
            messageHandler.setErrorMessage(req, "accountBanned");
    
            res.redirect("/"); 

            return;
        }
        if (req.session.isLoggedIn) {
            thread.addNewThread(req.params.identifier, req.body.threadTitle, req.session.username, req.body.post, (error, threadIdentifier) => {
                if (error) {
                    res.render("newThread.ejs", {
                        language: languages[req.session.language],
                        lastVisitedUrl: req.originalUrl,
                        isLoggedIn: req.session.isLoggedIn,
                        userRole: req.session.userRole,
                        errorMessage: messageHandler.retrieveErrorMessage(req),
                        noticeMessage: messageHandler.retrieveNoticeMessage(req)
                    });
                }
                else {
                    res.redirect("/thread/" + threadIdentifier + "/page/1");
                }
            });
        }
        else {
            res.redirect("/user/login");
        }
    },    
    closeThread(req, res) {
        if (req.session.isLoggedIn) {
            thread.closeThread(req.params.threadIdentifier, (error) => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "closedThread");
                }

                res.redirect("/category/subforum?identifier=" + req.params.identifier);
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    openThread(req, res) {
        if (req.session.isLoggedIn) {
            thread.openThread(req.params.threadIdentifier, (error) => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "openedThread");
                }

                res.redirect("/category/subforum?identifier=" + req.params.identifier);
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    pinThread(req, res) {
        if (req.session.isLoggedIn) {
            thread.pinThread(req.params.threadIdentifier, (error) => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "pinnedThread");
                }

                res.redirect("/category/subforum?identifier=" + req.params.identifier);
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    unpinThread(req, res) {
        if (req.session.isLoggedIn) {
            thread.unpinThread(req.params.threadIdentifier, (error) => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "unpinnedThread");
                }

                res.redirect("/category/subforum?identifier=" + req.params.identifier);
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    deleteThread(req, res) {
        if (req.session.isLoggedIn) {
            thread.deleteThread(req.params.threadIdentifier, (error) => {
                if (!error) {
                    messageHandler.setErrorMessage(req, "justError");
                }
                else {
                    messageHandler.setNoticeMessage(req, "deletedThread");
                }

                res.redirect("/category/subforum?identifier=" + req.params.identifier);
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
}

module.exports = subforumPageController;