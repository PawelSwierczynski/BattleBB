"use strict";

var database = require("../database");
var dateFormatter = require("../utilities/dateFormatter");

module.exports = {
    createNewCategory(categoryName, language, parentCategory, callback) {
        const currentDate = dateFormatter.formatDate(new Date());
        var IdLanguage, IdParentKategory;
        if (language === "Polski" || language === "Polish")
        {
            IdLanguage = 1;
        }
        else
        {
            IdLanguage = 2;
        }
        if (parentCategory === "None" || parentCategory === "Brak")
        {
            database.query("INSERT INTO Kategoria(Nazwa, DataUtworzenia, IdJęzyk) VALUES (?, ?, ?);", [categoryName, currentDate, IdLanguage]).then(() => {
                callback("Created new category");
            });
        }     
        else
        {
            database.query("SELECT IdKategoria FROM Kategoria WHERE Nazwa = ?", [parentCategory]).then(category => {                
                database.query("INSERT INTO Kategoria(Nazwa, DataUtworzenia, IdJęzyk, IdKatNadrzędnej) VALUES (?, ?, ?, ?);", [categoryName, currentDate, IdLanguage, category[0].IdKategoria]).then(() => {
                    callback("Created new category");
                });
            });
            
        }     
    },
    createNewSubforum(subforumName, parentCategory, callback) {
        const currentDate = dateFormatter.formatDate(new Date());
        database.query("SELECT IdKategoria FROM Kategoria WHERE Nazwa = ?", [parentCategory]).then(category => {                
            database.query("INSERT INTO Subforum(Nazwa, DataUtworzenia, IdKategoria) VALUES (?, ?, ?);", [subforumName, currentDate, category[0].IdKategoria]).then(() => {
                callback("Created new subforum");
            })
        });    
    },
    changeUserRole(username, userRole, callback) {
        var roleId;
        if(userRole === "Użytkownik")
        {
            roleId = 3;
        }
        else if(userRole === "Moderator")
        {
            roleId = 2;       
        }
        else if(userRole === "Administrator")
        {
            roleId = 1;
        }
        else if(userRole === "Zablokowany")
        {
            roleId = 4;
        }
        database.query("UPDATE Użytkownik SET IdRola = ? WHERE Login = ?", [roleId, username]).then(() => {
            callback("Changed user role");
        }).catch(error => {
            callback(error);
        });
    },
    retreiveCategories(callback) {   
        database.query("SELECT * FROM Kategoria").then(categories => {               
            callback(categories);
        });                 
    },
    retreiveUsers(callback) {   
        database.query("SELECT Login FROM Użytkownik").then(users => {               
            callback(users);
        });                 
    }
};