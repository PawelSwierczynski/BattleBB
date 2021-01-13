"use strict";

var database = require("../database");

function calculateFirstPostIndex(pageNumber, postsPerPageCount) {
    return (pageNumber - 1) * postsPerPageCount + 1;
}

module.exports = {
    getPostsLatestVersions(threadIdentifier, pageNumber, postsPerPageCount, callback) {
        const firstPostIndex = calculateFirstPostIndex(pageNumber, postsPerPageCount);

        database.query("SELECT * FROM (SELECT IdPost AS Identifier, IdWątek AS ThreadIdentifier, IdUżytkownik AS UserIdentifier, NumerPostu AS PostIndex, Version.SubmitDate AS SubmitDate, Version.Content AS Content FROM Post LEFT JOIN (SELECT IdWersja AS VersionIdentifier, IdPost AS PostIdentifier, DataUtworzenia AS SubmitDate, Treść AS Content FROM Wersja AS Version WHERE DataUtworzenia = (SELECT MAX(DataUtworzenia) FROM Wersja WHERE Wersja.IdPost = Version.IdPost)) AS Version ON Post.IdPost = Version.PostIdentifier WHERE Post.IdWątek = " + threadIdentifier + " AND Post.NumerPostu >= " + firstPostIndex + " ORDER By PostIndex LIMIT " + postsPerPageCount + ") AS PostLatestVersion JOIN (SELECT IdUżytkownik AS UserIdentifier, Login, IdRanga AS RankIdentifier, IdRola AS RoleIdentifier FROM Użytkownik) AS User ON PostLatestVersion.UserIdentifier = User.UserIdentifier;").then(postsLatestVersions => {
            callback(postsLatestVersions);
        });
    }
};