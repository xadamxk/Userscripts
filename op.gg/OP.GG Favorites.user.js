// ==UserScript==
// @name        OP.GG Favorites
// @author      Adam Koewler
// @namespace   https://github.com/xadamxk/Userscripts
// @version     1.1.0
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
// v 1.1.0: Update selector logic to get favorites from cookie
// v 1.0.1: Added update and download urls
// v 1.0.0: Initial commit
// ------------------------------ Dev Notes -----------------------------
// Climb safe!
// ------------------------------ SETTINGS ------------------------------
// ------------------------------ SCRIPT ------------------------------
let favCookieStr = '';
let subdomain = '';
try {
    const cookieStr = document.cookie;
    const cookies = cookieStr.split(";")
    favCookieStr = cookies.filter((cookie) => {
        return cookie.includes("_fav")
    })[0];
    subdomain = window.location.hostname.split(".")[0];
} catch (err) {
    console.log("failed to parse favorites from cookie");
    return null;
}

const favoritesStr = favCookieStr.replace("_fav=", "");
const favorites = favoritesStr.split("%24");
const baseLink = `/summoners/${subdomain}/`;


$("#__next > div:eq(0)").prepend($("<div>").addClass("PastRank").append($("<ul>").addClass("PastRankList").attr({ "id": "opggFavorites" })))

$(favorites).each((index, summonerName) => {
    const link = baseLink + summonerName;
    const name = summonerName
    if (link && name) {
        $("#opggFavorites").append($("<li>").addClass("Item tip tpd-delegation-uid-1").append($("<a>").attr("href", link).append($("<b>").text(name))));
    }
});