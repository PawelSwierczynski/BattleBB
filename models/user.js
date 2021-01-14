"use strict";

var database = require("../database");
var dateFormatter = require("../utilities/dateFormatter");

module.exports = {
    createNewAccount(username, email, hashedPassword, salt, callback) {
        const currentDate = dateFormatter.formatDate(new Date());

        database.query("INSERT INTO Użytkownik(Login, Email, Hasło, Sól, DataUtworzenia, OstatnieLogowanie, IdRanga, IdRola) VALUES (\"" + username + "\", \"" + email + "\", \"" + hashedPassword + "\", \"" + salt + "\", \"" + currentDate + "\", \"" + currentDate + "\", 1, 3);").then(() => {
            callback();
        }).catch((error) => {
            callback(error);
        });
    }
};