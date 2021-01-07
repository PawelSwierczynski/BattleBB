"use strict";

var database = require("../database");

module.exports = {
    getExample(callback) {
        database.query("SELECT 2*2;").then(result => {
            callback(result);
        });
    }
};