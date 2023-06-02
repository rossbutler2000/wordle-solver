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


    dispatch({ type: ROW_KEY, payload: rowKey + 1 });
    dispatch({ type: GUESSES, payload: newGuesses });
    dispatch({ type: WORDS_LIST_TYPE, payload: newList });
  }
}


// External function which eliminates words from word list
const eliminateWords = (selectedWord, wordList, colors) => {
  const newList = [];
  const oldList = [...wordList];

  wordList.splice(wordList.indexOf(selectedWord), 1);
  
  wordList.forEach(word => {
    let end = false;

    for (let i = 0; i < word.length; i++) {
      const ignore = {};

      switch (colors[i]) {
        case colorChoices[0]:
          if (word[i] != selectedWord[i]) {
            end = true;
          }
          break;
        
        case colorChoices[1]:
          if (word.indexOf(selectedWord[i]) == -1) {
            end = true;
          } else if (word[i] == selectedWord[i]) {
            end = true;
          } else ignore[word[i]] = true;
          break;

          //Add an or statement if the letter is in the word in another place
        case colorChoices[2]:
          if (!ignore[word[i]]) {
            if (word.indexOf(selectedWord[i]) > -1) {
              end = true;
            }
          }
          break;

        default:
          console.log("This should never happen");
      }

      if (end) break;
    }

    if (!end) {
      newList.push(word);
    }
  });

  if (newList.length === 0) {
    return oldList;
  }

  return newList;
}
