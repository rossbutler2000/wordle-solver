import {
  BUFFER_SIZE,
  ERROR_MESSAGE,
  GUESSES,
  ROW_KEY,
  SEARCH_WORD,
  SUCCESS_MESSAGE,
  WORDS_LIST_TYPE
} from "../types";

import { WORD_LIST } from "../data/WORDLIST";
import {
  allGuesses,
  colorChoices,
  defaultColor,
  errorMessage,
  firstSearchWord,
  startingRowKey,
  successMessage,
  wordListError
} from "../data/initialState";



export const changeKey = (newKey) => {
  return { type: ROW_KEY, payload: newKey };
}

export const changeSearchWord = (word) => {
  return { type: SEARCH_WORD, payload: word };
}

export const fullReset = () => (dispatch) => {
  dispatch({ type: ERROR_MESSAGE, payload: errorMessage });
  dispatch({ type: SUCCESS_MESSAGE, payload: successMessage })
  dispatch({ type: ROW_KEY, payload: startingRowKey });
  dispatch({ type: GUESSES, payload: allGuesses });
  dispatch({ type: SEARCH_WORD, payload: firstSearchWord });
  dispatch({ type: WORDS_LIST_TYPE, payload: WORD_LIST });
}

export const showErrorMessage = (error) => {
  return { type: ERROR_MESSAGE, payload: error };
}

export const showSuccessMessage = (show) => {
  return { type: SUCCESS_MESSAGE, payload: show };
}

export const changeBufferSize = (size) => {
  return { type: BUFFER_SIZE, payload: size }
}

export const changeColor = (letterKey, color) => (dispatch, getState) => {
  const { allGuesses, rowKey } = getState();
  const colors = [...allGuesses[rowKey].colors];
  colors[letterKey] = color;

  allGuesses[rowKey] = { ...allGuesses[rowKey], colors };
  dispatch({ type: GUESSES, payload: allGuesses });
}

export const changeWord = (word) => (dispatch, getState) => {
  const { allGuesses, rowKey } = getState();
  const { colors, locks } = allGuesses[rowKey];
  
  const newColors = [...colors];
  for (let i = 0; i < newColors.length; i++) {
    if (locks[i] == false) {
      newColors[i] = defaultColor;
    }
  }
  
  allGuesses[rowKey] = { ...allGuesses[rowKey], word, colors: newColors };

  dispatch({ type: GUESSES, payload: allGuesses });
}

export const lockAll = () => (dispatch, getState) => {
  const { allGuesses, rowKey } = getState();
  
  allGuesses[rowKey] = { ...allGuesses[rowKey], locks: Array(5).fill(true) };

  dispatch({ type: GUESSES, payload: allGuesses });
}



export const onSubmit = () => (dispatch, getState) => {
  const { wordList, rowKey, allGuesses } = getState();
  let { colors, word } = {...allGuesses[rowKey]};
  const newGuesses = [...allGuesses];
  const newColors = [...colors];
  const newLocks = Array(5).fill(false);

  const newList = eliminateWords(word, [...wordList], colors);

  if (newList[0] == wordList[0]) {
    dispatch({ type: ERROR_MESSAGE, payload: wordListError });
  } else {
    word = newList[0];

    for (let i = 0; i < colors.length; i++) {
      if (colors[i] === "green") {
        newLocks[i] = true;
      } else {
        newColors[i] = defaultColor;
      }
    }

    const newGuess = {
      colors: newColors,
      locks: newLocks,
      word: word
    };
    newGuesses[rowKey].locks = Array(5).fill(true);
    newGuesses[rowKey+1] = newGuess;

    // Possible new list
    const wordValue = (word, letterPercent) => {
        var value = 0;
    
        for( let i=0; i<word.length; i++ ) {
          value += letterPercent[word[i]]
        }
        
        return value;
    }

    const test = { letterCount: {}, letterPercent: {}, letters: 0 };
    var p = 0;

    newList.forEach(word => {
      for (let i=0; i<word.length; i++) {
        test.letterCount[word[i]] = test.letterCount[word[i]] != null ? test.letterCount[word[0]]+1 : 1;
        test.letters += 1;
      }
    });

    Object.keys(test.letterCount).forEach(letter => {
      test.letterPercent[letter] = test.letterCount[letter] / test.letters;
      p += test.letterPercent[letter]
    });

    const refinedList = [...newList].sort((a, b) => {
      return wordValue(a, test.letterPercent) - wordValue(b, test.letterPercent)
    })

    console.log(refinedList.reverse())


    //


    dispatch({ type: ROW_KEY, payload: rowKey + 1 });
    dispatch({ type: GUESSES, payload: newGuesses });
    dispatch({ type: WORDS_LIST_TYPE, payload: newList });
  }
}




// External function which eliminates words from word list
const eliminateWords = (selectedWord, wordList, colors) => {
  // Functions
  const replaceLetter = (word, index) => {
    return word.substring(0, index) + "0" + word.substring(index+1, word.length);
  }

  // Variables
  const newList = [];
  const oldList = [...wordList];
  const colorValues = {}

  // Sorts letter to respective color value
  for (let i = 0; i < selectedWord.length; i++) {
    if (!colorValues[colors[i]]) {
      colorValues[colors[i]] = [i];
    } else colorValues[colors[i]].push(i);
  }
  
  // Finds words that fit parameters
  wordList.forEach(word => {
    let possibleWord = true;
    let checkedWord = word;


    try { // Checks letter color values
      // Green Letter
      if (colorValues[colorChoices[0]]) {
        colorValues[colorChoices[0]].forEach(index => {
          if (checkedWord[index] != selectedWord[index]) {
           throw "Cannot be this word";
          }
          else {
            checkedWord = replaceLetter(checkedWord, index);
          }
        });
      }

      // Yellow Letter
      if (colorValues[colorChoices[1]]) {
        colorValues[colorChoices[1]].forEach(index => {
          if (checkedWord.indexOf(selectedWord[index]) == -1 || checkedWord[index] == selectedWord[index]) {
            throw "Cannot be this word";
          }
          else {
            checkedWord = replaceLetter(checkedWord, checkedWord.indexOf(selectedWord[index]));
          }
        });
      }

      // Grey Letter
      if (colorValues[colorChoices[2]]) {
        colorValues[colorChoices[2]].forEach(index => {
          if (checkedWord.indexOf(selectedWord[index]) > -1) {
            throw "Cannot be this word";
          }
        });
      }
    }
    catch(error) { // When the word is not a possible word
      possibleWord = false;
    }
    finally { // When the word is a possible word
      if (possibleWord) {
        newList.push(word);
      }
    }
  });
  
  // Returns list to be used
  if (newList.length === 0) {
    return oldList;
  }
  else {
    return newList;
  }
}