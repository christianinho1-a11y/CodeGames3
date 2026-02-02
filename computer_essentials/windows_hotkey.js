const LEADERBOARD_KEY = "windows_hotkey_leaderboard";
const MAX_STRIKES = 3;

const LEVELS = {
  level1: {
    label: "Level 1 - Basics",
    timeLimit: 25,
    questions: [
      {
        prompt: "Copy selected text or files.",
        options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Alt + Tab"],
        answer: "Ctrl + C",
      },
      {
        prompt: "Paste copied content.",
        options: ["Ctrl + V", "Ctrl + P", "Ctrl + Z", "Windows + L"],
        answer: "Ctrl + V",
      },
      {
        prompt: "Take a screenshot and open Snipping Tool overlay.",
        options: ["Windows + Shift + S", "Windows + D", "Alt + Print Screen", "Ctrl + Shift + S"],
        answer: "Windows + Shift + S",
      },
      {
        prompt: "Open Task View (see open windows).",
        options: ["Windows + Tab", "Alt + Tab", "Ctrl + Alt + Del", "Windows + E"],
        answer: "Windows + Tab",
      },
      {
        prompt: "Lock the computer quickly.",
        options: ["Windows + L", "Ctrl + L", "Alt + F4", "Windows + U"],
        answer: "Windows + L",
      },
    ],
  },
  level2: {
    label: "Level 2 - Window Management",
    timeLimit: 25,
    questions: [
      {
        prompt: "Snap a window to the left half of the screen.",
        options: ["Windows + Left", "Alt + Left", "Windows + Up", "Ctrl + Left"],
        answer: "Windows + Left",
      },
      {
        prompt: "Snap a window to the right half of the screen.",
        options: ["Windows + Right", "Alt + Right", "Windows + Down", "Ctrl + Right"],
        answer: "Windows + Right",
      },
      {
        prompt: "Maximize the current window.",
        options: ["Windows + Up", "Alt + Up", "Windows + M", "Ctrl + Up"],
        answer: "Windows + Up",
      },
      {
        prompt: "Minimize the current window.",
        options: ["Windows + Down", "Alt + Down", "Windows + D", "Ctrl + Down"],
        answer: "Windows + Down",
      },
      {
        prompt: "Show the desktop quickly.",
        options: ["Windows + D", "Windows + E", "Alt + D", "Ctrl + D"],
        answer: "Windows + D",
      },
    ],
  },
  level3: {
    label: "Level 3 - System Tools",
    timeLimit: 25,
    questions: [
      {
        prompt: "Open Task Manager directly.",
        options: ["Ctrl + Shift + Esc", "Ctrl + Alt + Del", "Alt + Esc", "Windows + T"],
        answer: "Ctrl + Shift + Esc",
      },
      {
        prompt: "Open the Run dialog.",
        options: ["Windows + R", "Ctrl + R", "Alt + R", "Windows + P"],
        answer: "Windows + R",
      },
      {
        prompt: "Open Windows Settings.",
        options: ["Windows + I", "Windows + S", "Ctrl + I", "Alt + I"],
        answer: "Windows + I",
      },
      {
        prompt: "Open File Explorer.",
        options: ["Windows + E", "Ctrl + E", "Alt + E", "Windows + F"],
        answer: "Windows + E",
      },
      {
        prompt: "Open the search bar.",
        options: ["Windows + S", "Alt + S", "Ctrl + S", "Windows + K"],
        answer: "Windows + S",
      },
    ],
  },
  level4: {
    label: "Level 4 - Power User",
    timeLimit: 20,
    questions: [
      {
        prompt: "Open the Quick Link menu.",
        options: ["Windows + X", "Windows + Q", "Ctrl + X", "Alt + X"],
        answer: "Windows + X",
      },
      {
        prompt: "Open the Game Bar.",
        options: ["Windows + G", "Windows + B", "Alt + G", "Ctrl + G"],
        answer: "Windows + G",
      },
      {
        prompt: "Open the Emoji panel.",
        options: ["Windows + .", "Windows + ;", "Alt + .", "Ctrl + ."],
        answer: "Windows + .",
      },
      {
        prompt: "Open the Clipboard history.",
        options: ["Windows + V", "Ctrl + V", "Windows + C", "Alt + V"],
        answer: "Windows + V",
      },
      {
        prompt: "Switch between virtual desktops.",
        options: ["Ctrl + Windows + Left/Right", "Alt + Tab", "Windows + Tab", "Ctrl + Alt + Tab"],
        answer: "Ctrl + Windows + Left/Right",
      },
    ],
  },
  level5: {
    label: "Level 5 - Speed Round",
    timeLimit: 15,
    questions: [
      {
        prompt: "Open the Action Center (Quick Settings).",
        options: ["Windows + A", "Windows + C", "Ctrl + A", "Alt + A"],
        answer: "Windows + A",
      },
      {
        prompt: "Open the projection menu (extend/duplicate).",
        options: ["Windows + P", "Windows + O", "Alt + P", "Ctrl + P"],
        answer: "Windows + P",
      },
      {
        prompt: "Open the screenshot folder via Snipping overlay.",
        options: ["Windows + Shift + S", "Print Screen", "Windows + Shift + P", "Alt + Shift + S"],
        answer: "Windows + Shift + S",
      },
      {
        prompt: "Open the notification panel (old Windows 10 shortcut).",
        options: ["Windows + N", "Windows + K", "Alt + N", "Ctrl + N"],
        answer: "Windows + N",
      },
      {
        prompt: "Minimize all windows except the active one.",
        options: ["Windows + Home", "Windows + M", "Alt + Home", "Ctrl + Home"],
        answer: "Windows + Home",
      },
    ],
  },
};

