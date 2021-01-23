"use strict";

var languages = require("../languages.json");
var user = require("../models/user");
var passwordHasher = require("../utilities/passwordHasher");
var dateFormatter = require("../utilities/dateFormatter");

function retrieveErrorMessage(sqlMessageError, language) {
    if (sqlMessageError.includes("UniqueUsername")) {
        return language.duplicateUsername;
    }
    else if (sqlMessageError.includes("UniqueEmail")) {
        return language.duplicateEmail;
    }
    else {
        return language.unknownError;
    }
}

var userController = {
    retrieveRegisterPage(req, res) {
        res.render("registerPage.ejs", {
            language: languages[req.session.language],
            lastVisitedUrl: req.originalUrl,
            errorMessage: false,
            isLoggedIn: req.session.isLoggedIn,
            userRole: req.session.userRole
        });
    },
    createNewUser(req, res) {
        const salt = passwordHasher.generateSalt();
        const hashedPassword = passwordHasher.hashPassword(req.body.password, salt);

        user.createNewAccount(req.body.username, req.body.email, hashedPassword, salt, error => {
            if (error) {
                const errorMessage = retrieveErrorMessage(error.sqlMessage, languages[req.session.language]);

                res.render("registerPage.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    username: req.body.username,
                    email: req.body.email,
                    errorMessage: errorMessage,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole
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
            errorMessage: false,
            isLoggedIn: req.session.isLoggedIn,
            userRole: req.session.userRole
        });
    },
    logIn(req, res) {
        const username = req.body.username;

        user.retrieveSalt(username, salt => {
            if (typeof(salt) === "undefined") {
                res.render("logInPage.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    username: username,
                    errorMessage: languages[req.session.language].usernameNotFound,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole
                });
            }
            else {
                const hashedPassword = passwordHasher.hashPassword(req.body.password, salt[0].Salt);

                user.matchCredentials(username, hashedPassword, matchedCredentialsCount => {
                    if (matchedCredentialsCount[0].MatchedCredentialsCount == 0) {
                        res.render("logInPage.ejs", {
                            language: languages[req.session.language],
                            lastVisitedUrl: req.originalUrl,
                            username: username,
                            errorMessage: languages[req.session.language].incorrectPassword,
                            isLoggedIn: req.session.isLoggedIn,
                            userRole: req.session.userRole
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
                    userProfile: userProfile
                });
            }
        });
    }
};

module.exports = userController;