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
    getThreads(parentSubforumIdentifier, callback){
        database.query("SELECT * FROM Wątek Where IdSubforum = ?;", [parentSubforumIdentifier]).then(threads => {
            database.query("SELECT Nazwa FROM Subforum Where IdSubforum = ?;", [parentSubforumIdentifier]).then(parentSubforumName => {                
                    database.query("SELECT * FROM Post as p JOIN Wątek as w ON w.IdWątek = p.IdWątek WHERE w.IdSubforum = ?;", [parentSubforumIdentifier]).then(posts => {                 
                        callback(formatSubforumsDates(threads), parentSubforumName, getNumberOfPosts(posts, threads));
                    });                        
            });             
        });                 
    }
};