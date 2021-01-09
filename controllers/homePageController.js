"use strict";

var languages = require("../languages.json");
//To remove
var example = require("../models/example");

var homePageController = {
    retrieveHomePage(req, res) {
        example.getExample(example => {
            console.log(example);

            res.render("homePage.ejs", { language: languages[req.session.language] });
        });

        //res.render("homePage.ejs");
    }
}

module.exports = homePageController;