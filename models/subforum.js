"use strict";

var database = require("../database");

var dateFormatter = require("../utilities/dateFormatter");

var subforumsThreads = [];

function formatSubforumsDates(subforums) {
    subforums.forEach(subforum => {
        subforum["DataUtworzenia"] = dateFormatter.formatDate(subforum["DataUtworzenia"])
    });
    return subforums;
}

function getNumberOfThreads(threads, subforums) {
    subforums.forEach(subforum => {
        var help = 0;
        threads.forEach(thread =>{
            if(thread.IdSubforum === subforum.IdSubforum)
            {
                help++;
            }
        });
        subforumsThreads.push({
            IdSubforum: subforum.IdSubforum,
            ThreadCount: help
        });
    });
    return subforumsThreads;    
}



module.exports = {
    getSubforums(parentCategoryIdentifier, callback){
        database.query("SELECT * FROM Subforum Where IdKategoria = "  + parentCategoryIdentifier).then(subforums =>{
            database.query("SELECT Nazwa FROM Kategoria Where IdKategoria = "  + parentCategoryIdentifier).then(parentCategoryName =>{                
                    database.query("SELECT * FROM Wątek as w JOIN Subforum as s ON w.IdSubforum = s.IdSubforum WHERE s.IdKategoria = " + parentCategoryIdentifier).then(threads =>{                 
                        callback(formatSubforumsDates(subforums), parentCategoryName, getNumberOfThreads(threads, subforums));
                    });                        
            });             
        });                 
    }
};