"use strict";

var languages = require("../languages.json");
var user = require("../models/user");
var passwordHasher = require("../utilities/passwordHasher");

var userController = {
    createNewUser(req, res) {
        const salt = passwordHasher.generateSalt();
        const hashedPassword = passwordHasher.hashPassword(req.query.password, salt);

        user.createNewAccount(req.query.username, req.query.email, hashedPassword, salt, error => {
            if (error) {
                //TODO display error message
            }
            else {
                //TODO redirect to login page
            }
        });
    }
};

module.exports = userController;