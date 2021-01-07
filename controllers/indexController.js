"use strict";

var database = require("../database.js");

var indexController = {
    renderHomePage(req, res) {
        database.query("SELECT 2*2;").then(exampleQueryResults => console.log(exampleQueryResults));

        res.render("homePage.ejs");
    }
}

module.exports = indexController;