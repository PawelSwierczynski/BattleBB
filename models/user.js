"use strict";

var database = require("../database");
var dateFormatter = require("../utilities/dateFormatter");

module.exports = {
    createNewAccount(username, email, hashedPassword, salt, callback) {
        const currentDate = dateFormatter.formatDate(new Date());

        database.query("INSERT INTO Użytkownik(Login, Email, Hasło, Sól, DataUtworzenia, OstatnieLogowanie, IdRanga, IdRola) VALUES (?, ?, ?, ?, ?, ?, 1, 3);", [username, email, hashedPassword, salt, currentDate, currentDate]).then(() => {
            callback();
        }).catch(error => {
            callback(error);
        });
    },
    retrieveSalt(username, callback) {
        database.query("SELECT Sól AS Salt FROM Użytkownik WHERE Login = ?;", [username]).then(salt => {
            callback(salt);
        });
    },
    matchCredentials(username, hashedPassword, callback) {
        database.query("SELECT COUNT(Login) AS MatchedCredentialsCount FROM Użytkownik WHERE Login = ? AND Hasło = ?;", [username, hashedPassword]).then(matchedCredentialsCount => {
            callback(matchedCredentialsCount);
        });
    },
    updateLastLogInDate(username, callback) {
        const currentDate = dateFormatter.formatDate(new Date());

        database.query("UPDATE Użytkownik SET OstatnieLogowanie = ? WHERE Login = ?", [currentDate, username]).then(() => {
            database.query("SELECT IdRola FROM Użytkownik WHERE Login = ?", [username]).then(userRole => {
                callback(userRole);
            });
        });
    }
};