"use strict";

var { body, validationResult } = require("express-validator");
var languages = require("../languages.json");
var messageHandler = require("../utilities/messageHandler");
var roll = require("../models/roll");

function rollDice(numberOfDice, numberOfSides) {
    var rollResult = 0;

    for (var i = 0; i < numberOfDice; i++) {
        rollResult += (Math.floor(Math.random() * (numberOfSides)) + 1);
    }

    return rollResult;
}

function applyModifier(rollResult, modifier) {
    return rollResult + parseInt(modifier);
}

function combineFormula(numberOfDice, numberOfSides, modifier) {
    return "" + numberOfDice + "d" + numberOfSides + modifier;
}

var rollController = {
    retrieveNewRollPage(req, res) {
        if (req.session.isLoggedIn) {
            if (req.session.postIdentifierWithRoll != null) {
                res.render("newRoll.ejs", {
                    language: languages[req.session.language],
                    lastVisitedUrl: req.originalUrl,
                    isLoggedIn: req.session.isLoggedIn,
                    userRole: req.session.userRole,
                    errorMessage: messageHandler.retrieveErrorMessage(req),
                    noticeMessage: messageHandler.retrieveNoticeMessage(req)
                });
            }
            else {
                messageHandler.setErrorMessage(req, "noAwaitingDiceRolls");

                res.redirect("/");
            }
        }
        else {
            messageHandler.setErrorMessage(req, "logInRequired");

            res.redirect("/user/logIn");
        }
    },
    addNewRoll(req, res) {
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            messageHandler.setErrorMessage(req, validationErrors.errors[0].msg);

            res.redirect("/roll/newRoll");

            return;
        }

        var rollResult = rollDice(req.body.numberOfDice, req.body.numberOfSides);

        if (req.body.modifier.length > 0) {
            rollResult = applyModifier(rollResult, req.body.modifier);
        }

        const formula = combineFormula(req.body.numberOfDice, req.body.numberOfSides, req.body.modifier);

        roll.addNewRoll(formula, rollResult, req.body.rollDescription, req.session.postIdentifierWithRoll, error => {
            if (error) {
                messageHandler.setErrorMessage(req, "unknownError");

                res.redirect("/");
            }
            else {
                messageHandler.setNoticeMessage(req, "rollAdded");

                res.redirect("/roll/newRoll");
            }
        });
    },
    validateNewRoll() {
        return [
            body("rollDescription", "rollDescriptionMissing").exists(),
            body("rollDescription", "rollDescriptionEmpty").isString().isLength({ min: 1 }),
            body("rollDescription", "rollDescriptionTooLong").isString().isLength({ max: 60 }),
            body("numberOfDice", "numberOfDiceMissing").exists(),
            body("numberOfDice", "numberOfDiceInvalid").isInt({ min: 1, max: 999 }),
            body("numberOfSides", "numberOfSidesMissing").exists(),
            body("numberOfSides", "numberOfSidesInvalid").isInt({ min: 2, max: 9999 }),
            body("modifier", "modifierInvalid").exists().matches(/(^$)|(^(\+|\-)[0-9]{1,4}$)/)
        ];
    },
    stopRolling(req, res) {
        req.session.isUserWillingToRollDice = false;
        req.session.postIdentifierWithRoll = null;
        var redirectAddress = req.session.postWithRollsAddress;

        req.session.postWithRollsAddress = null;

        res.redirect(redirectAddress);
    }
}

module.exports = rollController;