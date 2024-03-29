"use strict";

var database = require("../database");

var dateFormatter = require("../utilities/dateFormatter");

function aggregateCategoriesWithChildren(categoriesWithChildren){
    var aggregatedMainCategories = [];

    categoriesWithChildren.forEach(categoryWithChildren => {
        if (!aggregatedMainCategories.find(searchedCategory => searchedCategory.IdKategoria === categoryWithChildren.IdKategoria)){
            aggregatedMainCategories.push({
                IdKategoria: categoryWithChildren.IdKategoria,
                Nazwa: categoryWithChildren.Nazwa,
                IdJęzyk: categoryWithChildren.IdJęzyk,
                KategoriePodrzedne: []
            });
        }

        if (categoryWithChildren.IdKatNadrzędnej2 != null) {
            const mainCategoryIndex = aggregatedMainCategories.findIndex(searchCategory => searchCategory.IdKategoria === categoryWithChildren.IdKatNadrzędnej2);

            aggregatedMainCategories[mainCategoryIndex]["KategoriePodrzedne"].push({
                IdKategoriaPodrzędna: categoryWithChildren.IdKategoriaPodrzędna,
                NazwaPodrzędnej: categoryWithChildren.NazwaPodrzędnej,
                DataUtworzeniaPodrzędnej: categoryWithChildren.DataUtworzeniaPodrzędnej,
                IdJęzykPodrzędnej: categoryWithChildren.IdJęzykPodrzędnej
            });
        }
    });

    return aggregatedMainCategories;
}

function formatChildCategoryDates(categoriesWithChildren) {
    categoriesWithChildren.forEach(categoryWithChildren => {
        categoryWithChildren["KategoriePodrzedne"].forEach(childCategory => {
            childCategory["DataUtworzeniaPodrzędnej"] = dateFormatter.formatDate(childCategory["DataUtworzeniaPodrzędnej"]);
        });
    });

    return categoriesWithChildren;
}

var categoriesThreads = [];

function getNumberOfThreads(threads, categoriesWithChildren) {
    categoriesWithChildren.forEach(categoryWithChildren => {
        var help = 0;
        threads.forEach(thread =>{
            if(thread.IdKategoria === categoryWithChildren.IdKategoriaPodrzędna)
            {
                help++;
            }
        });
        categoriesThreads.push({
            IdCategory: categoryWithChildren.IdKategoriaPodrzędna,
            ThreadCount: help
        });
    });
    return categoriesThreads;    
}

module.exports = {
    getCategoriesWithChildren(parentCategoryIdentifier, language, callback) {
        database.query("SELECT * FROM Kategoria as K1 LEFT JOIN (SELECT IdKategoria as IdKategoriaPodrzędna, Nazwa as NazwaPodrzędnej, DataUtworzenia as DataUtworzeniaPodrzędnej, IdJęzyk as IdJęzykPodrzędnej, IdKatNadrzędnej as IdKatNadrzędnej2 FROM Kategoria) as K2 ON K1.IdKategoria = K2.IdKatNadrzędnej2 WHERE K1.IdJęzyk = (SELECT IdJęzyk FROM Język WHERE Nazwa = ?) AND K1.IdKatNadrzędnej" + (parentCategoryIdentifier ? " = ?;" : " IS NULL;"), [language, parentCategoryIdentifier]).then(categoriesWithChildren => {
            database.query("SELECT * FROM Wątek as w JOIN Subforum as s ON w.IdSubforum = s.IdSubforum JOIN Kategoria as k ON k.IdKategoria = s.IdKategoria").then(threads => {                 
                callback(formatChildCategoryDates(aggregateCategoriesWithChildren(categoriesWithChildren)), getNumberOfThreads(threads, categoriesWithChildren));
            });  
        });                 
    }
};