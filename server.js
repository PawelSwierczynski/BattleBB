"use strict";

var express = require("express");
var path = require("path");

var indexRoutes = require("./routes/indexRoutes")

var server = express();

server.set("view engine", "ejs");
server.set("views", path.resolve(__dirname, "views"));

server.use("/", indexRoutes);

server.listen(3000, function() {
    console.log("Server started listening at port 3000.");
});