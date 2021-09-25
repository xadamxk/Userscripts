// ==UserScript==
// @name        LOL Match History Redirect
// @author      Adam Koewler
// @namespace   https://github.com/xadamxk/Userscripts
// @version     1.0.0
// @description Automatically redirects from obsolete match history to LeagueOfGraph's game page.
// @match       *://www.leagueoflegends.com/en-us/news/game-updates/turning-off-web-match-history/*
// @copyright   2021+
// @updateURL   https://github.com/xadamxk/Userscripts/raw/master/leagueoflegends.com/match_history_redirect.user.js
// @downloadURL https://github.com/xadamxk/Userscripts/raw/master/leagueoflegends.com/match_history_redirect.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v1.0.0: Update and Download URLs
// v0.0.1: Initial commit
// ------------------------------ Dev Notes -----------------------------
// If you can find additional sites that take a platform and gameId, let me know and I can add it to this script.
// ------------------------------ SETTINGS ------------------------------
const Platforms = {
    BR1: "br",
    EUN1: "eunu",
    EUW1: "euw",
    JP1: "jp",
    KR: "kr",
    LA1: "lan",
    LA2: "las",
    NA1: "na",
    OC1: "oc",
    TR1: "tr",
    RU: "ru"
}
// ------------------------------ SCRIPT ------------------------------
try {
    // Get params from current url if they exist
    const url = window.location.href;
    const subStr = "#match-details/";
    const path = url.includes(subStr) ? url.split(subStr) : null;

    // Url doesn't include match details
    if (!path) {
        return null;
    }

    const params = path[1].split("/");

    // Url is missing required game params
    if (params.length < 2){
        return null;
    }

    const platform = params[0];
    const gameId = params[1];

    // Redirect to site with corresponding platform
    const outputUrl = ["https://www.leagueofgraphs.com/match", Platforms[platform], gameId].join("/");
    window.location.href = outputUrl;
}catch(err){}
