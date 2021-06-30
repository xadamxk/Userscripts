// ==UserScript==
// @name         Twitch Auto Claim Channel Points
// @namespace    xadamxk
// @version      1.0.0
// @description  Automatically claims channel points.
// @require https://code.jquery.com/jquery-3.1.1.js
// @author       Adam K
// @match        *://www.twitch.tv/*
// @match        *://twitch.tv/*
// ==/UserScript==
// === Settings ===
// ------------------------------ Changelog -----------------------------
// v 1.0.0: Initial commit
// ------------------------------ Dev Notes -----------------------------
// TODO: Use observer rather than interval
// ------------------------------ SETTINGS ------------------------------
const interval = 1000; // milliseconds
// ------------------------------ SCRIPT ------------------------------
setInterval(checkForClaimButton, interval);

function checkForClaimButton() {
    const claimButton = $(".tw-button.tw-button--success.tw-interactive");
    if (claimButton.length > 0) {
        claimButton.click();
    }
}
