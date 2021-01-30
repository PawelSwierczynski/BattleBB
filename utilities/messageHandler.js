"use strict";

module.exports = {
    retrieveErrorMessage(req) {
        const errorMessage = req.session.errorMessage;
        
        if (errorMessage != null) {
            req.session.errorMessage = null;
        }

        return errorMessage;
    },
    retrieveNoticeMessage(req) {
        const noticeMessage = req.session.noticeMessage;

        if (noticeMessage != null) {
            req.session.noticeMessage = null;
        }

        return noticeMessage;
    },
    setErrorMessage(req, errorMessage) {
        req.session.errorMessage = errorMessage;
    },
    setNoticeMessage(req, noticeMessage) {
        req.session.noticeMessage = noticeMessage;
    }
}