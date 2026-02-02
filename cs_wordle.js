// cs-wordle.js
// CS Wordle – 5-letter CS term guessing game

const WORD_BANK = {
  cs: [
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
  ],
  it: [
    "login",
    "panel",
    "cable",
    "cloud",
    "email",
    "proxy",
    "drive",
    "patch",
    "spool",
    "audit",
    "token",
    "spare",
    "linux",
    "power",
    "print",
    "mouse",
    "sheet",
    "excel",
    "video",
    "emoji",
    "tweet",
    "reels",
    "pixel",
    "files",
    "media",
    "games",
    "array",
    "cache",
    "click",
    "robot",
    "macro",
    "hyper",
    "valid",
    "debug",
    "stack",
    "input",
    "track",
    "graph",
    "alert",
    "blend",
    "focus",
    "boost",
    "trend",
    "modal",
    "frame",
    "wired",
    "swipe",
    "sound",
    "laser",
    "audio",
    "query",
    "table",
    "index",
    "merge",
    "share",
    "syncs",
    "class",
    "build",
    "draft",
    "coder",
    "bytes",
    "logic",
    "shift",
    "enter",
    "space",
    "scope",
    "timer",
    "stats",
    "touch",
    "smart",
    "store",
    "entry",
    "forum",
    "notes",
    "grade",
    "plain",
  ],
  cyber: [
    "phish",
    "virus",
    "spoof",
    "steal",
    "adwar",
    "malwr",
    "alert",
    "audit",
    "honey",
    "trace",
    "cloak",
    "spear",
    "crypt",
    "token",
    "proxy",
    "vault",
  ],
  essentials: [
    "video",
    "reels",
    "trend",
    "viral",
    "memes",
    "story",
    "likes",
    "share",
    "click",
    "swipe",
    "emoji",
    "audio",
    "watch",
    "sound",
    "media",
    "score",
    "match",
    "party",
    "group",
    "coach",
    "photo",
    "music",
    "track",
    "beats",
    "dance",
    "skate",
    "board",
    "pixel",
    "chats",
    "skins",
    "badge",
    "level",
    "quest",
    "boost",
    "speed",
    "trick",
    "check",
    "timer",
    "focus",
    "trend",
    "pings",
    "faves",
    "clips",
    "party",
    "media",
    "games",
    "chats",
    "reply",
    "posty",
  ],
};

const MAX_ROWS = 6;
const WORD_LENGTH = 5;
const LEADERBOARD_KEY = "cs_wordle_leaderboard";
const DAILY_KEY_PREFIX = "cs_wordle_daily";
const DAILY_MODE = "daily";
const PRACTICE_MODE = "practice";

let currentWord = "";
let currentRow = 0;
let currentCol = 0;
let gameOver = false;
let gameStarted = false;
let playerName = "";
let scoreSaved = false;
let currentTopic = "all";
let activeWords = [];
let playMode = PRACTICE_MODE;

let gridEl;
let keyboardEl;
let messageEl;
let newBtnEl;
let backBtnEl;
let startBtnEl;
let statusTitleEl;
let topicSelectEl;
let backLinkEl;
let nameModalEl;
let modalNameInputEl;
let modalMessageEl;
let modalStartBtnEl;
let leaderboardEl;

const tileGrid = [];
const keyStatus = new Map();

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "←"],
];

const normalize = (value) => value.trim().toLowerCase();
const validTopic = (topic) => ["all", "cs", "it", "cyber", "essentials"].includes(topic);
const validMode = (mode) => [DAILY_MODE, PRACTICE_MODE].includes(mode);

const topicLabels = {
  all: "All Topics",
  cs: "Computer Science",
  it: "Information Technology",
  cyber: "Cybersecurity",
  essentials: "Computer Essentials",
};

const getTopicFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic");
  return validTopic(topic) ? topic : "all";
};

const getModeFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  return validMode(mode) ? mode : PRACTICE_MODE;
};

const getBackLinkFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("from") || "cs_games.html";
};

const getBackLabel = (href) => {
  if (href.includes("it_games")) {
    return "IT Games";
  }
  if (href.includes("computer_essentials")) {
    return "Computer Essentials";
  }
  if (href.includes("cyber_games")) {
    return "Cyber Games";
  }
  return "CS Games";
};

