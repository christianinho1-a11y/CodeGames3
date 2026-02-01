// binary_blaster.js

const MAX_STRIKES = 3;
const ROUND_LENGTH = 10;
const LEADERBOARD_KEY = "binary_blaster_leaderboard";

const MODES = {
  binaryToDecimal: {
    label: "Binary → Decimal",
    prompt: (binary) => `Convert ${binary} to decimal.`,
    formatAnswer: (value) => String(value),
  },
  decimalToBinary: {
    label: "Decimal → Binary",
    prompt: (decimal) => `Convert ${decimal} to binary.`,
    formatAnswer: (value) => value.toString(2),
  },
};

const DIFFICULTY = {
  easy: { label: "Easy", multiplier: 1, showBits: true },
  hard: { label: "Hard", multiplier: 2, showBits: false },
};

let score = 0;
let streak = 0;
let strikes = 0;
let currentIndex = 0;
let roundProblems = [];
let waitingForNext = false;
let playerName = "";
let scoreSaved = false;
let currentMode = "binaryToDecimal";
let currentDifficulty = "easy";

let modeLabelEl;
let scoreEl;
let streakEl;
let progressEl;
let strikesEl;
let promptEl;
let messageEl;
let summaryEl;
let startMessageEl;
let nextBtnEl;
let restartBtnEl;
let backBtnEl;
let submitBtnEl;
let startBtnEl;
let playerNameEl;
let modeSelectEl;
let leaderboardEl;
let binaryGroupEl;
let decimalGroupEl;
let binaryInputs = [];
let decimalInputs = [];
let easyBtnEl;
let hardBtnEl;
let bitLabelsEl;

const setMessage = (text, tone = "") => {
  messageEl.textContent = text;
  messageEl.className = `binary-message ${tone}`.trim();
};

const setSummary = (text, tone = "") => {
  summaryEl.textContent = text;
  summaryEl.className = `binary-summary ${tone}`.trim();
};

const setStartMessage = (text, tone = "") => {
  startMessageEl.textContent = text;
  startMessageEl.className = `form-note ${tone}`.trim();
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
      item.textContent = `${entry.name} — ${entry.mode} — ${entry.score} pts`;
      leaderboardEl.appendChild(item);
    });
};

