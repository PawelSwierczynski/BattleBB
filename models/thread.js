"use strict";

var database = require("../database");

var dateFormatter = require("../utilities/dateFormatter");

var threadPosts = [];

function formatSubforumsDates(subforums) {
    subforums.forEach(subforum => {
        subforum["DataUtworzenia"] = dateFormatter.formatDate(subforum["DataUtworzenia"])
    });
    return subforums;
}

function getNumberOfPosts(posts, threads) {
    threads.forEach(thread => {
        var help = 0;
        posts.forEach(post =>{
            if(post.IdWątek === thread.IdWątek)
            {
                help++;
            }
        });
        threadPosts.push({
            IdWątek: thread.IdWątek,
            PostCount: help
        });
    });
    return threadPosts;    
}

module.exports = {
    getThreads(parentSubforumIdentifier, callback) {
        database.query("SELECT * FROM Wątek Where IdSubforum = ?;", [parentSubforumIdentifier]).then(threads => {
            database.query("SELECT Nazwa FROM Subforum Where IdSubforum = ?;", [parentSubforumIdentifier]).then(parentSubforumName => {                
                database.query("SELECT * FROM Post as p JOIN Wątek as w ON w.IdWątek = p.IdWątek WHERE w.IdSubforum = ?;", [parentSubforumIdentifier]).then(posts => {                 
                    callback(formatSubforumsDates(threads), parentSubforumName, getNumberOfPosts(posts, threads));
                });                        
            });             
        });                 
    },
    addNewThread(subforumIdentifier, threadTitle, username, post, callback) {
        database.query("SELECT addNewThread(?, ?, ?, ?) AS threadIdentifier;", [subforumIdentifier, threadTitle, username, post]).then(threadIdentifier => {
            callback(false, threadIdentifier[0].threadIdentifier);
        }).catch(error => {
            callback(error, null);
        });
    },
    findThreadsMatchingPhase(phrase, callback) {
        database.query("SELECT Identifier, Title, SubmitDate, PostCount FROM (SELECT IdWątek AS Identifier, Tytuł AS Title, DataUtworzenia AS SubmitDate FROM (SELECT Identifier FROM (SELECT LOWER(Tytuł) AS Title, IdWątek AS Identifier FROM Wątek) AS Thread WHERE Title LIKE ?) AS MatchedThread JOIN Wątek AS Thread ON MatchedThread.Identifier = Thread.IdWątek) AS MatchedThread JOIN (SELECT Count(IdPost) AS PostCount, IdWątek AS ThreadIdentifier FROM Post GROUP BY IdWątek) AS PostCount ON MatchedThread.Identifier = PostCount.ThreadIdentifier;", ["%" + phrase + "%"]).then(matchedThreads => {
            if (matchedThreads[0] != null) {
                callback(false, matchedThreads);
            }
            else {
                callback(true, null);
            }
        });
    },
    closeThread(threadIdentifier, callback) {
        database.query("UPDATE Wątek SET CzyOtwarty = 0 WHERE IdWątek = ?", [threadIdentifier]).then(() => {
            
            callback(true);
            
        });
    },
    openThread(threadIdentifier, callback) {
        database.query("UPDATE Wątek SET CzyOtwarty = 1 WHERE IdWątek = ?", [threadIdentifier]).then(() => {
            
            callback(true);
            
        });
    },
    pinThread(threadIdentifier, callback) {
        database.query("UPDATE Wątek SET CzyPrzypięty = 1 WHERE IdWątek = ?", [threadIdentifier]).then(() => {
            
            callback(true);
            
        });
    },
    unpinThread(threadIdentifier, callback) {
        database.query("UPDATE Wątek SET CzyPrzypięty = 0 WHERE IdWątek = ?", [threadIdentifier]).then(() => {
            
            callback(true);
            
        });
    }
};