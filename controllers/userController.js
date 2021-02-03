"use strict";

var { body, param, validationResult } = require("express-validator");
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

function validateUsername() {
    return [
        body("username", "usernameMissing").exists(),
        body("username", "usernameTooShort").isLength({ min: 4 }),
        body("username", "usernameTooLong").isLength({ max: 30 }),
        body("username", "usernameInvalidCharacters").matches(/[a-zA-Z0-9\-\_]+/)
    ];
}

function validateEmail() {
    return [
        body("email", "emailMissing").exists(),
        body("email", "emailTooLong").isLength({ max: 60 }),
        body("email", "emailInvalid").isEmail()
    ];
}

function validatePassword() {
    return [
        body("password", "passwordMissing").exists(),
        body("password", "passwordTooShort").isLength({ min: 6 }),
        body("password", "passwordTooLong").isLength({ max: 36 }),
        body("password", "passwordInvalidCharacters").matches(/[a-zA-Z0-9\-\_\!\@\#]+/)
    ];
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
    registerNewUser(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

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

            return;
        }

        const salt = passwordHasher.generateSalt();
        const hashedPassword = passwordHasher.hashPassword(req.body.password, salt);

        user.registerNewAccount(req.body.username, req.body.email, hashedPassword, salt, error => {
            if (error) {
                console.log(error);
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
                messageHandler.setNoticeMessage(req, "registerSuccessful")

                res.redirect("/user/logIn");
            }
        });
    },
    retrieveLogInPage(req, res) {
        res.render("logInPage.ejs", {
            language: languages[req.session.language],
            lastVisitedUrl: req.originalUrl,
            username: req.session.username || "",
            isLoggedIn: req.session.isLoggedIn,
            userRole: req.session.userRole,
            errorMessage: messageHandler.retrieveErrorMessage(req),
            noticeMessage: messageHandler.retrieveNoticeMessage(req)
        });
    },
    logIn(req, res) {
        const username = req.body.username;
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.render("logInPage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                username: username,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req)
            });

            return;
        }

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
                        user.updateLastLogInDate(username, userRole => {
                            req.session.isLoggedIn = true;
                            req.session.username = username;
                            req.session.userRole = userRole;
                            
                            res.redirect("/");
                        });
                    }
                    else {
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
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/");

            return;
        }

        user.retrieveUserProfile(req.params.identifier, (error, userProfile) => {
            if (error) {
                messageHandler.setErrorMessage(req, "userNotFound");

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
    },
    validateRegister() {
        const usernameValidationErrors = validateUsername();
        const emailValidationErrors = validateEmail();
        const passwordValidationErrors = validatePassword();

        return usernameValidationErrors.concat(emailValidationErrors, passwordValidationErrors);
    },
    validateLogIn() {
        const usernameValidationErrors = validateUsername();
        const passwordValidationErrors = validatePassword();

        return usernameValidationErrors.concat(passwordValidationErrors);
    },
    validateUserProfile() {
        return [
            param("identifier", "userIdentifierMissing").exists(),
            param("identifier", "userIdentifierInvalid").isInt({ min: 1 })
        ];
    }
};

module.exports = userController;