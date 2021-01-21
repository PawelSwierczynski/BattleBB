"use strict";

var languages = require("../languages.json");
var user = require("../models/user");
var passwordHasher = require("../utilities/passwordHasher");

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
            isLoggedIn: req.session.isLoggedIn
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
                    isLoggedIn: req.session.isLoggedIn
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
            isLoggedIn: req.session.isLoggedIn
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
                    isAdmin: req.session.isAdmin
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
                            isLoggedIn: req.session.isLoggedIn
                        });
                    }
                    else {
                        user.updateLastLogInDate(username, bool => {
                            req.session.isLoggedIn = true;
                            req.session.username = username;
                            req.session.isAdmin = bool;
                            
                            res.redirect("/");
                        });
                    }
                });
            }
        });
    },
    logOut(req, res) {
        req.session.isLoggedIn = false;
        req.session.isAdmin = false;
        req.session.username = null;

        res.redirect("/");
    }
};

module.exports = userController;