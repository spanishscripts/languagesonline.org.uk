// ==UserScript==
// @name         languagesonline.org.uk autofill
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically fills in answers on languagesonline.org.uk exercises
// @author       SpanishScripts
// @match        https://*.languagesonline.org.uk/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Check if the variable I (for fill-in-the-gap exercises) is defined and is an array
    if (typeof I !== 'undefined' && Array.isArray(I)) {
        // Loop through each item in the I array
        for (var i = 0; i < I.length; i++) {
            if (I[i] && I[i][1] && I[i][1][0] && I[i][1][0][0]) {
                // Extract the correct answer
                var answer = I[i][1][0][0];
                // Find the corresponding input element by ID
                var gapElement = document.getElementById('Gap' + i);
                if (gapElement) {
                    // Set the value to the correct answer
                    gapElement.value = answer;
                }
            }
        }
    }
    // Check if variables L and G (for letter-based exercises) are defined and are arrays
    else if (typeof L !== 'undefined' && Array.isArray(L) &&
             typeof G !== 'undefined' && Array.isArray(G)) {
        // Loop through each line in L
        for (var i = 0; i < L.length; i++) {
            if (Array.isArray(L[i])) {
                // Loop through each letter in the line
                for (var j = 0; j < L[i].length; j++) {
                    var letter = L[i][j];
                    if (letter && letter.length > 0) {
                        if (!Array.isArray(G[i])) {
                            G[i] = [];
                        }
                        // Assign the letter to the G array
                        G[i][j] = letter;
                        // Update the HTML content of the corresponding cell
                        var cell = document.getElementById('L_' + i + '_' + j);
                        if (cell) {
                            cell.innerHTML = letter;
                        }
                    }
                }
            }
        }
    }
    // Check if DragEx (for drag-and-drop exercises) is defined with the necessary properties
    else if (typeof DragEx !== 'undefined' && DragEx.RightItems && DragEx.LeftItems) {
        // Loop through each item on the right (draggable items)
        for (var i = 0; i < DragEx.RightItems.length; i++) {
            var rightItem = DragEx.RightItems[i];
            // Find the matching item on the left
            var matchingLeftItem = DragEx.GetLeftItemByOrigPos(rightItem.OrigPos);
            if (matchingLeftItem) {
                // Match the right item with the left item
                rightItem.MatchedWith = matchingLeftItem.OrigPos;
                rightItem.MarkedWrong = false;
            }
        }
        // Set the initial positions if the function is available
        if (typeof DragEx.SetInitialPositions === 'function') {
            DragEx.SetInitialPositions(false);
        }
    }
    // Check if variables DC (cards), L (lines), and Answers are defined for sequence exercises
    else if (typeof DC !== 'undefined' && Array.isArray(DC) &&
             typeof L !== 'undefined' && Array.isArray(L) &&
             typeof Answers !== 'undefined' && Array.isArray(Answers) && Answers.length > 0) {
        var correctSequence = Answers[0];
        var tagToIndex = {};
        // Map each card's tag to its index
        for (var i = 0; i < DC.length; i++) {
            tagToIndex[DC[i].tag] = i;
        }
        var LeftBoundary = L[0].GetL();
        var LineWidth = L[0].GetW();
        var currentLine = 0;
        var currentLeft = LeftBoundary;
        var currentTop = L[currentLine].GetB() - (DC[0].GetH() + 2);

        // Position each card according to the correct sequence
        for (var seqIndex = 0; seqIndex < correctSequence.length; seqIndex++) {
            var tag = correctSequence[seqIndex];
            var dcIndex = tagToIndex[tag];
            if (dcIndex !== undefined) {
                var card = DC[dcIndex];
                card.SetT(currentTop);
                card.SetL(currentLeft);
                currentLeft += card.GetW() + 4;
                if (currentLeft > (LeftBoundary + LineWidth)) {
                    currentLine++;
                    if (currentLine < L.length) {
                        currentLeft = LeftBoundary;
                        currentTop = L[currentLine].GetB() - (card.GetH() + 2);
                        card.SetT(currentTop);
                        card.SetL(currentLeft);
                        currentLeft += card.GetW() + 4;
                    } else {
                        break;
                    }
                }
            }
        }
        // Update the guess sequence
        GuessSequence = correctSequence.slice();
        // Perform any additional checks or capitalizations
        if (typeof CheckOver === 'function') {
            CheckOver(-1);
        }
        if (typeof DoCapitalization === 'function') {
            DoCapitalization();
        }
    }
    else {
        // Alert the user if none of the expected types are detected
        alert("Cannot determine the type. Email spanishscripts@proton.me the link to the page.");
    }
})();
