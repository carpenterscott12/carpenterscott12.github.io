import { fullRawWordList } from 'wordList';

var fullDictionary = null;
        var originalWord = null;
        var currentGameSet = null;
        var currentExistingWordIndex = 0;
        var currentWordDoesNotExistIndex = 0;
        // Each index corresponds to the number of underscores. E.g. underscores[6] returns a string with 6 underscores.
        const underscores = ["", "_", "__", "___", "____", "_____", "______", "_______"];


        // Classes:
        class WordList 
        {
            constructor(lengthOfWordsAllowed, initialWordList) 
            {
                this._lengthOfWordsAllowed = lengthOfWordsAllowed;
                this._words = [];
                if (initialWordList.length > 0) {
                    this.insertListOfWords(initialWordList);
                }
            }

            insertWord(wordToInsert) {
                if (wordToInsert.length == this._lengthOfWordsAllowed) 
                {
                    this._words.push(wordToInsert);
                }
                else 
                {
                    console.log("Failed to push word since it was not of length " + this._lengthOfWordsAllowed);
                }
            }

            insertListOfWords(inputList) {
                inputList.forEach(word => {
                    if (word.length == this._lengthOfWordsAllowed) {
                        this.insertWord(word);
                    }
                });
            }

            containsWord(inputWord) {
                var index = this.words.findIndex(word => word.toUpperCase() === inputWord.toUpperCase());
                if (index > -1) {
                    return true;
                }
                else {
                    return false;
                }
            }
        }

        class FullDictionary 
        {
            constructor(rawWordList) 
            {
                this._rawWordList = rawWordList;
                this._wordsWith3Letters = new WordList(3, this._rawWordList);
                this._wordsWith4Letters = new WordList(4, this._rawWordList);
                this._wordsWith5Letters = new WordList(5, this._rawWordList);
                this._wordsWith6Letters = new WordList(6, this._rawWordList);
                this._wordsWith7Letters = new WordList(7, this._rawWordList);
            }

            containsWord(inputWord) {
                switch (inputWord.length) {
                    case 3:
                        return this._wordsWith3Letters.containsWord(inputWord);
                    case 4:
                        return this._wordsWith4Letters.containsWord(inputWord);
                    case 5:
                        return this._wordsWith5Letters.containsWord(inputWord);
                    case 6:
                        return this._wordsWith6Letters.containsWord(inputWord);
                    case 7:
                        return this._wordsWith7Letters.containsWord(inputWord);
                    default:
                        return false;
                }
            }

            getAllMatches(inputWord, inputWordList) {
                let resultArray = [];
                let i = 0; 
                let inputWordArray = inputWordList._words;
                if (inputWordList._lengthOfWordsAllowed > inputWord.length) {
                    return resultArray;
                }
                for (i = 0; i < inputWordArray.length; i++) {
                    let inputWordChars = inputWord.toUpperCase().split('');
                    let currentArrayWordChars = inputWordArray[i].toUpperCase().split('');
                    let j = 0;
                    for (j = 0; j < inputWordChars.length; j++) {
                        let indexToRemove = currentArrayWordChars.indexOf(inputWordChars[j]);
                        if (indexToRemove > -1) {
                            currentArrayWordChars.splice(indexToRemove, 1); // This alters the string. The return value is the character that was removed, so don't assign this to anything.
                        }
                    }
                    if (currentArrayWordChars.length == 0) {
                        resultArray.push(inputWordArray[i]);
                    }
                }
                return resultArray;
            }

            getRandomWord() {
                let randomInt = getRandomIntInclusive(3, 7);
                let randomIndex = 0;
                switch (randomInt) {
                    case 3:
                        randomIndex = getRandomIntInclusive(0, this._wordsWith3Letters._words.length - 1);
                        return this._wordsWith3Letters._words[randomIndex];
                    case 4:
                        randomIndex = getRandomIntInclusive(0, this._wordsWith4Letters._words.length - 1);
                        return this._wordsWith4Letters._words[randomIndex];
                    case 5:
                        randomIndex = getRandomIntInclusive(0, this._wordsWith5Letters._words.length - 1);
                        return this._wordsWith5Letters._words[randomIndex];
                    case 6:
                        randomIndex = getRandomIntInclusive(0, this._wordsWith6Letters._words.length - 1);
                        return this._wordsWith6Letters._words[randomIndex];
                    case 7:
                        randomIndex = getRandomIntInclusive(0, this._wordsWith7Letters._words.length - 1);
                        return this._wordsWith7Letters._words[randomIndex];
                    default:
                        return false;
                }
            }

            createNewGameSet(inputWord) {
                let currentGame3LetterWords = this.getAllMatches(inputWord, this._wordsWith3Letters);
                let currentGame4LetterWords = this.getAllMatches(inputWord, this._wordsWith4Letters);
                let currentGame5LetterWords = this.getAllMatches(inputWord, this._wordsWith5Letters);
                let currentGame6LetterWords = this.getAllMatches(inputWord, this._wordsWith6Letters);
                let currentGame7LetterWords = this.getAllMatches(inputWord, this._wordsWith7Letters);
                return new GameSet(inputWord, currentGame3LetterWords, currentGame4LetterWords, currentGame5LetterWords, currentGame6LetterWords, currentGame7LetterWords);
            }
        }

        class GameSet {
            constructor(originalWord, words3Length, words4Length, words5Length, words6Length, words7Length) {
                this._findable3Length = this.createFindableWordArray(words3Length);
                this._findable4Length = this.createFindableWordArray(words4Length);
                this._findable5Length = this.createFindableWordArray(words5Length);
                this._findable6Length = this.createFindableWordArray(words6Length);
                this._findable7Length = this.createFindableWordArray(words7Length);
                this.endGameCount = this._findable3Length.length + this._findable4Length.length + this._findable5Length.length + this._findable6Length.length + this._findable7Length.length;
                this.currentGameCount = 0;
            }

            createFindableWordArray(wordList) {
                console.log(wordList);
                let findableWords = [];
                let i = 0;
                for (i = 0; i < wordList.length; i++) {
                    // Don't include original word in the list
                    if (wordList[i].toUpperCase() === originalWord.toUpperCase()) {
                        continue;
                    }
                    let findable = new FindableWord(wordList[i]);
                    findableWords.push(findable);
                }
                return findableWords;
            }

            markWordFound(word) {
                switch (word.length) {
                    case 3:
                        return this.findableContainsWord(word, this._findable3Length);
                        break;
                    case 4:
                        return this.findableContainsWord(word, this._findable4Length);
                        break;
                    case 5:
                        return this.findableContainsWord(word, this._findable5Length);
                        break;
                    case 6:
                        return this.findableContainsWord(word, this._findable6Length);
                        break;
                    case 7:
                        return this.findableContainsWord(word, this._findable7Length);
                        break;
                    default:
                        return false;
                }
            }

            findableContainsWord(wordToFind, findableWordList) {
                var index = findableWordList.findIndex(findable => findable._word.toUpperCase() === wordToFind.toUpperCase());
                if (index > -1) {
                    // If the word has already been found, don't increment the currentGameCount here. That causes the success message to play too early when entering existing found words.
                    if (findableWordList[index]._found == false) {
                        findableWordList[index].markWordFound();
                        this.currentGameCount++;
                        clearAlert();
                        return true;
                    }
                    else {
                        this.setExistingWordAlert();
                        false;
                    }
                }
                else {
                    this.setWordDoesNotExistAlert();
                    return false;
                }
            }

            setExistingWordAlert() {
                switch (currentExistingWordIndex) {
                    case 0:
                        setAlert("warning-alert", "Dat's already on the sandwich!");
                        break;
                    case 1:
                        setAlert("warning-alert", "That's there already, take it easy on the mustard!");
                        break;
                    case 2:
                        setAlert("warning-alert", "It's already here, don't overdo it.");
                        break;
                    case 3:
                        setAlert("warning-alert", "Already on the sandwich, find a new dog to do the old trick.");
                        break;
                    default:
                        setAlert("warning-alert", "I got one of those already.");
                        break;
                }
                currentExistingWordIndex++;
                if (currentExistingWordIndex > 4) {
                    currentExistingWordIndex = 0;
                }
            }

            setWordDoesNotExistAlert() {
                switch (currentWordDoesNotExistIndex) {
                    case 0:
                        setAlert("error-alert", "NASTY");
                        break;
                    case 1:
                        setAlert("error-alert", "I never seen that on a sandwich.");
                        break;
                    case 2:
                        setAlert("error-alert", "Have you made a sandwich before? Garbaggio!");
                        break;
                    case 3:
                        setAlert("error-alert", "I'm glad I'm not paying you to do this.");
                        break;
                    default:
                        setAlert("error-alert", "No! I don't want that! Get it together!");
                        break;
                }
                currentWordDoesNotExistIndex++;
                if (currentWordDoesNotExistIndex > 4) {
                    currentWordDoesNotExistIndex = 0;
                }
            }
        }

        class FindableWord {
            constructor(word, found = false) {
                this._word = word;
                this._found = found;
            }

            markWordFound() {
                this._found = true;
            }
        }


        // Functions:
        function getFindableWordString(findableWordList, showAllWords = false) {
            let result = "";
            let i = 0; 
            for (i = 0; i < findableWordList.length; i++) {
                let currentWord = findableWordList[i]._word;
                if (showAllWords || findableWordList[i]._found) {
                    result = result.concat(currentWord);
                }
                else {
                    if (currentWord.length < 8) {
                        result = result.concat(underscores[currentWord.length]);
                    }
                    else {
                        result = result.concat("_");
                    }
                    
                }
                if (i < findableWordList.length - 1) {
                    result = result.concat(" ");
                }
            }
            return result;
        }

        function submit() {
            if (currentGameSet && currentGameSet.currentGameCount === currentGameSet.endGameCount) {
                setAlert("success-alert", "Congratulations! You done it! You a winner now! (Press the Reset Game button to play again)");
                return;
            }

            var currentWordElement = document.getElementById('InputBox');
            let currentWord = currentWordElement.value;
            if (!originalWord) {
                // TODO: Also need to check for special characters. I only want to allow letters here.
                if (currentWord.length > 2 && currentWord.length < 8) {
                    createNewGame(currentWord);
                }
                else {
                    setAlert("error-alert", "The input word must be 3 to 7 characters long.");
                }
                
            }
            else {
                if (currentWord.length > 2 && currentWord.length < 8) {
                    // Check against the currentGameSet
                    let success = currentGameSet.markWordFound(currentWord);
                    if (currentGameSet.currentGameCount === currentGameSet.endGameCount) {
                        setAlert("success-alert", "Congratulations! You done it! You a winner now! (Press the Reset Game button to play again)");
                    }
                }
            }

            let showAllWords = false;
            if (currentWord.toUpperCase() === "I QUIT") {
                showAllWords = true;
            }

            updateWordDisplay(showAllWords);

            currentWordElement.value = "";
        }

        function updateWordDisplay(showAllWords) {
            var wordsWith3LettersElem = document.getElementById("WordsWith3Letters");
            var wordsWith4LettersElem = document.getElementById("WordsWith4Letters");
            var wordsWith5LettersElem = document.getElementById("WordsWith5Letters");
            var wordsWith6LettersElem = document.getElementById("WordsWith6Letters");
            var wordsWith7LettersElem = document.getElementById("WordsWith7Letters");
            var wordsWith3LettersLabelElem = document.getElementById("WordsWith3LettersLabel");
            var wordsWith4LettersLabelElem = document.getElementById("WordsWith4LettersLabel");
            var wordsWith5LettersLabelElem = document.getElementById("WordsWith5LettersLabel");
            var wordsWith6LettersLabelElem = document.getElementById("WordsWith6LettersLabel");
            var wordsWith7LettersLabelElem = document.getElementById("WordsWith7LettersLabel");

            let innerHtml3Long = getFindableWordString(currentGameSet._findable3Length, showAllWords);
            let innerHtml4Long = getFindableWordString(currentGameSet._findable4Length, showAllWords);
            let innerHtml5Long = getFindableWordString(currentGameSet._findable5Length, showAllWords);
            let innerHtml6Long = getFindableWordString(currentGameSet._findable6Length, showAllWords);
            let innerHtml7Long = getFindableWordString(currentGameSet._findable7Length, showAllWords);

            if (innerHtml3Long) {
                wordsWith3LettersElem.innerHTML = innerHtml3Long;
                wordsWith3LettersLabelElem.style.display = "block";
            }
            else {
                wordsWith3LettersLabelElem.style.display = "none";
            }
            if (innerHtml4Long) {
                wordsWith4LettersElem.innerHTML = innerHtml4Long;
                wordsWith4LettersLabelElem.style.display = "block";
            }
            else {
                wordsWith4LettersLabelElem.style.display = "none";
            }
            if (innerHtml5Long) {
                wordsWith5LettersElem.innerHTML = innerHtml5Long;
                wordsWith5LettersLabelElem.style.display = "block";
            }
            else {
                wordsWith5LettersLabelElem.style.display = "none";
            }
            if (innerHtml6Long) {
                wordsWith6LettersElem.innerHTML = innerHtml6Long;
                wordsWith6LettersLabelElem.style.display = "block";
            }
            else {
                wordsWith6LettersLabelElem.style.display = "none";
            }
            if (innerHtml7Long) {
                wordsWith7LettersElem.innerHTML = innerHtml7Long;
                wordsWith7LettersLabelElem.style.display = "block";
            }
            else {
                wordsWith7LettersLabelElem.style.display = "none";
            }
        }

        function resetGame() {
            originalWord = null;
            currentGameSet = null;

            document.getElementById("InputBox").value = "";
            document.getElementById("OriginalWord").innerHTML = "";
            document.getElementById("WordsWith3Letters").innerHTML = "";
            document.getElementById("WordsWith4Letters").innerHTML = "";
            document.getElementById("WordsWith5Letters").innerHTML = "";
            document.getElementById("WordsWith6Letters").innerHTML = "";
            document.getElementById("WordsWith7Letters").innerHTML = "";
            document.getElementById("InfoMessage").innerHTML = "";
            document.getElementById("OriginalWordContainer").style.display = "none";
            document.getElementById("WordsWith3LettersLabel").style.display = "none";
            document.getElementById("WordsWith4LettersLabel").style.display = "none";
            document.getElementById("WordsWith5LettersLabel").style.display = "none";
            document.getElementById("WordsWith6LettersLabel").style.display = "none";
            document.getElementById("WordsWith7LettersLabel").style.display = "none";
            document.getElementById("EnterAWordToStart").style.display = "block";
            
            hideOngoingGameButtons();
        }

        function resetWithRandomWord() {
            resetGame();
            let randomWord = fullDictionary.getRandomWord();
            createNewGame(randomWord);
            updateWordDisplay(false);
            currentWordElement.value = "";
        }

        function createNewGame(newWord) {
            originalWord = newWord;
            document.getElementById("OriginalWord").innerHTML = newWord;
            document.getElementById("OriginalWordContainer").style.display = "block";
            document.getElementById("EnterAWordToStart").style.display = "none";
            document.getElementById("InfoMessage").innerHTML = "";
            currentGameSet = fullDictionary.createNewGameSet(newWord);
            showOngoingGameButtons();
            setAlert("info-alert", "Enter a word that can be made from the other letters. That's how you make a sandwich!");
        }

        function getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function startGame() {
            fullDictionary = new FullDictionary(fullRawWordList);
            var originalWord = "";
        }

        function showOngoingGameButtons() {
            document.getElementById("ShowSolution").style.display = "block";
            document.getElementById("ResetButton").style.display = "block";
        }

        function hideOngoingGameButtons() {
            document.getElementById("ShowSolution").style.display = "none";
            document.getElementById("ResetButton").style.display = "none";
        }

        function setAlert(className, message) {
            let infoMessage = document.getElementById("InfoMessage");
            infoMessage.innerHTML = message;
            infoMessage.className = className;
        }

        function clearAlert() {
            let infoMessage = document.getElementById("InfoMessage");
            infoMessage.innerHTML = "";
        }

        // Setup:
        document.getElementById("SubmitButton").addEventListener('click', function() {submit()});
        document.getElementById('InputBox').addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                // Equivalent to clicking on the SubmitButton element
                submit();
            }
        });
        document.getElementById("CreateGameWithRandom").addEventListener('click', function() {resetWithRandomWord()});
        document.getElementById("ResetButton").addEventListener('click', function() {resetGame()});
        document.getElementById("ShowSolution").addEventListener('click', function() {updateWordDisplay(true)});

        
            
            
            // Main game:
            startGame();