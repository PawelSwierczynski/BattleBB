"use strict";
//To remove
var example = require("../models/example");

var indexController = {
    renderHomePage(req, res) {
        example.getExample(example => {
            console.log(example);
        });

        res.render("homePage.ejs");
    }
}

module.exports = indexController;