// ==UserScript==
// @name        GitHub Append Full Name to Username
// @author      Adam Koewler
// @namespace   https://github.com/xadamxk/HF-Scripts
// @version     1.1.3
// @description Adds GitHub profile names following username occurrences
// @require     https://code.jquery.com/jquery-3.1.1.js
// @require     https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js
// @require     https://cdn.jsdelivr.net/npm/axios-userscript-adapter@0.0.4/dist/axiosGmxhrAdapter.min.js
// @match       *://github.com/*
// @copyright   2020+
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @updateURL   https://github.com/xadamxk/Userscripts/raw/master/github/GitHub-FullName-Usernames.user.js
// @downloadURL https://github.com/xadamxk/Userscripts/raw/master/github/GitHub-FullName-Usernames.user.js
// ==/UserScript==
// ------------------------------ Changelog -----------------------------
// v 1.1.3: Added update and download URL
// v 1.1.2: Conditions to check for non-user accounts (ie dependabot)
// v 1.1.1: Updated match, update, and download URLs with new domain
// v 1.1.0: Added support for post HARP migration names
// v 1.0.2: Added selector for PR participants
// v 1.0.1: Fixed typo, Cleaned up logic
// v 1.0.0: Initial commit
// ------------------------------ Dev Notes -----------------------------
// https://github.com/Trim21/axios-userscript-adapter
// TODO: Move logic into function, run function, and listen for page layout dom changes using observers.
//
// To use this script for private GitHub instances, simply change the the @match url above and the baseURL below to match your base domain.
// ------------------------------ SETTINGS ------------------------------
const baseURL = "https://github.com/"
const selectors = [
    ".commit-author",                                   // commits
    "a[data-hovercard-type='user']",                    // mentions, comments
    "span[data-hovercard-type='user'] > .assignee",     // reviewers
]
const debug = false
// ------------------------------ SCRIPT ------------------------------
// Import Axios Adapter to connect to XHR
axios.defaults.adapter  = axiosGmxhrAdapter;
let usernames = {};
// Scrap usernames
selectors.forEach((selector, selectorIndex) => {
    $(selector).each((elementIndex, element) => {
        let name = $(element).text().trim();
        if(name.length > 0){
            usernames[name] = ""
        }
    });
});
let promises = [];
// Fetch full names
if(debug) console.log(usernames)
Object.keys(usernames).forEach((username, usernameIndex) => {
    // Check if in memory
    // If not, fetch from profile page and cache
    let storageName = GM_getValue(username);
    if(storageName){
        if(debug) console.log(`${username}:${storageName} exists in memory.`)
        usernames[username] = storageName
    } else{
        if(debug) console.log(`${username}: Fetching user information`)
        promises.push(axios.get(baseURL + username).then(response => {
            // Check for non-user accounts
            if(response["data"].includes(`data-title=\"${username} (`)){
                let fullName = response["data"].split(`data-title=\"${username} (`)[1].split(")")[0]
                usernames[username] = fullName
                GM_setValue(username, fullName)
            } else {
                usernames[username] = null;
                GM_setValue(username, null)
            }
        }));
    }
});
// Append full name to username in DOM
Promise.all(promises).then(()=> {
    if(debug) console.log(usernames)
    // Loop selectors
    // Loop occurances of each selector
    // Append to any matching usernames
    selectors.forEach((selector, selectorIndex) => {
        $(selector).each((elementIndex, element) => {
            Object.entries(usernames).forEach((user, userIndex) => {
                let foundName = $(element).text()
                if(foundName.trim().includes(user[0]) && user[1]){
                    $(element).text(`${foundName} (${user[1]})`);
                }
            });
        });
    });
});
