// ==UserScript==
// @name        OP.GG Favorites
// @author      Adam Koewler
// @namespace   https://github.com/xadamxk/Userscripts
// @version     1.2.0
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
// @updateURL   https://github.com/xadamxk/Userscripts/raw/master/op.gg/OP.GG%20Favorites.user.js
// @downloadURL https://github.com/xadamxk/Userscripts/raw/master/op.gg/OP.GG%20Favorites.user.js
// @copyright   2022+
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.2.0: Update selector logic to get favorites from local storage (site change)
// v 1.1.0: Update selector logic to get favorites from cookie (site change)
// v 1.0.1: Added update and download urls
// v 1.0.0: Initial commit
// ------------------------------ Dev Notes -----------------------------
// Climb safe!
// ------------------------------ SETTINGS ------------------------------
// ------------------------------ SCRIPT --------------------------------
const getFavorites = async () => {
    try {
        const favoritesStr = await localStorage.getItem('_fav');
        const favorites = favoritesStr.split("%24");
        return favorites.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    } catch (err) {
        throw Error("Failed to parse op.gg favorites.");
    }
}

const getSubdomain = () => {
    try {
        return window.location.hostname.split(".")[0];
    } catch (err) {
        throw Error("Failed to parse op.gg subdomain.");
    }
}

const favorites = await getFavorites();
const subdomain = getSubdomain();
const baseLink = `/summoners/${subdomain}/`;


$("#__next > div:eq(0)").prepend($("<div>").addClass("PastRank").append($("<ul>").addClass("PastRankList").attr({ "id": "opggFavorites" })))

$(favorites).each((index, summonerName) => {
    const link = baseLink + summonerName;
    const name = summonerName.replaceAll('%20', ' ')
    if (link && name) {
        $("#opggFavorites").append($("<li>").addClass("Item tip tpd-delegation-uid-1").append($("<a>").attr("href", link).append($("<b>").text(name))));
    }
});