const LEADERBOARD_KEY = "file_explorer_leaderboard";

const LEVELS = {
  level1: {
    label: "Level 1 - Basics",
    questions: [
      {
        prompt: "Where do deleted files go before they are permanently removed?",
        options: ["Recycle Bin", "Downloads", "Documents", "Desktop"],
        answer: "Recycle Bin",
      },
      {
        prompt: "Which option creates a new folder?",
        options: ["New Folder", "Rename", "Properties", "Search"],
        answer: "New Folder",
      },
      {
        prompt: "You want to open a file. Which action is best?",
        options: ["Double-click the file", "Drag to the taskbar", "Right-click and delete", "Open Start Menu"],
        answer: "Double-click the file",
      },
      {
        prompt: "Which view shows files as large previews?",
        options: ["Large icons", "Details", "List", "Tiles"],
        answer: "Large icons",
      },
      {
        prompt: "What does the address bar show?",
        options: ["Your current folder path", "CPU speed", "Battery level", "Wi-Fi strength"],
        answer: "Your current folder path",
      },
    ],
  },
  level2: {
    label: "Level 2 - Organization",
    questions: [
      {
        prompt: "You want to keep project files together. Best move?",
        options: ["Create a project folder", "Rename every file", "Delete duplicates", "Pin to Start"],
        answer: "Create a project folder",
      },
      {
        prompt: "Which action helps you sort files by type?",
        options: ["Sort by Type", "Pin to Quick Access", "Open Settings", "Change wallpaper"],
        answer: "Sort by Type",
      },
      {
        prompt: "What feature helps you find a file by name quickly?",
        options: ["Search bar", "Task View", "Clipboard", "Sticky Notes"],
        answer: "Search bar",
      },
      {
        prompt: "You need to see when files were last edited.",
        options: ["Sort by Date Modified", "Sort by Size", "Group by Name", "Hide Extensions"],
        answer: "Sort by Date Modified",
      },
      {
        prompt: "Which action keeps important folders handy?",
        options: ["Pin to Quick Access", "Zip the folder", "Send to Recycle Bin", "Change the icon"],
        answer: "Pin to Quick Access",
      },
    ],
  },
  level3: {
    label: "Level 3 - Shortcuts",
    questions: [
      {
        prompt: "Shortcut to copy a selected file?",
        options: ["Ctrl + C", "Ctrl + X", "Ctrl + V", "Ctrl + Z"],
        answer: "Ctrl + C",
      },
      {
        prompt: "Shortcut to paste a copied file?",
        options: ["Ctrl + V", "Ctrl + C", "Ctrl + P", "Alt + Tab"],
        answer: "Ctrl + V",
      },
      {
        prompt: "Shortcut to rename a file in Windows?",
        options: ["F2", "F5", "Ctrl + R", "Shift + R"],
        answer: "F2",
      },
      {
        prompt: "Shortcut to open File Explorer quickly?",
        options: ["Windows + E", "Windows + D", "Alt + F4", "Ctrl + L"],
        answer: "Windows + E",
      },
      {
        prompt: "Shortcut to undo a move you just made?",
        options: ["Ctrl + Z", "Ctrl + Y", "Alt + Z", "Shift + Z"],
        answer: "Ctrl + Z",
      },
    ],
  },
  level4: {
    label: "Level 4 - Cloud & Sharing",
    questions: [
      {
        prompt: "Best tool for sharing a file with view-only access?",
        options: ["Share link with view permission", "Send as .exe", "Rename the file", "Disable Wi-Fi"],
        answer: "Share link with view permission",
      },
      {
        prompt: "What does syncing do?",
        options: ["Keeps files updated across devices", "Deletes duplicates", "Turns off notifications", "Formats the drive"],
        answer: "Keeps files updated across devices",
      },
      {
        prompt: "Which service is commonly used for school cloud storage?",
        options: ["Google Drive", "Spotify", "Steam", "Zoom"],
        answer: "Google Drive",
      },
      {
        prompt: "What should you do before sharing a doc?",
        options: ["Check permission settings", "Erase the file", "Rename your PC", "Change your wallpaper"],
        answer: "Check permission settings",
      },
      {
        prompt: "Which action helps keep a shared folder organized?",
        options: ["Use clear folder names", "Make everything public", "Disable search", "Hide file extensions"],
        answer: "Use clear folder names",
      },
    ],
  },
  level5: {
    label: "Level 5 - Power User",
    questions: [
      {
        prompt: "What file extension shows hidden file types in Windows?",
        options: ["View > File name extensions", "Change wallpaper", "Open Run", "Turn on Bluetooth"],
        answer: "View > File name extensions",
      },
      {
        prompt: "Best format to compress a folder for emailing?",
        options: [".zip", ".png", ".exe", ".html"],
        answer: ".zip",
      },
      {
        prompt: "You need to see file sizes in a folder quickly.",
        options: ["Use Details view", "Use Large icons", "Use Tiles view", "Hide columns"],
        answer: "Use Details view",
      },
      {
        prompt: "Which tool helps you recover a previous version of a file?",
        options: ["File history", "Task Manager", "Control Panel", "Screen snip"],
        answer: "File history",
      },
      {
        prompt: "Which action keeps backups safe?",
        options: ["Store backups in two locations", "Only save on USB", "Delete old copies", "Turn off updates"],
        answer: "Store backups in two locations",
      },
    ],
  },
};

