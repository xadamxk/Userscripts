// ==UserScript==
// @name         Yahtzee Enhancements (cardgames.io)
// @namespace    Adam K
// @version      1.0.0
// @description  Calculates sum for bonus and game total
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @author       Adam Koewler
// @match        https://cardgames.io/yahtzee*
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Release
// === Settings ===
const interval = 100;
const sumGoal = 63;
const players = {
    1: 0,
    2: 1
}
const rolls = {
    ones: "ones",
    twos: "twos",
    threes: "threes",
    fours: "fours",
    fives: "fives",
    sixes: "sixes"
}
const combos = {
    bonus: "bonus",
    threeofakind: "three-of-a-kind",
    fourofakind: "four-of-a-kind",
    fullhouse: "full-house",
    smallstraight: "small-straight",
    largestraight: "large-straight",
    chance: "chance",
    yahtzee: "yahtzee"
}
// === Script ===
var $j = jQuery.noConflict();
// Append difference row
$j("#sum").after($j("<tr>").attr("id","sumDifference").addClass("lastline")
                .append("<th>Difference</th>")
                .append("<td></td>")
                .append("<td></td>")
               );
// Check for updates
setInterval(function(){
    updateSumTotal(players["1"]);
    updateSumTotal(players["2"]);
}, interval);

// === Functions ===
function updateSumTotal(playerId){
    let sum = calculateTotal(playerId);
    $j(`#sum > td:eq(${playerId})`).text(sum);
    // Update difference
    let symbol = sumGoal - sum > 0 ? "-" : "+"
    $j(`#sumDifference > td:eq(${playerId})`)
        .text(symbol + Math.abs(sumGoal - sum))
        .css("color",sumGoal - sum > 0 ? "red": "green");
    // Update total
    let comboTotal = calculateTotal(playerId, combos);
    $j(`#total-score > td:eq(${playerId})`).text(sum + comboTotal);
}

function calculateTotal(playerId, type = rolls){
    var total = 0;
    // TODO: Use ES6 function and return it
    Object.keys(type).forEach(function(row){
        total += getRowValue(row, playerId);
    });
    return total
}

function getRowValue(id, playerId){
    try {
        let value = parseInt($j(`#${id} > td:eq(${playerId}):not(.candidate)`).text());
        return !isNaN(value)? value : 0
    } catch(error){
        return 0
    }
}
