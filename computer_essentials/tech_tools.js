const LEADERBOARD_KEY = "tech_tools_leaderboard";
const MAX_STRIKES = 3;

const LEVELS = {
  level1: {
    label: "Level 1 - Easy",
    timeLimit: 25,
    questions: [
      {
        prompt: "You need to write a quick class report with your group.",
        options: ["Google Docs", "Google Maps", "Spotify", "Steam"],
        answer: "Google Docs",
      },
      {
        prompt: "Which tool is best for creating flashcards?",
        options: ["Quizlet", "Photos", "Paint", "Calculator"],
        answer: "Quizlet",
      },
      {
        prompt: "You need to store a project long-term and access it anywhere.",
        options: ["Google Drive", "Recycle Bin", "Bluetooth", "Airplane mode"],
        answer: "Google Drive",
      },
      {
        prompt: "Which tool makes quick class polls and quizzes?",
        options: ["Kahoot", "Notepad", "File Explorer", "Windows Media Player"],
        answer: "Kahoot",
      },
      {
        prompt: "You need to send a message to the class quickly.",
        options: ["Google Classroom", "Calculator", "Paint", "Defrag"],
        answer: "Google Classroom",
      },
    ],
  },
  level2: {
    label: "Level 2 - Medium",
    timeLimit: 25,
    questions: [
      {
        prompt: "You need to schedule a meeting with your teacher.",
        options: ["Google Calendar", "WordPad", "Task Manager", "Windows Update"],
        answer: "Google Calendar",
      },
      {
        prompt: "Which platform is best for making a quick presentation?",
        options: ["Google Slides", "Spotify", "Notepad", "Settings"],
        answer: "Google Slides",
      },
      {
        prompt: "You need to combine 30 PDF pages quickly.",
        options: ["Adobe Acrobat", "Paint", "Task View", "Windows Defender"],
        answer: "Adobe Acrobat",
      },
      {
        prompt: "Which tool is best for real-time class collaboration?",
        options: ["Microsoft Teams", "Calculator", "Photos", "Clock"],
        answer: "Microsoft Teams",
      },
      {
        prompt: "You need to organize tasks into a checklist.",
        options: ["Google Keep", "Device Manager", "Registry Editor", "Snipping Tool"],
        answer: "Google Keep",
      },
    ],
  },
  level3: {
    label: "Level 3 - Hard",
    timeLimit: 20,
    questions: [
      {
        prompt: "Which tool creates quick surveys for classmates?",
        options: ["Google Forms", "Chrome", "File Explorer", "Xbox Game Bar"],
        answer: "Google Forms",
      },
      {
        prompt: "You need to make a simple tutorial video for class.",
        options: ["Loom", "Notepad", "Paint", "Control Panel"],
        answer: "Loom",
      },
      {
        prompt: "Which tool helps organize notes with cards and columns?",
        options: ["Trello", "Calculator", "Disk Cleanup", "Bluetooth"],
        answer: "Trello",
      },
      {
        prompt: "Which tool is best for creating visual posters quickly?",
        options: ["Canva", "Event Viewer", "Task Manager", "PowerShell"],
        answer: "Canva",
      },
      {
        prompt: "You need to store a class password list securely.",
        options: ["Password manager", "Sticky Notes", "Desktop", "Downloads"],
        answer: "Password manager",
      },
    ],
  },
  level4: {
    label: "Level 4 - Expert",
    timeLimit: 20,
    questions: [
      {
        prompt: "Which tool helps you scan devices and block threats?",
        options: ["Windows Security", "Paint", "Clock", "Magnifier"],
        answer: "Windows Security",
      },
      {
        prompt: "Which tool is best for safely sharing large files?",
        options: ["Cloud storage link", "Public folder", "Email attachment only", "USB with no label"],
        answer: "Cloud storage link",
      },
      {
        prompt: "You need to create a data dashboard quickly.",
        options: ["Google Sheets", "WordPad", "Sound Recorder", "Device Manager"],
        answer: "Google Sheets",
      },
      {
        prompt: "Which tool helps control screen time and focus?",
        options: ["Focus mode", "Task Manager", "Calculator", "Paint"],
        answer: "Focus mode",
      },
      {
        prompt: "Which tool lets you record a quick screen demo?",
        options: ["Screen recorder", "Notepad", "File Explorer", "Disk Cleanup"],
        answer: "Screen recorder",
      },
    ],
  },
  level5: {
    label: "Level 5 - Speed Round",
    timeLimit: 15,
    questions: [
      {
        prompt: "Best place to store a school project long-term.",
        options: ["Cloud drive", "Desktop only", "Temp folder", "Recycle Bin"],
        answer: "Cloud drive",
      },
      {
        prompt: "You need a safe way to share a class survey.",
        options: ["Google Forms link", "Random file download", "USB drop-off", "Chat without link"],
        answer: "Google Forms link",
      },
      {
        prompt: "Which tool is best for group chat and file sharing?",
        options: ["Microsoft Teams", "Calculator", "Paint", "Control Panel"],
        answer: "Microsoft Teams",
      },
      {
        prompt: "Which tool helps you make a quick infographic?",
        options: ["Canva", "Registry Editor", "Task Manager", "Command Prompt"],
        answer: "Canva",
      },
      {
        prompt: "You need to organize a digital to-do list.",
        options: ["Google Keep", "Device Manager", "Event Viewer", "Explorer"],
        answer: "Google Keep",
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
  elements.modal = document.getElementById("toolsNameModal");
  elements.modalNameInput = document.getElementById("toolsModalName");
  elements.modalMessage = document.getElementById("toolsModalMessage");
  elements.modalStartBtn = document.getElementById("toolsModalStart");
  elements.prompt = document.getElementById("toolsPrompt");
  elements.options = document.getElementById("toolsOptions");
  elements.message = document.getElementById("toolsMessage");
  elements.score = document.getElementById("toolsScore");
  elements.strikes = document.getElementById("toolsStrikes");
  elements.progress = document.getElementById("toolsProgress");
  elements.timer = document.getElementById("toolsTimer");
  elements.levelLabel = document.getElementById("toolsLevelLabel");
  elements.levelSelect = document.getElementById("toolsLevel");
  elements.startBtn = document.getElementById("toolsStartBtn");
  elements.nextBtn = document.getElementById("toolsNextBtn");
  elements.leaderboard = document.getElementById("toolsLeaderboard");

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
