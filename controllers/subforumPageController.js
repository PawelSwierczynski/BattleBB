"use strict";

var languages = require("../languages.json");
var thread = require("../models/thread")

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
                subforumIdentifier: req.query.identifier
            });
        });
    },
    retrieveNewThreadPage(req, res) {
        if (req.session.isLoggedIn) {
            res.render("newThread.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                errorMessage: false,
                userRole: req.session.userRole
            });
        }
        else {
            res.redirect("/user/logIn");
        }
    },
    addNewThread(req, res) {
        if (req.session.isLoggedIn) {
            thread.addNewThread(req.params.identifier, req.body.threadTitle, req.session.username, req.body.post, (error, threadIdentifier) => {
                if (error) {
                    res.render("newThread.ejs", {
                        language: languages[req.session.language],
                        lastVisitedUrl: req.originalUrl,
                        isLoggedIn: req.session.isLoggedIn,
                        errorMessage: languages[req.session.language].unknownError,
                        userRole: req.session.userRole
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
    }
}

module.exports = subforumPageController;