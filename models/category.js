"use strict";

var database = require("../database");

function aggregateMainCategories(mainCategories){
    var aggregatedMainCategories = [];
    mainCategories.forEach(mainCategory => {
        if(aggregatedMainCategories.find(searchCategory => searchCategory.IdKategoria === mainCategory.IdKategoria)){

        }
        else{
            aggregatedMainCategories.push({IdKategoria:mainCategory.IdKategoria, Nazwa:mainCategory.Nazwa, IdJęzyk:mainCategory.IdJęzyk, KategoriePodrzędne:[]})
        }
        const mainCategoryIndex = aggregatedMainCategories.findIndex(searchCategory => searchCategory.IdKategoria === mainCategory.IdKatNadrzędnej2);
        aggregatedMainCategories[mainCategoryIndex].KategoriePodrzędne.push({IdKategoriaPodrzędna:mainCategory.IdKategoriaPodrzędna, NazwaPodrzędnej:mainCategory.NazwaPodrzędnej, DataUtworzeniaPodrzędnej:mainCategory.DataUtworzeniaPodrzędnej, IdJęzykPodrzędnej:mainCategory.IdJęzykPodrzędnej})
    });
}

module.exports = {
    getMainCategories(callback){
        database.query("SELECT * FROM Kategoria as K1 LEFT JOIN (SELECT IdKategoria as IdKategoriaPodrzędna, Nazwa as NazwaPodrzędnej, DataUtworzenia as DataUtworzeniaPodrzędnej, IdJęzyk as IdJęzykPodrzędnej, IdKatNadrzędnej as IdKatNadrzędnej2 FROM Kategoria) as K2 ON K1.IdKategoria = K2.IdKatNadrzędnej2 WHERE K1.IdKatNadrzędnej IS NULL").then(mainCategories =>{
            callback(aggregateMainCategories(mainCategories));
        });                 
    },
    getChildCategories(parentCategoryId, callback){
        database.query("SELECT * FROM Kategoria WHERE IdKatNadrzędnej = " + parentCategoryId).then(childCategories =>{
            callback(childCategories);
        });
    }
};