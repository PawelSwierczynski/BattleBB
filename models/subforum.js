"use strict";

var database = require("../database");

var dateFormatter = require("../utilities/dateFormatter");

function formatSubforumsDates(subforums) {
    subforums.forEach(subforum => {
        subforum["DataUtworzenia"] = dateFormatter.formatDate(subforum["DataUtworzenia"])
    });
    return subforums;
}


module.exports = {
    getSubforums(parentCategoryIdentifier, callback){
        database.query("SELECT * FROM Subforum Where IdKategoria = "  + parentCategoryIdentifier).then(subforums =>{
            database.query("SELECT Nazwa FROM Kategoria Where IdKategoria = "  + parentCategoryIdentifier).then(parentCategoryName =>{
                callback(formatSubforumsDates(subforums), parentCategoryName);
            }); 
            
        });                 
    }
};