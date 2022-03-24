import { combineReducers } from "redux";
import _ from "lodash";

import { WORD_LIST } from "../data/WORDLIST";

import {
  allGuesses,
  bufferSize,
  errorMessage,
  firstSearchWord,
  startingRowKey,
  successMessage
} from "../data/initialState";
import {
  BUFFER_SIZE,
  ERROR_MESSAGE,
  GUESSES,
  ROW_KEY,
  SEARCH_WORD,
  SUCCESS_MESSAGE,
  WORDS_LIST_TYPE
} from "../types";


const allGuessesReducer = (guesses = allGuesses, action) => {
  if (action.type === GUESSES) {
    return [...action.payload];
  }

  return [...guesses];
}

const bufferSizeReducer = (size = bufferSize, action) => {
  if (action.type === BUFFER_SIZE) {
    return action.payload;
  }

  return size;
}

const showErrorMessageReducer = (error = errorMessage, action) => {
  if (action.type === ERROR_MESSAGE) {
    return action.payload;
  }

  return error;
}

const showSuccessMessageReducer = (success = successMessage, action) => {
  if (action.type === SUCCESS_MESSAGE) {
    return action.payload;
  }

  return success;
}

const searchWordReducer = (searchWord = firstSearchWord, action) => {
  if (action.type === SEARCH_WORD) {
    return action.payload;
  }

  return searchWord;
}

const wordListReducer = (wordList = WORD_LIST, action) => {
  if (action.type === WORDS_LIST_TYPE) {
    return [...action.payload];
  }

  return [...wordList];
}

const rowKeyReducer = (key = startingRowKey, action) => {
  if (action.type === ROW_KEY) {
    return action.payload;
  }

  return key;
}

export default combineReducers({
  allGuesses: allGuessesReducer,
  bufferSize: bufferSizeReducer,
  errorMessageValue: showErrorMessageReducer,
  rowKey: rowKeyReducer,
  searchWord: searchWordReducer,
  successMessageValue: showSuccessMessageReducer,
  wordList: wordListReducer
});