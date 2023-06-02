// ==UserScript==
// @name        GitHub Favorites
// @author      Adam Koewler
// @namespace   https://github.com/xadamxk/Userscripts
// @version     1.0.2
// @description Adds a dropdown for favorites to the GitHub header.
// @require     https://code.jquery.com/jquery-3.1.1.js
// @match       *://github.com/*
// @copyright   2020+
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.0.2: Bugfix for partial page changes
// v 1.0.1: Bugfix for appending to all nav elements
// v 1.0.0: Initial commit
// ------------------------------ Dev Notes -----------------------------
// Stay hydrated out there!
// ------------------------------ SETTINGS ------------------------------
// Supported types: seperator, header, item
function Favorite(type, label, link){
    this.type = type;
    this.label = label;
    this.link = link;
}
const favorites = [
    new Favorite("header","General",null),
    new Favorite("item", "Profile", "/xadamxk"),
    new Favorite("seperator",null,null),
    new Favorite("header","League",null),
    new Favorite("item", "LCU Enhancement Suite", "/xadamxk/LCU-Enhancement-Suite"),
    new Favorite("item", "LCU Event Viewer", "/pipe01/lcu-event-viewer"),
    new Favorite("seperator",null,null),
    new Favorite("header","Other",null),
    new Favorite("item", "HFX 2.0", "/xadamxk/HFX2.0"),
];
// ------------------------------ SCRIPT ------------------------------
function appendFavorites() {
    $("nav:eq(0)").append($("<div>").addClass("Header-item position-relative d-none d-md-flex")
                          .append($("<span>"))
                          .append($("<details>").addClass("details-overlay details-reset")
                                  .append($("<summary>").addClass("Header-link").attr({"role":"button", "data-ga-click":"Header, show menu"})
                                          .append($("<span>").text("Favorites").css({"padding-right":"5px"}))
                                          .append($("<span>").addClass("dropdown-caret")))
                                  .append($("<details-menu>").addClass("dropdown-menu dropdown-menu-sw mt-n2").attr({"role":"menu"}).attr({"id":"favoritesContainer"}))
                                 ));
    // Loop favorites
    favorites.map(favoriteItem => {
        const favorite = new Favorite(favoriteItem.type, favoriteItem.label, favoriteItem.link)
        switch(favorite.type) {
            case "seperator":
                $("#favoritesContainer").append($("<div>").attr({"role":"none"}).addClass("dropdown-divider"))
                break;
            case "header":
                $("#favoritesContainer").append($("<div>").addClass("dropdown-header").append($("<span>").text(favorite.label)))
                break;
            case "item":
                $("#favoritesContainer").append($("<a>").attr({"role":"menuitem", "href":favorite.link}).addClass("dropdown-item").text(favorite.label))
                break;
        }
    });
}

appendFavorites();

const interval = setInterval(function () {
    if ($('#favoritesContainer').length) {
        clearInterval(interval);
    } else {
        appendFavorites();
    }
}, 1000);