const getTodayKey = () => new Date().toISOString().split("T")[0];

const getDailyKey = () => {
  if (!playerName) {
    return "";
  }
  return `${DAILY_KEY_PREFIX}_${currentTopic}_${playerName.toLowerCase()}_${getTodayKey()}`;
};

const hasPlayedToday = () => {
  if (playMode !== DAILY_MODE) {
    return false;
  }
  const key = getDailyKey();
  return key ? localStorage.getItem(key) === "done" : false;
};

const markPlayedToday = () => {
  if (playMode !== DAILY_MODE) {
    return;
  }
  const key = getDailyKey();
  if (key) {
    localStorage.setItem(key, "done");
  }
};

const setMessage = (text, tone = "") => {
  messageEl.textContent = text;
  messageEl.className = `wordle-message ${tone}`.trim();
};

const setModalMessage = (text, tone = "") => {
  modalMessageEl.textContent = text;
  modalMessageEl.className = `form-note ${tone}`.trim();
};

const loadLeaderboard = () => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLeaderboard = (entries) => {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
};

const updateLeaderboardUI = () => {
  const entries = loadLeaderboard();
  leaderboardEl.innerHTML = "";

  if (!entries.length) {
    const empty = document.createElement("li");
    empty.textContent = "No scores yet. Be the first!";
    leaderboardEl.appendChild(empty);
    return;
  }

  entries
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach((entry) => {
      const item = document.createElement("li");
      const topicLabel = topicLabels[entry.topic] || "All Topics";
      item.textContent = `${entry.name} — ${entry.result} — ${entry.score} pts — ${topicLabel}`;
      leaderboardEl.appendChild(item);
    });
};

