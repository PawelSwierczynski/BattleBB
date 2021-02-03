"use strict";

var database = require("../database");

module.exports = {
    retrieveReceivedMessages(username, callback) {
        database.query("SELECT Identifier, Title, Login AS SenderUsername, IdUżytkownik AS SenderIdentifier, IsRead, SentDate FROM (SELECT UW.IdWiadomość AS Identifier, UW.IdNadawca AS SenderIdentifier, UW.IdOdbiorca AS RecipientIdentifier, UW.CzyPrzeczytane AS IsRead, W.Tytuł AS Title, W.Treść AS Content, W.DataWysłania AS SentDate FROM UżytkownikWiadomość AS UW JOIN Wiadomość AS W ON UW.IdWiadomość = W.IdWiadomość WHERE UW.IdOdbiorca = (SELECT IdUżytkownik FROM Użytkownik WHERE Login = ?)) AS Message JOIN Użytkownik ON Message.SenderIdentifier = Użytkownik.IdUżytkownik ORDER BY SentDate DESC;", [username]).then(receivedMessages => {
            callback(receivedMessages);
        });
    },
    retrieveSentMessages(username, callback) {
        database.query("SELECT Identifier, Title, Login AS RecipientUsername, IdUżytkownik AS RecipientIdentifier, IsRead, SentDate FROM (SELECT UW.IdWiadomość AS Identifier, UW.IdNadawca AS SenderIdentifier, UW.IdOdbiorca AS RecipientIdentifier, UW.CzyPrzeczytane AS IsRead, W.Tytuł AS Title, W.Treść AS Content, W.DataWysłania AS SentDate FROM UżytkownikWiadomość AS UW JOIN Wiadomość AS W ON UW.IdWiadomość = W.IdWiadomość WHERE UW.IdNadawca = (SELECT IdUżytkownik FROM Użytkownik WHERE Login = ?)) AS Message JOIN Użytkownik ON Message.RecipientIdentifier = Użytkownik.IdUżytkownik ORDER BY SentDate DESC;", [username]).then(sentMessages => {
            callback(sentMessages);
        });
    },
    sendMessage(senderUsername, recipientUsername, subject, message, callback) {
        database.query("CALL sendMessage(?, ?, ?, ?)", [senderUsername, recipientUsername, subject, message]).then(() => {
            callback(false);
        }).catch(error => {
            callback(error);
        });
    },
    isUserAllowedToReadMessage(username, messageIdentifier, callback) {
        database.query("SELECT IdWiadomość FROM UżytkownikWiadomość WHERE IdNadawca = (SELECT IdUżytkownik FROM Użytkownik WHERE Login = ?) AND IdWiadomość = ?", [username, messageIdentifier]).then(isUserSender => {
            if (isUserSender[0] != null) {
                callback(true, false);

                return;
            }
            else {
                database.query("SELECT IdWiadomość FROM UżytkownikWiadomość WHERE IdOdbiorca = (SELECT IdUżytkownik FROM Użytkownik WHERE Login = ?) AND IdWiadomość = ?", [username, messageIdentifier]).then(isUserRecipient => {
                    if (isUserRecipient[0] != null) {
                        callback(false, true);
                    }
                    else {
                        callback(false, false);
                    }
                });
            }
        });
    },
    retrieveMessage(messageIdentifier, callback) {
        database.query("SELECT Tytuł AS Title, Treść AS Message, (SELECT Login FROM Użytkownik WHERE IdUżytkownik = IdNadawca) AS SenderUsername, IdNadawca AS SenderIdentifier, (SELECT Login FROM Użytkownik WHERE IdUżytkownik = IdOdbiorca) AS RecipientUsername, IdOdbiorca AS RecipientIdentifier, DataWysłania AS SentDate FROM Wiadomość JOIN UżytkownikWiadomość ON Wiadomość.IdWiadomość = UżytkownikWiadomość.IdWiadomość WHERE Wiadomość.IdWiadomość = ?", [messageIdentifier]).then(message => {
            if (message[0] != null) {
                callback(false, message[0]);
            }
            else {
                callback(true, null);
            }
        });
    },
    markMessageAsRead(messageIdentifier, callback) {
        database.query("UPDATE UżytkownikWiadomość SET CzyPrzeczytane = TRUE WHERE IdWiadomość = ?;", [messageIdentifier]).then(() => {
            callback();
        });
    }
}