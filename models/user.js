"use strict";

var database = require("../database");
var dateFormatter = require("../utilities/dateFormatter");

module.exports = {
    registerNewAccount(username, email, hashedPassword, salt, callback) {
        const currentDate = dateFormatter.formatDate(new Date());

        database.query("INSERT INTO Użytkownik(Login, Email, Hasło, Sól, DataUtworzenia, OstatnieLogowanie, IdRanga, IdRola) VALUES (?, ?, ?, ?, ?, ?, 1, 3);", [username, email, hashedPassword, salt, currentDate, currentDate]).then(() => {
            callback(false);
        }).catch(error => {
            callback(error);
        });
    },
    retrieveSalt(username, callback) {
        database.query("SELECT Sól AS Salt FROM Użytkownik WHERE Login = ?;", [username]).then(salt => {
            if (salt[0] != null) {
                callback(false, salt[0].Salt);
            }
            else {
                callback(true, null);
            }
        });
    },
    areMatchingCredentialsFound(username, hashedPassword, callback) {
        database.query("SELECT COUNT(Login) AS MatchedCredentialsCount FROM Użytkownik WHERE Login = ? AND Hasło = ?;", [username, hashedPassword]).then(matchedCredentialsCount => {
            if (matchedCredentialsCount[0].MatchedCredentialsCount == 1) {
                callback(true)
            }
            else {
                callback(false)
            }
        });
    },
    updateLastLogInDate(username, callback) {
        const currentDate = dateFormatter.formatDate(new Date());

        database.query("UPDATE Użytkownik SET OstatnieLogowanie = ? WHERE Login = ?", [currentDate, username]).then(() => {
            database.query("SELECT IdRola FROM Użytkownik WHERE Login = ?", [username]).then(userRole => {
                callback(userRole[0].IdRola);
            });
        });
    },
    retrieveUserProfile(userIdentifier, callback) {
        database.query("SELECT Login AS Username, IdRanga AS RankIdentifier, IdRola AS RoleIdentifier, OstatnieLogowanie AS LastLogInDate FROM Użytkownik WHERE IdUżytkownik = ?;", [userIdentifier]).then(userProfile => {
            if (userProfile[0] != null) {
                callback(false, userProfile[0]);
            }
            else {
                callback(true, null);
            }
        });
    },
    doesUserExist(username, callback) {
        database.query("SELECT IdUżytkownik FROM Użytkownik WHERE Login = ?", [username]).then(userIdentifier => {
            if (userIdentifier[0] != null) {
                callback(true);
            }
            else {
                callback(false);
            }
        });
    },
    changePassword(username, newHashedPassword, newSalt, callback) {
        database.query("UPDATE Użytkownik SET Hasło = ?, Sól = ? WHERE Login = ?", [newHashedPassword, newSalt, username]).then(() => {
            callback();
        });
    }
};