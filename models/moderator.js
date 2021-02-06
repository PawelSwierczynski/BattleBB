"use strict";

var database = require("../database");
var dateFormatter = require("../utilities/dateFormatter");

module.exports = {    
    changeUserRole(username, userRole, callback) {
        var roleId;
        if(userRole === "Zablokowany" || userRole==="Banned")
        {
            roleId = 4;
        }
        database.query("UPDATE Użytkownik SET IdRola = ? WHERE Login = ?", [roleId, username]).then(() => {
            callback("User blocked");
        }).catch(error => {
            callback(error);
        });
    },
    retreiveUsers(callback) {   
        database.query("SELECT Login FROM Użytkownik").then(users => {               
            callback(users);
        });                 
    },
    retreiveReportedPosts(callback) {   
        database.query("SELECT DISTINCT Post.IdPost, Wersja.Treść, Post.IdUżytkownik FROM Post JOIN Raport ON Post.IdPost = Raport.IdPost JOIN Wersja ON Raport.IdPost = Wersja.IdPost WHERE Wersja.DataUtworzenia = (SELECT MAX(DataUtworzenia) FROM Wersja WHERE Wersja.IdPost = Raport.IdPost)").then(reportedPosts => {               
            callback(reportedPosts);
        });                 
    },
    deletePostAndBanUser(IdPost, IdUser, callback) {   
        database.query("UPDATE Użytkownik SET IdRola = 4 WHERE IdUżytkownik = ?", [IdUser]).then(() => {    
            database.query("DELETE FROM Wersja WHERE IdPost = ?", [IdPost]).then(() => {
                database.query("DELETE FROM Raport WHERE IdPost = ?", [IdPost]).then(() => {                                       
                    database.query("DELETE FROM Post WHERE IdPost = ?", [IdPost]).then(() => {               
                        callback(true);
                    });
                });
            });
        });                 
    },
    deletePost(IdPost, callback) {     
            database.query("DELETE FROM Wersja WHERE IdPost = ?", [IdPost]).then(() => {
                database.query("DELETE FROM Raport WHERE IdPost = ?", [IdPost]).then(() => {                                       
                    database.query("DELETE FROM Post WHERE IdPost = ?", [IdPost]).then(() => {               
                        callback(true);
                    });
                });
            });                 
    },
    deleteReport(IdPost, callback) {   
                database.query("DELETE FROM Raport WHERE IdPost = ?", [IdPost]).then(() => {                                                  
                        callback(true);
                });                
    }
};