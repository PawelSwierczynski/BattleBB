"use strict";

var languages = require("../languages.json");
var category = require("../models/category");

var homePageController = {
    retrieveHomePage(req, res) {
        category.getMainCategories(mainCategories => {
            var polishCategories = [];
            var englishCategories = [];  

            mainCategories.forEach(mainCategory => {
                if (mainCategory.IdJęzyk == 1)
                {
                    polishCategories.push(mainCategory);
                }
                else if (mainCategory.IdJęzyk == 2)
                {
                    englishCategories.push(mainCategory);
                }
            });
            
            if (req.session.language == "pl")
            {
                res.render("homePage.ejs", { language: languages[req.session.language], mainCategories:polishCategories });
            }
            else if (req.session.language == "en-us")
            {
                res.render("homePage.ejs", { language: languages[req.session.language], mainCategories:englishCategories });
            }
        });
    }
}

module.exports = homePageController;