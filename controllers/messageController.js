"use strict";

const e = require("express");
var { body, param, query, validationResult } = require("express-validator");
var languages = require("../languages.json");
var message = require("../models/message");
var user = require("../models/user");
var dateFormatter = require("../utilities/dateFormatter");
var messageHandler = require("../utilities/messageHandler");

var messageController = {
    retrieveReceivedMessages(req, res) {
        if (req.session.isLoggedIn) {
            message.retrieveReceivedMessages(req.session.username, receivedMessages => {
                if (receivedMessages.length === 0) {
                    messageHandler.setNoticeMessage(req, "noReceivedMessages");

                    res.render("receivedMessages.ejs", {
                        language: languages[req.session.language],
                        lastVisitedUrl: req.originalUrl,
                        isLoggedIn: req.session.isLoggedIn,
                        userRole: req.session.userRole,
                        errorMessage: messageHandler.retrieveErrorMessage(req),
                        noticeMessage: messageHandler.retrieveNoticeMessage(req),
                        receivedMessages: null
                    });
                }
                else {
                    receivedMessages.forEach(receivedMessage => {
                        receivedMessage.SentDate = dateFormatter.formatDate(receivedMessage.SentDate);
                        receivedMessage.IsRead = (receivedMessage.IsRead === 1);
                    });

                    res.render("receivedMessages.ejs", {
                        language: languages[req.session.language],
                        lastVisitedUrl: req.originalUrl,
                        isLoggedIn: req.session.isLoggedIn,
                        userRole: req.session.userRole,
                        errorMessage: messageHandler.retrieveErrorMessage(req),
                        noticeMessage: messageHandler.retrieveNoticeMessage(req),
                        receivedMessages: receivedMessages
                    });
                }
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    retrieveSentMessages(req, res) {
        if (req.session.isLoggedIn) {
            message.retrieveSentMessages(req.session.username, sentMessages => {
                if (sentMessages.length === 0) {
                    messageHandler.setNoticeMessage(req, "noSentMessages");

                    res.render("sentMessages.ejs", {
                        language: languages[req.session.language],
                        lastVisitedUrl: req.originalUrl,
                        isLoggedIn: req.session.isLoggedIn,
                        userRole: req.session.userRole,
                        errorMessage: messageHandler.retrieveErrorMessage(req),
                        noticeMessage: messageHandler.retrieveNoticeMessage(req),
                        sentMessages: null
                    });
                }
                else {
                    sentMessages.forEach(sentMessage => {
                        sentMessage.SentDate = dateFormatter.formatDate(sentMessage.SentDate);
                    });

                    res.render("sentMessages.ejs", {
                        language: languages[req.session.language],
                        lastVisitedUrl: req.originalUrl,
                        isLoggedIn: req.session.isLoggedIn,
                        userRole: req.session.userRole,
                        errorMessage: messageHandler.retrieveErrorMessage(req),
                        noticeMessage: messageHandler.retrieveNoticeMessage(req),
                        sentMessages: sentMessages
                    });
                }
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    retrieveNewMessagePage(req, res) {
        if (req.session.isLoggedIn) {
            const validationErrors = validationResult(req);

            if (!validationErrors.isEmpty()) {
                messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);
            }

            res.render("newMessage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req),
                recipientUsername: req.query.recipientUsername,
                subject: req.query.subject,
                message: null
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    validateRetrieveNewMessage() {
        return [
            query("recipientUsername", "recipientUsernameTooShort").optional().isString().isLength({ min: 3 }),
            query("recipientUsername", "recipientUsernameTooLong").optional().isString().isLength({ max: 30 }),
            query("recipientUsername", "recipientUsernameInvalidCharacters").optional().matches(/^[a-zA-Z0-9\-\_]+$/),
            query("subject", "subjectEmpty").optional().isString().isLength({ min: 1 }),
            query("subject", "subjectTooLong").optional().isString().isLength({ max: 60 }),
        ];
    },
    sendMessage(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.render("newMessage.ejs", {
                language: languages[req.session.language],
                lastVisitedUrl: req.originalUrl,
                isLoggedIn: req.session.isLoggedIn,
                userRole: req.session.userRole,
                errorMessage: messageHandler.retrieveErrorMessage(req),
                noticeMessage: messageHandler.retrieveNoticeMessage(req),
                recipientUsername: req.body.recipientUsername,
                subject: req.body.subject,
                message: req.body.message
            });

            return;
        }
        if(req.session.userRole === 4)
        {
            messageHandler.setErrorMessage(req, "accountBanned");
    
            res.redirect("/"); 

            return;
        }
        if (req.session.isLoggedIn) {
            user.doesUserExist(req.body.recipientUsername, doesRecipientExist => {
                if (doesRecipientExist) {
                    message.sendMessage(req.session.username, req.body.recipientUsername, req.body.subject, req.body.message, error => {
                        if (error) {
                            messageHandler.setErrorMessage(req, "unknownError");
        
                            res.render("newMessage.ejs", {
                                language: languages[req.session.language],
                                lastVisitedUrl: req.originalUrl,
                                isLoggedIn: req.session.isLoggedIn,
                                userRole: req.session.userRole,
                                errorMessage: messageHandler.retrieveErrorMessage(req),
                                noticeMessage: messageHandler.retrieveNoticeMessage(req),
                                recipientUsername: req.body.recipientUsername,
                                subject: req.body.subject,
                                message: req.body.message
                            });
                        }
                        else {
                            messageHandler.setNoticeMessage(req, "messageSent");
        
                            res.redirect("/message/sent");
                        }
                    });
                }
                else {
                    messageHandler.setErrorMessage(req, "noUserFound");
        
                    res.render("newMessage.ejs", {
                        language: languages[req.session.language],
                        lastVisitedUrl: req.originalUrl,
                        isLoggedIn: req.session.isLoggedIn,
                        userRole: req.session.userRole,
                        errorMessage: messageHandler.retrieveErrorMessage(req),
                        noticeMessage: messageHandler.retrieveNoticeMessage(req),
                        recipientUsername: req.body.recipientUsername,
                        subject: req.body.subject,
                        message: req.body.message
                    });
                }
            });
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    validateNewMessage() {
        return [
            body("recipientUsername", "recipientUsernameMissing").exists(),
            body("recipientUsername", "recipientUsernameTooShort").isString().isLength({ min: 3 }),
            body("recipientUsername", "recipientUsernameTooLong").isString().isLength({ max: 30 }),
            body("recipientUsername", "recipientUsernameInvalidCharacters").matches(/^[a-zA-Z0-9\-\_]+$/),
            body("subject", "subjectMissing").exists(),
            body("subject", "subjectEmpty").isString().isLength({ min: 1 }),
            body("subject", "subjectTooLong").isString().isLength({ max: 60 }),
            body("message", "messageMissing").exists(),
            body("message", "messageEmpty").isString().isLength({ min: 1 }),
            body("message", "messageTooLong").isString().isLength({ max: 1000 })
        ];
    },
    retrieveMessage(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/");

            return;
        }
        
        message.isUserAllowedToReadMessage(req.session.username, req.params.messageIdentifier, (isUserSender, isUserRecipient) => {
            if (isUserSender || isUserRecipient) {
                message.retrieveMessage(req.params.messageIdentifier, (error, retrievedMessage) => {
                    if (error) {
                        messageHandler.setErrorMessage(req, "unknownError");

                        res.redirect("/");
                    }
                    else {
                        retrievedMessage.SentDate = dateFormatter.formatDate(retrievedMessage.SentDate);

                        if (isUserRecipient) {
                            message.markMessageAsRead(req.params.messageIdentifier, () => {
                                res.render("message.ejs", {
                                    language: languages[req.session.language],
                                    lastVisitedUrl: req.originalUrl,
                                    isLoggedIn: req.session.isLoggedIn,
                                    userRole: req.session.userRole,
                                    errorMessage: messageHandler.retrieveErrorMessage(req),
                                    noticeMessage: messageHandler.retrieveNoticeMessage(req),
                                    isSender: false,
                                    recipientUsername: retrievedMessage.RecipientUsername,
                                    senderUsername: retrievedMessage.SenderUsername,
                                    message: retrievedMessage
                                });
                            });
                        }
                        else {
                            res.render("message.ejs", {
                                language: languages[req.session.language],
                                lastVisitedUrl: req.originalUrl,
                                isLoggedIn: req.session.isLoggedIn,
                                userRole: req.session.userRole,
                                errorMessage: messageHandler.retrieveErrorMessage(req),
                                noticeMessage: messageHandler.retrieveNoticeMessage(req),
                                isSender: true,
                                recipientUsername: retrievedMessage.RecipientUsername,
                                senderUsername: retrievedMessage.SenderUsername,
                                message: retrievedMessage
                            });
                        }
                    }
                });
            }
            else {
                messageHandler.setErrorMessage(req, "messageAccessDenied");

                res.redirect("/");
            }
        });
    },
    validateRead() {
        return [
            param("messageIdentifier", "messageIdentifierMissing").exists(),
            param("messageIdentifier", "messageIdentifierInvalid").isInt({ min: 1 })
        ];
    }
}

module.exports = messageController;