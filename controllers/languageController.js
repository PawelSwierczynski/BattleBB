"use strict";

function parseUrlToRedirectToPolish(originalUrl) {
    return originalUrl.substr(15);
}

function parseUrlToRedirectToAmericanEnglish(originalUrl) {
    return originalUrl.substr(18);
}

var languageController = {
    setLanguageToPolish(req, res) {
        req.session.language = req.session.language = "pl";

        const urlToRedirect = parseUrlToRedirectToPolish(req.originalUrl);

        res.redirect(urlToRedirect);
    },
    setLanguageToAmericanEnglish(req, res) {
        req.session.language = req.session.language = "en-us";

        const urlToRedirect = parseUrlToRedirectToAmericanEnglish(req.originalUrl);

        res.redirect(urlToRedirect);
    }
}

module.exports = languageController;