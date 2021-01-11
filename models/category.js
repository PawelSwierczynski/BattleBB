"use strict";

var database = require("../database");

module.exports = {
    getMainCategories(callback){
        database.query("SELECT * FROM Kategoria WHERE IdKatNadrzędnej is NULL").then(mainCategories =>{
            callback(mainCategories);
        });                 
    },
    getChildCategories(parentCategoryId, callback){
        database.query("SELECT * FROM Kategoria WHERE IdKatNadrzędnej = " + parentCategoryId).then(childCategories =>{
            callback(childCategories);
        });
    }
};