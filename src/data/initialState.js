import { WORD_LIST } from "./WORDLIST";


export const defaultColor = "black";
export const allGuesses = [
  { colors: Array(5).fill(defaultColor),
    locks: Array(5).fill(false),
    word: WORD_LIST[0],
  },
  ...Array(5).fill(
    {
      colors: Array(5).fill(defaultColor),
      locks: Array(5).fill(true),
      word: "     "
    }
  )
];
export const bufferSize = window.innerWidth < 1200 ? 3 : 4;
export const colorChoices = ["green", "yellow", "grey"];
export const errorMessage = "";
export const firstSearchWord = "";
export const inputError = "input"
export const startingRowKey = 0;
export const successMessage = false;
export const wordListError = "wordList";
export const wordList = [...WORD_LIST];