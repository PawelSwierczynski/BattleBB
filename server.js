"use strict";

var express = require("express");
var path = require("path");
var expressSession = require("express-session");
var bodyParser = require("body-parser");

var database = require("./database");

var homePageRoutes = require("./routes/homePageRoutes");
var languageRoutes = require("./routes/languageRoutes");
var categoryPageRoutes = require("./routes/categoryPageRoutes");
var subforumPageRoutes = require("./routes/subforumPageRoutes");
var threadRoutes = require("./routes/threadRoutes");
var userRoutes = require("./routes/userRoutes");

var server = express();

server.use(express.static("public"));
server.use(bodyParser.urlencoded({ extended: false }));

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

    next();
});

server.use("/", homePageRoutes);
server.use("/", languageRoutes);
server.use("/category", categoryPageRoutes);
server.use("/category/subforum", subforumPageRoutes);
server.use("/thread", threadRoutes);
server.use("/user", userRoutes);

server.listen(3000, function() {
    console.log("Server started listening at port 3000.");
});