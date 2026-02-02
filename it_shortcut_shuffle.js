const SHORTCUT_ROUNDS = [
  {
    prompt: "Copy selected text",
    options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z"],
    answerIndex: 0,
    tip: "Copy is Ctrl + C on Windows/Chromebook.",
  },
  {
    prompt: "Paste",
    options: ["Ctrl + V", "Ctrl + P", "Ctrl + S", "Ctrl + F"],
    answerIndex: 0,
    tip: "Paste uses Ctrl + V.",
  },
  {
    prompt: "Cut",
    options: ["Ctrl + X", "Ctrl + B", "Ctrl + D", "Ctrl + N"],
    answerIndex: 0,
    tip: "Cut removes and copies using Ctrl + X.",
  },
  {
    prompt: "Undo",
    options: ["Ctrl + Z", "Ctrl + Y", "Ctrl + A", "Ctrl + L"],
    answerIndex: 0,
    tip: "Undo uses Ctrl + Z.",
  },
  {
    prompt: "Redo",
    options: ["Ctrl + Y", "Ctrl + Z", "Ctrl + K", "Ctrl + T"],
    answerIndex: 0,
    tip: "Redo uses Ctrl + Y.",
  },
  {
    prompt: "Select all",
    options: ["Ctrl + A", "Ctrl + W", "Ctrl + G", "Ctrl + R"],
    answerIndex: 0,
    tip: "Select all uses Ctrl + A.",
  },
  {
    prompt: "Find on page",
    options: ["Ctrl + F", "Ctrl + H", "Ctrl + U", "Ctrl + M"],
    answerIndex: 0,
    tip: "Find uses Ctrl + F.",
  },
  {
    prompt: "Save",
    options: ["Ctrl + S", "Ctrl + O", "Ctrl + P", "Ctrl + Shift + S"],
    answerIndex: 0,
    tip: "Save uses Ctrl + S.",
  },
  {
    prompt: "Open file",
    options: ["Ctrl + O", "Ctrl + S", "Ctrl + N", "Ctrl + P"],
    answerIndex: 0,
    tip: "Open uses Ctrl + O.",
  },
  {
    prompt: "New tab (browser)",
    options: ["Ctrl + T", "Ctrl + L", "Ctrl + D", "Ctrl + B"],
    answerIndex: 0,
    tip: "New tab uses Ctrl + T.",
  },
];

const MAX_STRIKES = 3;
const LEADERBOARD_KEY = "it_shortcut_shuffle_leaderboard";

let currentIndex = 0;
let score = 0;
let strikes = 0;
let correctCount = 0;
let playerName = "";
let roundOver = false;
let scoreSaved = false;

const elements = {};

const setMessage = (text, tone = "") => {
  elements.message.textContent = text;
  elements.message.className = `quiz-message ${tone}`.trim();
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
  elements.leaderboard.innerHTML = "";

  if (!entries.length) {
    const empty = document.createElement("li");
    empty.textContent = "No scores yet. Be the first!";
    elements.leaderboard.appendChild(empty);
    return;
  }

  entries
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = `${entry.name} — ${entry.score} pts — ${entry.correct} correct`;
      elements.leaderboard.appendChild(item);
    });
};

const saveScore = () => {
  if (scoreSaved) {
    return;
  }
  const entries = loadLeaderboard();
  entries.push({
    name: playerName,
    score,
    correct: correctCount,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  scoreSaved = true;
};

const updateScoreboard = () => {
  elements.score.textContent = score;
  elements.strikes.textContent = strikes;
  elements.progress.textContent = `${Math.min(currentIndex + 1, SHORTCUT_ROUNDS.length)} / ${SHORTCUT_ROUNDS.length}`;
};

const renderOptions = (round) => {
  elements.options.innerHTML = "";
  round.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(index));
    button.disabled = roundOver;
    elements.options.appendChild(button);
  });
};

const showRound = () => {
  const round = SHORTCUT_ROUNDS[currentIndex];
  if (!round) {
    return;
  }
  elements.prompt.textContent = round.prompt;
  renderOptions(round);
  setMessage("", "");
  elements.nextBtn.disabled = true;
  updateScoreboard();
};

const endRound = (message) => {
  roundOver = true;
  setMessage(message, "info");
  elements.nextBtn.disabled = true;
  saveScore();
};

const handleAnswer = (index) => {
  if (roundOver) {
    return;
  }
  const round = SHORTCUT_ROUNDS[currentIndex];
  if (!round) {
    return;
  }

  if (index === round.answerIndex) {
    score += 10;
    correctCount += 1;
    setMessage(`Correct! ${round.tip}`, "success");
  } else {
    strikes += 1;
    setMessage(`Strike! ${round.tip}`, "warning");
  }

  if (strikes >= MAX_STRIKES) {
    endRound("Round over — you ran out of strikes.");
    return;
  }

  if (currentIndex >= SHORTCUT_ROUNDS.length - 1) {
    endRound("You finished the round! Nice shortcut memory.");
    return;
  }

  elements.nextBtn.disabled = false;
  updateScoreboard();
};

const nextRound = () => {
  if (roundOver) {
    return;
  }
  currentIndex += 1;
  showRound();
};

const startRound = () => {
  if (!playerName) {
    elements.nameModal.classList.remove("hidden");
    elements.nameInput.focus();
    return;
  }
  currentIndex = 0;
  score = 0;
  strikes = 0;
  correctCount = 0;
  roundOver = false;
  scoreSaved = false;
  showRound();
};

const startGame = () => {
  const nameValue = elements.nameInput.value.trim();
  if (!nameValue) {
    elements.nameMessage.textContent = "Please enter your name to start.";
    elements.nameMessage.className = "form-note warning";
    return;
  }
  playerName = nameValue;
  elements.nameMessage.textContent = "";
  elements.nameMessage.className = "form-note";
  elements.nameModal.classList.add("hidden");
  startRound();
};

const init = () => {
  elements.nameModal = document.getElementById("shortcutNameModal");
  elements.nameInput = document.getElementById("shortcutModalName");
  elements.nameMessage = document.getElementById("shortcutModalMessage");
  elements.modalStart = document.getElementById("shortcutModalStart");
  elements.prompt = document.getElementById("shortcutPrompt");
  elements.score = document.getElementById("shortcutScore");
  elements.strikes = document.getElementById("shortcutStrikes");
  elements.progress = document.getElementById("shortcutProgress");
  elements.options = document.getElementById("shortcutOptions");
  elements.message = document.getElementById("shortcutMessage");
  elements.startBtn = document.getElementById("shortcutStartBtn");
  elements.nextBtn = document.getElementById("shortcutNextBtn");
  elements.leaderboard = document.getElementById("shortcutLeaderboard");

  if (Object.values(elements).some((el) => !el)) {
    return;
  }

  updateLeaderboardUI();
  elements.nameModal.classList.remove("hidden");
  elements.modalStart.addEventListener("click", startGame);
  elements.startBtn.addEventListener("click", startRound);
  elements.nextBtn.addEventListener("click", nextRound);
};

window.addEventListener("DOMContentLoaded", init);
