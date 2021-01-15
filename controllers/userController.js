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
            errorMessage: false
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
                    errorMessage: errorMessage
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
            errorMessage: false
        });
    }
};

module.exports = userController;