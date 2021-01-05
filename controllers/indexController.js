"use strict";

var indexController = {
    renderHomePage(req, res) {
        res.render("homePage.ejs");
    }
}

module.exports = indexController;