let currentLevelKey = "level1";
let currentQuestionIndex = 0;
let score = 0;
let strikes = 0;
let answered = false;
let playerName = "";
let scoreSaved = false;
let timerInterval = null;
let timeRemaining = 0;
let shuffledQuestions = [];

const elements = {};

const setMessage = (text, tone = "") => {
  elements.message.textContent = text;
  elements.message.className = `quiz-message ${tone}`.trim();
};

const setModalMessage = (text, tone = "") => {
  elements.modalMessage.textContent = text;
  elements.modalMessage.className = `form-note ${tone}`.trim();
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
      item.textContent = `${entry.name} — ${entry.level} — ${entry.score} pts`;
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
    level: LEVELS[currentLevelKey].label,
    score,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  scoreSaved = true;
};

const updateScoreboard = () => {
  const total = shuffledQuestions.length;
  elements.score.textContent = score;
  elements.strikes.textContent = strikes;
  elements.progress.textContent = `${Math.min(currentQuestionIndex + 1, total)} / ${total}`;
  elements.timer.textContent = timeRemaining;
  elements.levelLabel.textContent = LEVELS[currentLevelKey].label;
};

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const startTimer = (seconds) => {
  stopTimer();
  timeRemaining = seconds;
  updateScoreboard();
  timerInterval = setInterval(() => {
    timeRemaining -= 1;
    elements.timer.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
};

const handleTimeout = () => {
  if (answered) {
    return;
  }
  answered = true;
  strikes += 1;
  setMessage("Time's up!", "warning");
  elements.nextBtn.disabled = false;
  updateScoreboard();
  if (strikes >= MAX_STRIKES) {
    endRound("Too many strikes. Round over!");
  }
};

const clearOptions = () => {
  elements.options.innerHTML = "";
};

const renderQuestion = () => {
  const question = shuffledQuestions[currentQuestionIndex];
  if (!question) {
    endRound("Level complete! Great work.");
    return;
  }

  answered = false;
  scoreSaved = false;
  elements.prompt.textContent = question.prompt;
  clearOptions();
  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(option));
    elements.options.appendChild(button);
  });
  elements.nextBtn.disabled = true;
  setMessage("");
  startTimer(LEVELS[currentLevelKey].timeLimit);
  updateScoreboard();
};

const handleAnswer = (choice) => {
  if (answered) {
    return;
  }
  answered = true;
  stopTimer();
  const question = shuffledQuestions[currentQuestionIndex];
  if (choice === question.answer) {
    score += 1;
    setMessage("Correct!", "success");
  } else {
    strikes += 1;
    setMessage(`Not quite. Correct answer: ${question.answer}`, "warning");
  }
  elements.nextBtn.disabled = false;
  updateScoreboard();
  if (strikes >= MAX_STRIKES) {
    endRound("Too many strikes. Round over!");
  }
};

const nextQuestion = () => {
  if (!answered) {
    setMessage("Choose an answer before moving on.", "warning");
    return;
  }
  currentQuestionIndex += 1;
  renderQuestion();
};

const endRound = (message) => {
  stopTimer();
  clearOptions();
  elements.prompt.textContent = message;
  elements.nextBtn.disabled = true;
  setMessage(`Final score: ${score} / ${shuffledQuestions.length}`, "success");
  saveScore();
};

const startLevel = () => {
  currentLevelKey = elements.levelSelect.value;
  currentQuestionIndex = 0;
  score = 0;
  strikes = 0;
  answered = false;
  scoreSaved = false;
  shuffledQuestions = shuffle(LEVELS[currentLevelKey].questions);
  renderQuestion();
};

const startGame = () => {
  const name = elements.modalNameInput.value.trim();
  if (!name) {
    setModalMessage("Enter your name to start.", "warning");
    return;
  }
  playerName = name;
  elements.modal.classList.add("hidden");
  elements.modalNameInput.value = "";
  setModalMessage("");
  startLevel();
};

const initGame = () => {
  elements.modal = document.getElementById("hotkeyNameModal");
  elements.modalNameInput = document.getElementById("hotkeyModalName");
  elements.modalMessage = document.getElementById("hotkeyModalMessage");
  elements.modalStartBtn = document.getElementById("hotkeyModalStart");
  elements.prompt = document.getElementById("hotkeyPrompt");
  elements.options = document.getElementById("hotkeyOptions");
  elements.message = document.getElementById("hotkeyMessage");
  elements.score = document.getElementById("hotkeyScore");
  elements.strikes = document.getElementById("hotkeyStrikes");
  elements.progress = document.getElementById("hotkeyProgress");
  elements.timer = document.getElementById("hotkeyTimer");
  elements.levelLabel = document.getElementById("hotkeyLevelLabel");
  elements.levelSelect = document.getElementById("hotkeyLevel");
  elements.startBtn = document.getElementById("hotkeyStartBtn");
  elements.nextBtn = document.getElementById("hotkeyNextBtn");
  elements.leaderboard = document.getElementById("hotkeyLeaderboard");

  if (Object.values(elements).some((el) => !el)) {
    return;
  }

  elements.startBtn.addEventListener("click", startLevel);
  elements.nextBtn.addEventListener("click", nextQuestion);
  elements.levelSelect.addEventListener("change", () => {
    elements.levelLabel.textContent = LEVELS[elements.levelSelect.value].label;
  });
  elements.modalStartBtn.addEventListener("click", startGame);
  elements.modalNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      startGame();
    }
  });

  elements.levelLabel.textContent = LEVELS[currentLevelKey].label;
  updateLeaderboardUI();
};

window.addEventListener("DOMContentLoaded", initGame);
