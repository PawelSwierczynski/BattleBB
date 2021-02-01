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
    }
};