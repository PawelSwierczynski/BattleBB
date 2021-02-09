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
                callback(true);
            });
        }     
        else
        {
            database.query("SELECT IdKategoria FROM Kategoria WHERE Nazwa = ?", [parentCategory]).then(category => {                
                database.query("INSERT INTO Kategoria(Nazwa, DataUtworzenia, IdJęzyk, IdKatNadrzędnej) VALUES (?, ?, ?, ?);", [categoryName, currentDate, IdLanguage, category[0].IdKategoria]).then(() => {
                    callback(true);
                });
            });
            
        }     
    },
    createNewSubforum(subforumName, parentCategory, callback) {
        const currentDate = dateFormatter.formatDate(new Date());
        database.query("SELECT IdKategoria FROM Kategoria WHERE Nazwa = ?", [parentCategory]).then(category => {                
            database.query("INSERT INTO Subforum(Nazwa, DataUtworzenia, IdKategoria) VALUES (?, ?, ?);", [subforumName, currentDate, category[0].IdKategoria]).then(() => {
                callback(true);
            })
        });    
    },
    changeUserRole(username, userRole, callback) {
        var roleId;
        if(userRole === "Użytkownik" || userRole === "User")
        {
            roleId = 3;
        }
        else if(userRole === "Moderator" || userRole === "Moderator")
        {
            roleId = 2;       
        }
        else if(userRole === "Administrator" || userRole === "Administrator")
        {
            roleId = 1;
        }
        else if(userRole === "Zablokowany" || userRole === "Banned")
        {
            roleId = 4;
        }
        database.query("UPDATE Użytkownik SET IdRola = ? WHERE Login = ?", [roleId, username]).then(() => {
            callback(true);
        }).catch(error => {
            callback(false);
        });
    },
    retreiveCategories(callback) {   
        database.query("SELECT * FROM Kategoria").then(categories => {               
            callback(categories);
        });                 
    },
    retreiveSubforums(callback) {   
        database.query("SELECT * FROM Subforum").then(subforums => {               
            callback(subforums);
        });                 
    },
    retreiveUsers(callback) {   
        database.query("SELECT Login FROM Użytkownik").then(users => {               
            callback(users);
        });                 
    },
    removeCategory(categoryName, callback) {   
        database.query("DELETE FROM Kategoria WHERE Nazwa = ?", [categoryName]).then(() => {               
            callback(true);
        });                 
    },
    removeSubforum(subforumName, callback) {   
        database.query("DELETE FROM Subforum WHERE Nazwa = ?", [subforumName]).then(() => {               
            callback(true);
        });                 
    }
};