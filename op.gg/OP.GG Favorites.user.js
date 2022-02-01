// ==UserScript==
// @name        OP.GG Favorites
// @author      Adam Koewler
// @namespace   https://github.com/xadamxk/Userscripts
// @version     1.0.0
// @description Adds shortcut links to OP.GG's headers of favorited profiles
// @require     https://code.jquery.com/jquery-3.1.1.js
// @match       *://www.op.gg/*
// @match       *://na.op.gg/*
// @match       *://jp.op.gg/*s
// @match       *://euw.op.gg/*
// @match       *://eune.op.gg/*
// @match       *://oce.op.gg/*
// @match       *://br.op.gg/*
// @match       *://las.op.gg/*
// @match       *://lan.op.gg/*
// @match       *://ru.op.gg/*
// @match       *://tr.op.gg/*
// @updateURL
// @downloadURL
// @copyright   2022+
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.0.1: Added update and download urls
// v 1.0.0: Initial commit
// ------------------------------ Dev Notes -----------------------------
// Climb safe!
// ------------------------------ SETTINGS ------------------------------
// ------------------------------ SCRIPT ------------------------------
const favoritesElements = $(".FavoriteSummonerList").find(".Item");
if (!favoritesElements) return null;

$(".Header").prepend($("<div>").addClass("PastRank").append($("<ul>").addClass("PastRankList").attr({ "id": "opggFavorites" })))

$(favoritesElements).each((index, favoriteItem) => {
    const link = $(favoriteItem).find("a.Link:first").attr("href");
    const name = $(favoriteItem).find(".SummonerName").text();
    if (link && name) {
        $("#opggFavorites").append($("<li>").addClass("Item tip tpd-delegation-uid-1").append($("<a>").attr("href", link).append($("<b>").text(name))));
    }
});