"use strict";

var database = require("../database");

module.exports = {
    addNewRoll(formula, result, description, postIdentifier, callback) {
        database.query("INSERT INTO Rzut (FormułaRzutu, Wynik, Opis, IdPost) VALUES (?, ?, ?, ?);", [formula, result, description, postIdentifier]).then(() => {
            callback(false);
        }).catch(error => {
            callback(error);
        });
    },
    retrievePostsRolls(post) {
        return database.query("SELECT FormułaRzutu AS Formula, Wynik AS Result, Opis AS Description FROM Rzut WHERE IdPost = ?", [post.Identifier]);
    }
};