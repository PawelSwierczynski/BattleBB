"use strict";

var express = require("express");
var path = require("path");
var expressSession = require("express-session");
var database = require("./database");

var homePageRoutes = require("./routes/homePageRoutes")

var server = express();

var mySqlSessionStorage = database.getMySqlSessionStorage();

server.use(expressSession({
    key: "BattleBB cookie",
    secret: "GdyMGSieUsmiechaToJestJuzZaPozno",
    store: mySqlSessionStorage,
    resave: false,
    saveUninitialized: false
}));

server.set("view engine", "ejs");
server.set("views", path.resolve(__dirname, "views"));

server.use(function(req, res, next) {
    if (req.session.language === undefined) {
        req.session.language = "pl";
    }

    if (req.query.language == "pl") {
        req.session.language = "pl";
    }
    else if (req.query.language == "en-us") {
        req.session.language = "en-us";
    }

    next();
});

server.use("/", homePageRoutes);

server.listen(3000, function() {
    console.log("Server started listening at port 3000.");
});