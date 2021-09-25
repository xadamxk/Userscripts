// ==UserScript==
// @name         Yahtzee Enhancements (cardgames.io)
// @namespace    Adam K
// @version      1.2.0
// @description  Adds useful features to the game
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/attrchange/2.0.1/attrchange.min.js
// @author       Adam K
// @match        https://cardgames.io/yahtzee*
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.2.0: Added odds column
// version 1.1.0: Replaced setInterval trigger with Observable listener
// version 1.0.1: Bugfix: Calculating total logic
// version 1.0.0: Release
// === Settings ===
var $j = jQuery.noConflict();
const interval = 100;
const sumGoal = 63;
const bonus = 35;
const numRounds = 13;
const totalDice = 5;
const players = {
    1: 0,
    2: 1
}
// Single role odds source: https://www.mathcelebrity.com/yahtzee.php
const options = {
    ones: {
        id: "ones",
        odds: (1 / 6)
    },
    twos: {
        id: "twos",
        odds: (1 / 6)
    },
    threes: {
        id: "threes",
        odds: (1 / 6)
    },
    fours: {
        id: "fours",
        odds: (1 / 6)
    },
    fives: {
        id: "fives",
        odds: (1 / 6)
    },
    sixes: {
        id: "sixes",
        odds: (1 / 6)
    },
    bonus: {
        id: "bonus",
        singleRoleOdds: 0
    },
    threeofakind: {
        id: "three-of-a-kind",
        singleRoleOdds: (25 / 162)
    },
    fourofakind: {
        id: "four-of-a-kind",
        singleRoleOdds: (25 / 1296)
    },
    fullhouse: {
        id: "full-house",
        singleRoleOdds: (25 / 648)
    },
    smallstraight: {
        id: "small-straight",
        singleRoleOdds: (10 / 81)
    },
    largestraight: {
        id: "large-straight",
        singleRoleOdds: (5 / 162)
    },
    chance: {
        id: "chance",
        singleRoleOdds: (205 / 324)
    },
    yahtzee: {
        id: "yahtzee",
        singleRoleOdds: (1 / 1296)
    }
}
const rolls = (({ bonus, threeofakind, fourofakind, fullhouse, smallstraight, largestraight, chance, yahtzee, ...o }) => o)(options)
const combos = (({ ones, twos, threes, fours, fives, sixes, ...o }) => o)(options)
const gameRounds = (({ bonus, ...o }) => o)(options)
const singleRollOdds = (({ ones, twos, threes, fours, fives, sixes, bonus, ...o }) => o)(options)

// === Script ===
// Append difference row
appendDifferenceRow();
// Append single row odds
appendSingleRollOdds();
// Append odds column
appendOddsColumn();
// Check for updates
$j(".dice").attrchange({
    trackValues: true,
    callback: function (event) {
        if (event.oldValue !== event.newValue && event.attributeName == "alt") {
            updateSumTotal(players["1"]);
            updateSumTotal(players["2"]);
            $j(".odds:eq(0)").text(formatPercentage(calculateSingleDieOdds(1)))
            $j(".odds:eq(1)").text(formatPercentage(calculateSingleDieOdds(2)))
            $j(".odds:eq(2)").text(formatPercentage(calculateSingleDieOdds(3)))
            $j(".odds:eq(3)").text(formatPercentage(calculateSingleDieOdds(4)))
            $j(".odds:eq(4)").text(formatPercentage(calculateSingleDieOdds(5)))
            $j(".odds:eq(5)").text(formatPercentage(calculateSingleDieOdds(6)))

            // TODO: Trigger event to calculate odds
        }
    }
});

// === Functions ===
function updateSumTotal(playerId) {
    let sum = calculateTotal(playerId);
    $j(`#sum > td:eq(${playerId})`).text(sum);
    // Update difference
    let symbol = sumGoal - sum > 0 ? "-" : "+"
    $j(`#sumDifference > td:eq(${playerId})`)
        .text(symbol + Math.abs(sumGoal - sum))
        .css("color", sumGoal - sum > 0 ? "red" : "green");
    if (sumGoal - sum <= 0) {
        $j(`#bonus > td:eq(${playerId})`).text(bonus)
    }
    // Update total
    let comboTotal = calculateTotal(playerId, combos);
    $j(`#total-score > td:eq(${playerId})`).text(sum + comboTotal);
}

function calculateTotal(playerId, type = rolls) {
    var total = 0;
    total = Object.values(type).reduce((a, b) => a + getRowValue(b.id, playerId), 0);
    return total
}

function getRowValue(id, playerId) {
    try {
        let value = parseInt($j(`#${id} > td:eq(${playerId}):not(".candidate")`).text());
        return !isNaN(value) ? value : 0
    } catch (error) {
        return 0
    }
}

function appendSingleRollOdds() {
    Object.values(singleRollOdds).filter(option => {
        let percent = Math.ceil(option.singleRoleOdds * 100);
        return $j(`#${option.id} > th`).append(` (${percent}%)`);
    })
}

function appendDifferenceRow() {
    $j("#sum").after($j("<tr>").attr("id", "sumDifference").addClass("lastline")
        .append("<th>Difference</th>")
        .append("<td></td>")
        .append("<td></td>")
    );
}

function appendOddsColumn() {
    // Fix styling due to new column
    $j("#yahtzee-play-area").css("width", "60%")
    $j("#scoring-area").css("width", "40%")
    $j("#scorecard-column").css("min-width", "260px")
    // Append columns
    $j("#scorecard > tbody > tr").each((index, row) => {
        if (index == 0) {
            $j(row).find("th").after("<td style=\"border-right: 2px solid black;\">Odds</td>");
        } else {
            $j(row).find("th").after("<th style=\"border-right: 2px solid black;\" class='odds'></th>");

        }
    })
}

// Experimental
function getDiceCount(desiredDie) {
    return getDice()["all"].filter(die => {
        return desiredDie == die;
    }).length;
}

function formatPercentage(decimal) {
    return (decimal * 100).toFixed(2) + "%";
}

function getDice() {
    let dice = { saved: [], throw: [], all: [] };
    $j(".dice").each(function (index, die) {
        let status = $j(die).attr("alt");
        let value = 0;
        if (status.includes("saved")) {
            value = parseInt(status.split("-")[0].trim());
            dice.saved.push(value)
        } else {
            value = parseInt(status);
            dice.throw.push(value)
        }
        dice.all.push(value);
    });
    return dice;
}

function getRemainingRounds() {
    let message = $j("#messageBox").text();
    let throws = -1;
    // If includes turn/begin, don't run
    if (message.includes("turn") || message.includes("begin")) {
        return throws;
    }
    try {
        throws = parseInt(message.match(/\d+/g)) || 0;
    } catch (error) {
        throws = 0
    }
    return throws
}

function getGameRound(playerId) {
    return Object.values(gameRounds).filter(option => {
        return $j(`#${option.id} > td:eq(${playerId}):not(".candidate")`).text().length > 0;
    }).length + 1; // +1 to fix 0 index
}

function calculateSingleDieOdds(die) {
    const remainingRounds = getRemainingRounds();
    if (remainingRounds < 1) return 0;
    return (Math.pow((1 / 6), totalDice - getDiceCount(die))) * remainingRounds;
}

// source: https://stackoverflow.com/a/20762713:
function mode(arr) {
    return arr.sort((a, b) => {
        arr.filter(v => v === a).length - arr.filter(v => v === b).length
    }).pop();
}