"use strict";

var database = require("../database");

module.exports = {
    getMainCategories(callback){
        database.query("SELECT * FROM Kategoria as K1 LEFT JOIN Kategoria as K2 ON K1.IdKategoria = K2.IdKatNadrzędnej WHERE K1.IdKatNadrzędnej IS NULL;").then(mainCategories =>{
            callback(mainCategories);
        });                 
    },
    getChildCategories(parentCategoryId, callback){
        database.query("SELECT * FROM Kategoria WHERE IdKatNadrzędnej = " + parentCategoryId).then(childCategories =>{
            callback(childCategories);
        });
    }
};