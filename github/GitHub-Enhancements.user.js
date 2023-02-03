// ==UserScript==
// @name       GitHub Enhancements
// @author xadamxk
// @namespace  https://github.com/xadamxk/Userscripts
// @version    1.0.0
// @description Adds enhancements to GitHub.com
// @require     https://code.jquery.com/jquery-3.1.1.js
// @match      *://github.com/*
// @copyright  2016+
// @updateURL
// @downloadURL
// @iconURL
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.0.0:
// ------------------------------ Dev Notes -----------------------------
//
// ------------------------------ SETTINGS ------------------------------
var debug = false;
// ------------------------------ Page Load -----------------------------
const projectPath = $("#code-tab").attr("href");

// Watchers
var watchCounter = $("#repo-notifications-counter");
if(watchCounter){
    const watchCount = $(watchCounter).text();
    watchCounter.empty();
    $(watchCounter).append($("<a>").attr({"href":`${projectPath}/watchers`, "title":"Watchers"}).css({"color": "#ddd"}).text(watchCount));
}

// Forks
var forkCounter = $("#repo-network-counter");
if(forkCounter){
    const forkCount = $(forkCounter).text();
    forkCounter.empty();
    $(forkCounter).append($("<a>").attr({"href":`${projectPath}/forks`, "title":"Forks"}).css({"color": "#ddd"}).text(forkCount));
}

// Stargazers
var starCounter = $("#repo-stars-counter-star");
if(starCounter){
    const starCount = $(starCounter).text();
    starCounter.empty();
    $(starCounter).append($("<a>").attr({"href":`${projectPath}/stargazers`, "title":"Stargazers"}).css({"color": "#ddd"}).text(starCount));
}

// Delete repository
const deleteRepoDialog = $("details-dialog[aria-label='Delete repository']");
if(deleteRepoDialog){
    // Make confirmation prompt clickable
    const confirmationTextElement = $(deleteRepoDialog).find(".Box-body > p:eq(2) > strong")[0];
    const confirmationText = $(confirmationTextElement).text();
    $(confirmationTextElement).empty();
    $(confirmationTextElement).append($("<a>").append("<strong>").text(confirmationText).click(function() {
        // Add repo name to input
        const confirmationInput = $(deleteRepoDialog).find("input[name='verify']");
        $(confirmationInput).val(confirmationText);
    }));
    // Enable delete button
    const deleteButton = $(deleteRepoDialog).find("button[type='submit']");
    $(deleteButton).removeAttr("disabled");
}