let currentLevelKey = "level1";
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let playerName = "";
let scoreSaved = false;

let promptEl;
let optionsEl;
let messageEl;
let scoreEl;
let progressEl;
let levelLabelEl;
let levelSelectEl;
let startBtnEl;
let nextBtnEl;
let leaderboardEl;
let nameModalEl;
let modalNameInputEl;
let modalMessageEl;
let modalStartBtnEl;

const setMessage = (text, tone = "") => {
  messageEl.textContent = text;
  messageEl.className = `quiz-message ${tone}`.trim();
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
      item.textContent = `${entry.name} — ${entry.level} — ${entry.score} pts`;
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
    level: LEVELS[currentLevelKey].label,
    score,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  scoreSaved = true;
};

const updateScoreboard = () => {
  const level = LEVELS[currentLevelKey];
  scoreEl.textContent = score;
  progressEl.textContent = `${Math.min(currentQuestionIndex + 1, level.questions.length)} / ${level.questions.length}`;
  levelLabelEl.textContent = level.label;
};

const clearOptions = () => {
  optionsEl.innerHTML = "";
};

const renderQuestion = () => {
  const level = LEVELS[currentLevelKey];
  const question = level.questions[currentQuestionIndex];
  if (!question) {
    promptEl.textContent = "Level complete!";
    clearOptions();
    setMessage(`You scored ${score} / ${level.questions.length}.`, "success");
    nextBtnEl.disabled = true;
    saveScore();
    return;
  }

  answered = false;
  scoreSaved = false;
  promptEl.textContent = question.prompt;
  clearOptions();
  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(option));
    optionsEl.appendChild(button);
  });
  setMessage("");
  nextBtnEl.disabled = true;
  updateScoreboard();
};

const handleAnswer = (choice) => {
  if (answered) {
    return;
  }
  answered = true;
  const level = LEVELS[currentLevelKey];
  const question = level.questions[currentQuestionIndex];
  const correct = choice === question.answer;
  if (correct) {
    score += 1;
    setMessage("Correct!", "success");
  } else {
    setMessage(`Not quite. Correct answer: ${question.answer}`, "warning");
  }
  nextBtnEl.disabled = false;
};

const nextQuestion = () => {
  if (!answered) {
    setMessage("Choose an answer before moving on.", "warning");
    return;
  }
  currentQuestionIndex += 1;
  renderQuestion();
};

const startLevel = () => {
  currentLevelKey = levelSelectEl.value;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  scoreSaved = false;
  renderQuestion();
};

const startGame = () => {
  const name = modalNameInputEl.value.trim();
  if (!name) {
    setModalMessage("Enter your name to start.", "warning");
    return;
  }
  playerName = name;
  nameModalEl.classList.add("hidden");
  setModalMessage("");
  modalNameInputEl.value = "";
  startLevel();
};

const initGame = () => {
  promptEl = document.getElementById("explorerPrompt");
  optionsEl = document.getElementById("explorerOptions");
  messageEl = document.getElementById("explorerMessage");
  scoreEl = document.getElementById("explorerScore");
  progressEl = document.getElementById("explorerProgress");
  levelLabelEl = document.getElementById("explorerLevelLabel");
  levelSelectEl = document.getElementById("explorerLevel");
  startBtnEl = document.getElementById("explorerStartBtn");
  nextBtnEl = document.getElementById("explorerNextBtn");
  leaderboardEl = document.getElementById("explorerLeaderboard");
  nameModalEl = document.getElementById("explorerNameModal");
  modalNameInputEl = document.getElementById("explorerModalName");
  modalMessageEl = document.getElementById("explorerModalMessage");
  modalStartBtnEl = document.getElementById("explorerModalStart");

  if (!promptEl || !optionsEl || !messageEl || !leaderboardEl) {
    return;
  }

  startBtnEl.addEventListener("click", startLevel);
  nextBtnEl.addEventListener("click", nextQuestion);
  levelSelectEl.addEventListener("change", () => {
    levelLabelEl.textContent = LEVELS[levelSelectEl.value].label;
  });
  modalStartBtnEl.addEventListener("click", startGame);
  modalNameInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      startGame();
    }
  });

  levelLabelEl.textContent = LEVELS[currentLevelKey].label;
  updateLeaderboardUI();
};

window.addEventListener("DOMContentLoaded", initGame);
