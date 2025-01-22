(function() {
    if (typeof I !== 'undefined' && Array.isArray(I)) {
        for (var i = 0; i < I.length; i++) {
            if (I[i] && I[i][1] && I[i][1][0] && I[i][1][0][0]) {
                var answer = I[i][1][0][0];
                var gapElement = document.getElementById('Gap' + i);
                if (gapElement) {
                    gapElement.value = answer;
                }
            }
        }
    } else if (typeof L !== 'undefined' && Array.isArray(L) &&
               typeof G !== 'undefined' && Array.isArray(G)) {
        for (var i = 0; i < L.length; i++) {
            if (Array.isArray(L[i])) {
                for (var j = 0; j < L[i].length; j++) {
                    var letter = L[i][j];
                    if (letter && letter.length > 0) {
                        if (!Array.isArray(G[i])) {
                            G[i] = [];
                        }
                        G[i][j] = letter;
                        var cell = document.getElementById('L_' + i + '_' + j);
                        if (cell) {
                            cell.innerHTML = letter;
                        }
                    }
                }
            }
        }
    } else if (typeof DragEx !== 'undefined' && DragEx.RightItems && DragEx.LeftItems) {
        for (var i = 0; i < DragEx.RightItems.length; i++) {
            var rightItem = DragEx.RightItems[i];
            var matchingLeftItem = DragEx.GetLeftItemByOrigPos(rightItem.OrigPos);
            if (matchingLeftItem) {
                rightItem.MatchedWith = matchingLeftItem.OrigPos;
                rightItem.MarkedWrong = false;
            }
        }
        if (typeof DragEx.SetInitialPositions === 'function') {
            DragEx.SetInitialPositions(false);
        }
    } else if (typeof DC !== 'undefined' && Array.isArray(DC) &&
               typeof L !== 'undefined' && Array.isArray(L) &&
               typeof Answers !== 'undefined' && Array.isArray(Answers) && Answers.length > 0) {
        var correctSequence = Answers[0];
        var tagToIndex = {};
        for (var i = 0; i < DC.length; i++) {
            tagToIndex[DC[i].tag] = i;
        }
        var LeftBoundary = L[0].GetL();
        var LineWidth = L[0].GetW();
        var currentLine = 0;
        var currentLeft = LeftBoundary;
        var currentTop = L[currentLine].GetB() - (DC[0].GetH() + 2);

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
        GuessSequence = correctSequence.slice();
        if (typeof CheckOver === 'function') {
            CheckOver(-1);
        }
        if (typeof DoCapitalization === 'function') {
            DoCapitalization();
        }
    } else {
        alert("Cannot determine the type. Email the page link to spanishscripts@proton.me");
    }
})();
