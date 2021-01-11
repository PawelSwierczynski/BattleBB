"use strict";

var languages = require("../languages.json");
//To remove
var example = require("../models/example");
var category = require("../models/category");

var homePageController = {
    retrieveHomePage(req, res) {
        /*example.getExample(example => {
            console.log(example);

            res.render("homePage.ejs", { language: languages[req.session.language] });
        });*/

        //res.render("homePage.ejs");
        category.getMainCategories(mainCategories => {
            
            var polishCategories = [];
            var englishCategories = [];            
            mainCategories.forEach(mainCategory => {
                category.getChildCategories(mainCategory.IdKategoria, childCategories => {
                    mainCategory.KategoriePodrzedne = childCategories;
                });
                if(mainCategory.IdJęzyk == 1)
                {
                    polishCategories.push(mainCategory);
                }
                else if(mainCategory.IdJęzyk == 2)
                {
                    englishCategories.push(mainCategory);
                }
            });
            console.log(mainCategories);
            if(req.session.language == "pl")
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