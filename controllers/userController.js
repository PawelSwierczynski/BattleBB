"use strict";

var languages = require("../languages.json");
var user = require("../models/user");
var passwordHasher = require("../utilities/passwordHasher");
var dateFormatter = require("../utilities/dateFormatter");
var messageHandler = require("../utilities/messageHandler");

function parseErrorMessage(sqlMessageError) {
    if (sqlMessageError.includes("UniqueUsername")) {
        return "duplicateUsername";
    }
    else if (sqlMessageError.includes("UniqueEmail")) {
        return "duplicateEmail";
    }
    else {
        return "unknownError";
    }
}

var userController = {
    retrieveRegisterPage(req, res) {
        res.render("registerPage.ejs", {
            language: languages[req.session.language],
            lastVisitedUrl: req.originalUrl,
            isLoggedIn: req.session.isLoggedIn,
            userRole: req.session.userRole,
            errorMessage: messageHandler.retrieveErrorMessage(req),
            noticeMessage: messageHandler.retrieveNoticeMessage(req)
        });
    },
    createNewUser(req, res) {
        const salt = passwordHasher.generateSalt();
        const hashedPassword = passwordHasher.hashPassword(req.body.password, salt);

        user.createNewAccount(req.body.username, req.body.email, hashedPassword, salt, error => {
            if (error) {
                const errorMessage = parseErrorMessage(error.sqlMessage, languages[req.session.language]);
                messageHandler.setErrorMessage(req, errorMessage);

                res.render("registerPage.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    username: req.body.username,
                    email: req.body.email,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole,
                    errorMessage: messageHandler.retrieveErrorMessage(req),
                    noticeMessage: messageHandler.retrieveNoticeMessage(req)
                });
            }
            else {
                res.redirect("/user/logIn");
            }
        });
    },
    retrieveLogInPage(req, res) {
        res.render("logInPage.ejs", {
            language: languages[req.session.language],
            lastVisitedUrl: req.originalUrl,
            isLoggedIn: req.session.isLoggedIn,
            userRole: req.session.userRole,
            errorMessage: messageHandler.retrieveErrorMessage(req),
            noticeMessage: messageHandler.retrieveNoticeMessage(req)
        });
    },
    logIn(req, res) {
        const username = req.body.username;

        user.retrieveSalt(username, (error, salt) => {
            if (error) {
                messageHandler.setErrorMessage(req, "usernameNotFound");

                res.render("logInPage.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    username: username,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole,
                    errorMessage: messageHandler.retrieveErrorMessage(req),
                    noticeMessage: messageHandler.retrieveNoticeMessage(req)
                });
            }
            else {
                const hashedPassword = passwordHasher.hashPassword(req.body.password, salt);

                user.areMatchingCredentialsFound(username, hashedPassword, areMatchingCredentialsFound => {
                    if (areMatchingCredentialsFound) {
                        messageHandler.setErrorMessage(req, "incorrectPassword");

                        res.render("logInPage.ejs", {
                            language: languages[req.session.language],
                            lastVisitedUrl: req.originalUrl,
                            username: username,
                            isLoggedIn: req.session.isLoggedIn,
                            userRole: req.session.userRole,
                            errorMessage: messageHandler.retrieveErrorMessage(req),
                            noticeMessage: messageHandler.retrieveNoticeMessage(req)
                        });
                    }
                    else {
                        user.updateLastLogInDate(username, userRole => {
                            req.session.isLoggedIn = true;
                            req.session.username = username;
                            req.session.userRole = userRole;
                            
                            res.redirect("/");
                        });
                    }
                });
            }
        });
    },
    logOut(req, res) {
        req.session.isLoggedIn = false;
        req.session.userRole = null;
        req.session.username = null;

        res.redirect("/");
    },
    retrieveUserProfile(req, res) {
        user.retrieveUserProfile(req.params.identifier, (error, userProfile) => {
            if (error) {
                res.redirect("/");
            }
            else {
                userProfile.LastLogInDate = dateFormatter.formatDate(userProfile.LastLogInDate);

                res.render("userProfile.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole,
                    userProfile: userProfile,
                    errorMessage: messageHandler.retrieveErrorMessage(req),
                    noticeMessage: messageHandler.retrieveNoticeMessage(req)
                });
            }
        });
    }
};

module.exports = userController;