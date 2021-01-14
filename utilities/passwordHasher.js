"use strict";

var crypto = require("crypto");

module.exports = {
    hashPassword(password, salt) {
        var hashingAlgorithm = crypto.createHash("sha512");

        return hashingAlgorithm.update(password + salt, "utf-8").digest("hex");
    },
    generateSalt() {
        return crypto.randomBytes(128).toString("base64");
    }
};