const saveScore = (didWin) => {
  if (scoreSaved) {
    return;
  }
  const attemptsUsed = currentRow + 1;
  const score = didWin ? (MAX_ROWS - attemptsUsed + 1) * 10 : 0;
  const entries = loadLeaderboard();
  entries.push({
    name: playerName,
    result: didWin ? "Solved" : "Missed",
    score,
    topic: currentTopic,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  scoreSaved = true;
  markPlayedToday();
};

const getActiveWords = () => {
  if (currentTopic === "all") {
    const allWords = Object.values(WORD_BANK).flat();
    return Array.from(new Set(allWords));
  }
  return WORD_BANK[currentTopic] || [];
};

const pickWord = () => {
  if (!activeWords.length) {
    return "";
  }
  if (playMode === DAILY_MODE) {
    const seed = `${currentTopic}-${getTodayKey()}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
    }
    const nextIndex = hash % activeWords.length;
    return activeWords[nextIndex];
  }
  const nextIndex = Math.floor(Math.random() * activeWords.length);
  return activeWords[nextIndex];
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
      keyBtn.disabled = !gameStarted;
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
  if (!gameStarted || gameOver || currentCol >= WORD_LENGTH) {
    return;
  }

  const tile = tileGrid[currentRow][currentCol];
  tile.textContent = letter.toUpperCase();
  tile.classList.add("filled");
  currentCol += 1;
};

const handleBackspace = () => {
  if (!gameStarted || gameOver || currentCol === 0) {
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
  if (!gameStarted || gameOver) {
    return;
  }

  const guess = getGuess(currentRow);
  if (guess.length < WORD_LENGTH) {
    setMessage("Type a 5-letter word before submitting.", "warning");
    return;
  }

  const normalized = normalize(guess);
  

  const statuses = evaluateGuess(normalized);
  statuses.forEach((status, index) => {
    const tile = tileGrid[currentRow][index];
    tile.classList.add(status);
    updateKeyboard(guess[index], status);
  });

  if (normalized === currentWord) {
    setMessage("Nice! You solved the Wordle.", "success");
    gameOver = true;
    saveScore(true);
    return;
  }

  if (currentRow === MAX_ROWS - 1) {
    setMessage(`Out of tries! The word was "${currentWord.toUpperCase()}".`, "warning");
    gameOver = true;
    saveScore(false);
    return;
  }

  currentRow += 1;
  currentCol = 0;
  setMessage("");
};

const handleKeyPress = (key) => {
  if (!gameStarted) {
    return;
  }
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

const openNameModal = () => {
  nameModalEl.classList.remove("hidden");
  modalNameInputEl.focus();
};

const closeNameModal = () => {
  nameModalEl.classList.add("hidden");
};

const startRound = () => {
  if (!playerName) {
    openNameModal();
    return;
  }

  if (hasPlayedToday()) {
    const topicLabel = topicLabels[currentTopic] || "All Topics";
    setMessage(`Daily Wordle already completed for ${topicLabel}. Come back tomorrow.`, "warning");
    gameStarted = false;
    return;
  }

  currentWord = pickWord();
  if (!currentWord) {
    setMessage("No words available for this topic yet.", "warning");
    gameStarted = false;
    return;
  }
  currentRow = 0;
  currentCol = 0;
  gameOver = false;
  gameStarted = true;
  scoreSaved = false;
  keyStatus.clear();
  buildGrid();
  buildKeyboard();
  setMessage("");
};

const startGame = () => {
  const nameValue = modalNameInputEl.value.trim();
  if (!nameValue) {
    setModalMessage("Please enter your name to start.", "warning");
    return;
  }
  playerName = nameValue;
  setModalMessage("");
  closeNameModal();
  startRound();
};

const updateTopicUI = () => {
  const label = topicLabels[currentTopic] || "All Topics";
  const modeLabel = playMode === DAILY_MODE ? "Daily" : "Practice";
  statusTitleEl.textContent = `Wordle — ${label} (${modeLabel})`;
};

const applyTopic = (topic, resetRound = false) => {
  currentTopic = validTopic(topic) ? topic : "all";
  activeWords = getActiveWords();
  updateTopicUI();
  if (resetRound && playerName) {
    startRound();
  }
};

const initWordle = () => {
  gridEl = document.getElementById("wordleGrid");
  keyboardEl = document.getElementById("wordleKeyboard");
  messageEl = document.getElementById("wordleMessage");
  newBtnEl = document.getElementById("wordleNewBtn");
  backBtnEl = document.getElementById("wordleBackBtn");
  startBtnEl = document.getElementById("wordleStartBtn");
  statusTitleEl = document.getElementById("wordleStatusTitle");
  topicSelectEl = document.getElementById("wordleTopic");
  backLinkEl = document.getElementById("wordleBackLink");
  nameModalEl = document.getElementById("wordleNameModal");
  modalNameInputEl = document.getElementById("wordleModalName");
  modalMessageEl = document.getElementById("wordleModalMessage");
  modalStartBtnEl = document.getElementById("wordleModalStart");
  leaderboardEl = document.getElementById("wordleLeaderboard");

  if (
    !gridEl ||
    !keyboardEl ||
    !messageEl ||
    !newBtnEl ||
    !backBtnEl ||
    !startBtnEl ||
    !nameModalEl ||
    !modalNameInputEl ||
    !modalMessageEl ||
    !modalStartBtnEl ||
    !leaderboardEl ||
    !statusTitleEl ||
    !topicSelectEl ||
    !backLinkEl
  ) {
    return;
  }

  backLinkEl.href = getBackLinkFromQuery();
  const backLabel = getBackLabel(backLinkEl.href);
  backLinkEl.textContent = `← Back to ${backLabel}`;
  playMode = getModeFromQuery();
  const initialTopic = getTopicFromQuery();
  topicSelectEl.value = initialTopic;
  applyTopic(initialTopic);
  if (playMode === DAILY_MODE) {
    topicSelectEl.disabled = true;
    newBtnEl.disabled = true;
  }

  updateLeaderboardUI();
  newBtnEl.addEventListener("click", startRound);
  startBtnEl.addEventListener("click", startRound);
  backBtnEl.addEventListener("click", () => {
    window.location.href = getBackLinkFromQuery();
  });
  backBtnEl.textContent = `← Back to ${backLabel}`;
  modalStartBtnEl.addEventListener("click", startGame);
  topicSelectEl.addEventListener("change", (event) => {
    applyTopic(event.target.value, true);
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

  buildGrid();
  buildKeyboard();
  openNameModal();
};

window.addEventListener("DOMContentLoaded", initWordle);
