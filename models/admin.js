"use strict";

var database = require("../database");
var dateFormatter = require("../utilities/dateFormatter");

module.exports = {
    createNewCategory(categoryName, language, parentCategory, callback) {
        const currentDate = dateFormatter.formatDate(new Date());
        var IdLanguage, IdParentKategory;
        if(language === "Polski" || language === "Polish")
        {
            IdLanguage = 1;
        }
        else
        {
            IdLanguage = 2;
        }
        if(parentCategory === "None" || parentCategory === "Brak")
        {
            database.query("INSERT INTO Kategoria(Nazwa, DataUtworzenia, IdJęzyk) VALUES (?, ?, ?);", [categoryName, currentDate, IdLanguage]).then(() => {
                callback();
            });
        }     
        else
        {
            database.query("SELECT IdKategoria FROM Kategoria WHERE Nazwa = ?", [parentCategory]).then(category => {                
                database.query("INSERT INTO Kategoria(Nazwa, DataUtworzenia, IdJęzyk, IdKatNadrzędnej) VALUES (?, ?, ?, ?);", [categoryName, currentDate, IdLanguage, category[0].IdKategoria]).then(() => {
                    callback();
                });
            });
            
        }     
    },
    retreiveCategories(callback) {   
        database.query("SELECT * FROM Kategoria").then(categories => {               
            callback(categories);
        });                 
    }
};