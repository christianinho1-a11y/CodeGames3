// cs-wordle.js
// CS Wordle – 5-letter CS term guessing game

const WORDS = [
  "array",
  "stack",
  "queue",
  "class",
  "logic",
  "scope",
  "input",
  "bytes",
  "float",
  "loops",
  "graph",
  "merge",
  "cache",
  "debug",
  "token",
  "ascii",
  "linux",
  "parse",
  "build",
];

const MAX_ROWS = 6;
const WORD_LENGTH = 5;

let currentWord = "";
let currentRow = 0;
let currentCol = 0;
let gameOver = false;

let gridEl;
let keyboardEl;
let messageEl;
let newBtnEl;
let backBtnEl;

const tileGrid = [];
const keyStatus = new Map();

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "←"],
];

const normalize = (value) => value.trim().toLowerCase();

const setMessage = (text, tone = "") => {
  messageEl.textContent = text;
  messageEl.className = `wordle-message ${tone}`.trim();
};

const pickWord = () => {
  const nextIndex = Math.floor(Math.random() * WORDS.length);
  return WORDS[nextIndex];
};

const buildGrid = () => {
  gridEl.innerHTML = "";
  tileGrid.length = 0;

  for (let row = 0; row < MAX_ROWS; row += 1) {
    const rowEl = document.createElement("div");
    rowEl.className = "wordle-row";

    const rowTiles = [];
    for (let col = 0; col < WORD_LENGTH; col += 1) {
      const tile = document.createElement("div");
      tile.className = "wordle-tile";
      rowEl.appendChild(tile);
      rowTiles.push(tile);
    }

    gridEl.appendChild(rowEl);
    tileGrid.push(rowTiles);
  }
};

const buildKeyboard = () => {
  keyboardEl.innerHTML = "";

  keyboardRows.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "wordle-keyboard-row";

    row.forEach((key) => {
      const keyBtn = document.createElement("button");
      keyBtn.type = "button";
      keyBtn.className = "wordle-key";
      keyBtn.dataset.key = key;
      keyBtn.textContent = key;
      keyBtn.addEventListener("click", () => handleKeyPress(key));
      rowEl.appendChild(keyBtn);
    });

    keyboardEl.appendChild(rowEl);
  });
};

const updateKeyboard = (letter, status) => {
  const currentStatus = keyStatus.get(letter) || "";
  const priority = { correct: 3, present: 2, absent: 1, "": 0 };

  if (priority[status] <= priority[currentStatus]) {
    return;
  }

  keyStatus.set(letter, status);
  const keyButton = keyboardEl.querySelector(`[data-key="${letter.toUpperCase()}"]`);
  if (keyButton) {
    keyButton.classList.remove("correct", "present", "absent");
    if (status) {
      keyButton.classList.add(status);
    }
  }
};

const getGuess = (row) =>
  tileGrid[row].map((tile) => tile.textContent || "").join("");

const handleLetter = (letter) => {
  if (gameOver || currentCol >= WORD_LENGTH) {
    return;
  }

  const tile = tileGrid[currentRow][currentCol];
  tile.textContent = letter.toUpperCase();
  tile.classList.add("filled");
  currentCol += 1;
};

const handleBackspace = () => {
  if (gameOver || currentCol === 0) {
    return;
  }

  currentCol -= 1;
  const tile = tileGrid[currentRow][currentCol];
  tile.textContent = "";
  tile.classList.remove("filled");
};

const evaluateGuess = (guess) => {
  const answer = currentWord.split("");
  const guessLetters = guess.split("");
  const status = Array(WORD_LENGTH).fill("absent");
  const remaining = {};

  answer.forEach((letter) => {
    remaining[letter] = (remaining[letter] || 0) + 1;
  });

  guessLetters.forEach((letter, index) => {
    if (letter === answer[index]) {
      status[index] = "correct";
      remaining[letter] -= 1;
    }
  });

  guessLetters.forEach((letter, index) => {
    if (status[index] === "correct") {
      return;
    }
    if (remaining[letter] > 0) {
      status[index] = "present";
      remaining[letter] -= 1;
    }
  });

  return status;
};

const handleSubmit = () => {
  if (gameOver) {
    return;
  }

  const guess = getGuess(currentRow);
  if (guess.length < WORD_LENGTH) {
    setMessage("Type a 5-letter word before submitting.", "warning");
    return;
  }

  const normalized = normalize(guess);
  if (!WORDS.includes(normalized)) {
    setMessage("That word isn't in the CS list yet.", "warning");
    return;
  }

  const statuses = evaluateGuess(normalized);
  statuses.forEach((status, index) => {
    const tile = tileGrid[currentRow][index];
    tile.classList.add(status);
    updateKeyboard(guess[index], status);
  });

  if (normalized === currentWord) {
    setMessage("Nice! You solved the CS Wordle.", "success");
    gameOver = true;
    return;
  }

  if (currentRow === MAX_ROWS - 1) {
    setMessage(`Out of tries! The word was "${currentWord.toUpperCase()}".`, "warning");
    gameOver = true;
    return;
  }

  currentRow += 1;
  currentCol = 0;
  setMessage("");
};

const handleKeyPress = (key) => {
  if (key === "ENTER") {
    handleSubmit();
    return;
  }

  if (key === "←" || key === "BACKSPACE") {
    handleBackspace();
    return;
  }

  if (/^[A-Z]$/.test(key)) {
    handleLetter(key);
  }
};

const resetGame = () => {
  currentWord = pickWord();
  currentRow = 0;
  currentCol = 0;
  gameOver = false;
  keyStatus.clear();
  buildGrid();
  buildKeyboard();
  setMessage("");
};

const initWordle = () => {
  gridEl = document.getElementById("wordleGrid");
  keyboardEl = document.getElementById("wordleKeyboard");
  messageEl = document.getElementById("wordleMessage");
  newBtnEl = document.getElementById("wordleNewBtn");
  backBtnEl = document.getElementById("wordleBackBtn");

  if (!gridEl || !keyboardEl || !messageEl || !newBtnEl || !backBtnEl) {
    return;
  }

  newBtnEl.addEventListener("click", resetGame);
  backBtnEl.addEventListener("click", () => {
    window.location.href = "cs_games.html";
  });

  window.addEventListener("keydown", (event) => {
    const key = event.key.toUpperCase();
    if (key === "ENTER" || key === "BACKSPACE") {
      event.preventDefault();
      handleKeyPress(key);
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      handleKeyPress(key);
    }
  });

  resetGame();
};

window.addEventListener("DOMContentLoaded", initWordle);
