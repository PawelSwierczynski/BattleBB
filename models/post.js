"use strict";

var database = require("../database");

function calculateFirstPostIndex(pageNumber, postsPerPageCount) {
    return (pageNumber - 1) * postsPerPageCount + 1;
}

module.exports = {
    getPostsLatestVersions(threadIdentifier, pageNumber, postsPerPageCount, callback) {
        const firstPostIndex = calculateFirstPostIndex(pageNumber, postsPerPageCount);

        database.query("SELECT * FROM (SELECT IdPost AS Identifier, IdWątek AS ThreadIdentifier, IdUżytkownik AS UserIdentifier, NumerPostu AS PostIndex, Version.SubmitDate AS SubmitDate, Version.Content AS Content FROM Post LEFT JOIN (SELECT IdWersja AS VersionIdentifier, IdPost AS PostIdentifier, DataUtworzenia AS SubmitDate, Treść AS Content FROM Wersja AS Version WHERE DataUtworzenia = (SELECT MAX(DataUtworzenia) FROM Wersja WHERE Wersja.IdPost = Version.IdPost)) AS Version ON Post.IdPost = Version.PostIdentifier WHERE Post.IdWątek = ? AND Post.NumerPostu >= ? ORDER By PostIndex LIMIT ?) AS PostLatestVersion JOIN (SELECT IdUżytkownik AS UserIdentifier, Login, IdRanga AS RankIdentifier, IdRola AS RoleIdentifier FROM Użytkownik) AS User ON PostLatestVersion.UserIdentifier = User.UserIdentifier ORDER by PostIndex;", [threadIdentifier, firstPostIndex, postsPerPageCount]).then(postsLatestVersions => {
            database.query("SELECT IdWątek AS Identifier, Tytuł AS Title, CzyOtwarty AS IsOpen, Post.PostCount FROM Wątek JOIN (SELECT IdWątek as ThreadIdentifier, COUNT(*) AS PostCount FROM Post WHERE IdWątek = ?) AS Post ON Wątek.IdWątek = Post.ThreadIdentifier WHERE IdWątek = ?;", [threadIdentifier, threadIdentifier]).then(thread => {
                if (thread[0] != null) {
                    callback(false, thread[0], postsLatestVersions);
                }
                else {
                    callback(true, null, null);
                }
            });
        });
    },
    addNewPost(threadIdentifier, username, post, callback) {
        database.query("SELECT addNewPost(?, ?, ?) AS postNumber;", [threadIdentifier, username, post]).then(postNumber => {
            callback(false, postNumber[0].postNumber);
        }).catch(error => {
            callback(error, null);
        });
    },
    retrieveAuthorUsername(postIdentifier, callback) {
        database.query("SELECT Użytkownik.Login AS Username FROM Post JOIN Użytkownik ON Post.IdUżytkownik = Użytkownik.IdUżytkownik WHERE Post.IdPost = ?;", [postIdentifier]).then(username => {
            callback(false, username[0].Username);
        }).catch(error => {
            callback(error, null);
        });
    },
    getLatestPostVersion(postIdentifier, callback) {
        database.query("SELECT Treść AS Content FROM Wersja AS Version WHERE IdPost = ? ORDER BY DataUtworzenia DESC LIMIT 1;", [postIdentifier]).then(latestPostVersion => {
            if (latestPostVersion != undefined) {
                callback(false, latestPostVersion[0].Content);
            }
            else {
                callback(true, null);
            }
        });
    },
    addPostNewVersion(content, postIdentifier, callback) {
        database.query("SELECT addPostsNewVersion(?, ?) AS PostNumber;", [content, postIdentifier]).then(postNumber => {
            if (postNumber != undefined) {
                callback(false, postNumber[0].PostNumber);
            }
            else {
                callback(true, null);
            }
        }).catch(error => {
            callback(true, null);
        });
    },
    reportPost(reason, postIdentifier, reportingUserUsername, callback) {
        database.query("SELECT reportPost(?, ?, ?) AS PostNumber;", [reason, postIdentifier, reportingUserUsername]).then(postNumber => {
            if (postNumber != undefined) {
                callback(false, postNumber[0].PostNumber);
            }
            else {
                callback(true, null);
            }
        }).catch(error => {
            callback(true, null);
        });
    }
};