const saveScore = () => {
  if (scoreSaved) {
    return;
  }
  const entries = loadLeaderboard();
  entries.push({
    name: playerName,
    mode: MODES[currentMode].label,
    score,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  scoreSaved = true;
};

const updateScoreboard = () => {
  modeLabelEl.textContent = MODES[currentMode].label;
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  strikesEl.textContent = strikes;
  progressEl.textContent = `${currentIndex + 1} / ${ROUND_LENGTH}`;
};

const updateDifficultyUI = () => {
  easyBtnEl.classList.toggle("active", currentDifficulty === "easy");
  hardBtnEl.classList.toggle("active", currentDifficulty === "hard");
  bitLabelsEl.hidden = !DIFFICULTY[currentDifficulty].showBits;
};

const buildProblems = () => {
  const values = [];
  while (values.length < ROUND_LENGTH) {
    const next = Math.floor(Math.random() * 31) + 1;
    if (!values.includes(next)) {
      values.push(next);
    }
  }
  return values.map((value) => ({
    decimal: value,
    binary: value.toString(2).padStart(8, "0"),
  }));
};

const toggleAnswerGroups = () => {
  if (currentMode === "binaryToDecimal") {
    decimalGroupEl.hidden = false;
    binaryGroupEl.hidden = true;
  } else {
    decimalGroupEl.hidden = true;
    binaryGroupEl.hidden = false;
  }
};

const resetBinaryInputs = () => {
  binaryInputs.forEach((input) => {
    input.value = "0";
    input.disabled = false;
  });
};

const resetDecimalInputs = () => {
  decimalInputs.forEach((input) => {
    input.value = "0";
    input.disabled = false;
  });
};

const renderProblem = () => {
  const problem = roundProblems[currentIndex];
  if (currentMode === "binaryToDecimal") {
    promptEl.textContent = MODES[currentMode].prompt(problem.binary);
  } else {
    promptEl.textContent = MODES[currentMode].prompt(problem.decimal);
  }
  toggleAnswerGroups();
  resetBinaryInputs();
  resetDecimalInputs();
  submitBtnEl.disabled = false;
  nextBtnEl.disabled = true;
  waitingForNext = false;
  setMessage("");
  updateScoreboard();
  const firstInput =
    currentMode === "binaryToDecimal" ? decimalInputs[0] : binaryInputs[0];
  if (firstInput) {
    firstInput.focus();
  }
};

const endRound = (summaryText) => {
  setSummary(summaryText, "info");
  binaryInputs.forEach((input) => {
    input.disabled = true;
  });
  decimalInputs.forEach((input) => {
    input.disabled = true;
  });
  submitBtnEl.disabled = true;
  nextBtnEl.disabled = true;
  saveScore();
};

const normalizeAnswer = (value) => value.trim().toLowerCase();

const normalizeDecimal = (value) => {
  const stripped = value.replace(/^0+(?=\d)/, "");
  return stripped === "" ? "0" : stripped;
};

const readBinaryAnswer = () => binaryInputs.map((input) => input.value).join("");

const readDecimalAnswer = () => {
  const joined = decimalInputs.map((input) => input.value).join("");
  return normalizeDecimal(joined);
};

const handleSubmit = () => {
  if (waitingForNext) {
    return;
  }

  const answer =
    currentMode === "binaryToDecimal"
      ? readDecimalAnswer()
      : readBinaryAnswer();
  if (!answer) {
    setMessage("Type an answer before submitting.", "warning");
    return;
  }

  const problem = roundProblems[currentIndex];
  const expected =
    currentMode === "binaryToDecimal"
      ? String(problem.decimal)
      : problem.binary;

  if (answer === expected) {
    streak += 1;
    score += (10 + streak * 2) * DIFFICULTY[currentDifficulty].multiplier;
    setMessage("Correct! Nice conversion.", "success");
  } else {
    strikes += 1;
    streak = 0;
    setMessage(`Incorrect — correct answer: ${expected}.`, "warning");
  }

  waitingForNext = true;
  binaryInputs.forEach((input) => {
    input.disabled = true;
  });
  decimalInputs.forEach((input) => {
    input.disabled = true;
  });
  submitBtnEl.disabled = true;
  nextBtnEl.disabled = false;
  updateScoreboard();

  if (strikes >= MAX_STRIKES) {
    endRound("Round over — you reached 3 strikes.");
  }

  if (currentIndex === ROUND_LENGTH - 1) {
    endRound(`Round complete! Final score: ${score}.`);
  }
};

const handleNext = () => {
  if (!waitingForNext || strikes >= MAX_STRIKES) {
    return;
  }

  if (currentIndex >= ROUND_LENGTH - 1) {
    return;
  }

  currentIndex += 1;
  renderProblem();
};

const startRound = () => {
  const nameValue = playerNameEl.value.trim();
  if (!nameValue) {
    setStartMessage("Enter your name before starting.", "warning");
    return;
  }

  playerName = nameValue;
  currentMode = modeSelectEl.value;
  currentDifficulty = hardBtnEl.classList.contains("active") ? "hard" : "easy";
  roundProblems = buildProblems();
  score = 0;
  streak = 0;
  strikes = 0;
  currentIndex = 0;
  scoreSaved = false;
  setStartMessage("");
  setSummary("");
  updateDifficultyUI();
  renderProblem();
};

const initGame = () => {
  modeLabelEl = document.getElementById("binaryModeLabel");
  scoreEl = document.getElementById("binaryScore");
  streakEl = document.getElementById("binaryStreak");
  progressEl = document.getElementById("binaryProgress");
  strikesEl = document.getElementById("binaryStrikes");
  promptEl = document.getElementById("binaryPrompt");
  messageEl = document.getElementById("binaryMessage");
  summaryEl = document.getElementById("binarySummary");
  startMessageEl = document.getElementById("binaryStartMessage");
  nextBtnEl = document.getElementById("binaryNextBtn");
  restartBtnEl = document.getElementById("binaryRestartBtn");
  backBtnEl = document.getElementById("binaryBackBtn");
  submitBtnEl = document.getElementById("binarySubmitBtn");
  startBtnEl = document.getElementById("binaryStartBtn");
  playerNameEl = document.getElementById("binaryPlayerName");
  modeSelectEl = document.getElementById("binaryModeSelect");
  leaderboardEl = document.getElementById("binaryLeaderboard");
  binaryGroupEl = document.getElementById("binaryAnswerBinary");
  decimalGroupEl = document.getElementById("binaryAnswerDecimal");
  easyBtnEl = document.getElementById("binaryEasyBtn");
  hardBtnEl = document.getElementById("binaryHardBtn");
  bitLabelsEl = document.getElementById("binaryBitLabels");
  binaryInputs = Array.from(binaryGroupEl?.querySelectorAll(".binary-box") || []);
  decimalInputs = Array.from(decimalGroupEl?.querySelectorAll(".binary-box") || []);

  if (
    !modeLabelEl ||
    !scoreEl ||
    !streakEl ||
    !progressEl ||
    !strikesEl ||
    !promptEl ||
    !messageEl ||
    !summaryEl ||
    !startMessageEl ||
    !nextBtnEl ||
    !restartBtnEl ||
    !backBtnEl ||
    !submitBtnEl ||
    !startBtnEl ||
    !playerNameEl ||
    !modeSelectEl ||
    !leaderboardEl ||
    !binaryGroupEl ||
    !decimalGroupEl ||
    binaryInputs.length === 0 ||
    decimalInputs.length === 0 ||
    !easyBtnEl ||
    !hardBtnEl ||
    !bitLabelsEl
  ) {
    return;
  }

  updateLeaderboardUI();
  updateScoreboard();
  resetBinaryInputs();
  resetDecimalInputs();
  toggleAnswerGroups();
  updateDifficultyUI();

  easyBtnEl.addEventListener("click", () => {
    currentDifficulty = "easy";
    updateDifficultyUI();
  });

  hardBtnEl.addEventListener("click", () => {
    currentDifficulty = "hard";
    updateDifficultyUI();
  });

  binaryInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (!["0", "1"].includes(input.value)) {
        input.value = "0";
      }
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    });
  });
  decimalInputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (!/^[0-9]$/.test(input.value)) {
        input.value = "0";
      }
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    });
  });

  submitBtnEl.addEventListener("click", handleSubmit);
  nextBtnEl.addEventListener("click", handleNext);
  restartBtnEl.addEventListener("click", startRound);
  startBtnEl.addEventListener("click", startRound);
  backBtnEl.addEventListener("click", () => {
    window.location.href = "cs_games.html";
  });
};

window.addEventListener("DOMContentLoaded", initGame);
