const RISK_ROUNDS = [
  {
    prompt: "A student logs in on a shared PC and forgets to log out.",
    answer: "medium",
    tip: "Shared devices can expose accounts.",
  },
  {
    prompt: "A staff member clicks a link in an email from an unknown sender.",
    answer: "high",
    tip: "Unknown senders are risky.",
  },
  {
    prompt: "A file server is missing its weekly backup.",
    answer: "high",
    tip: "Backups protect against outages and ransomware.",
  },
  {
    prompt: "A laptop is encrypted and stored in a locked cart.",
    answer: "low",
    tip: "Encryption and physical security reduce risk.",
  },
  {
    prompt: "Admin passwords are shared in a team chat.",
    answer: "critical",
    tip: "Credential sharing can lead to compromise.",
  },
  {
    prompt: "A user reuses the same password on multiple sites.",
    answer: "high",
    tip: "Password reuse increases impact of breaches.",
  },
  {
    prompt: "The firewall rules are reviewed monthly.",
    answer: "low",
    tip: "Regular reviews are good hygiene.",
  },
  {
    prompt: "An unpatched server is exposed to the internet.",
    answer: "critical",
    tip: "Unpatched systems are prime targets.",
  },
  {
    prompt: "Students use MFA for their school accounts.",
    answer: "low",
    tip: "MFA greatly lowers risk.",
  },
  {
    prompt: "A USB drive with unknown files is plugged into a lab PC.",
    answer: "high",
    tip: "Unknown devices can introduce malware.",
  },
];

const MAX_STRIKES = 3;
const LEADERBOARD_KEY = "cyber_risk_leaderboard";

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
  elements.progress.textContent = `${Math.min(currentIndex + 1, RISK_ROUNDS.length)} / ${RISK_ROUNDS.length}`;
};

const renderOptions = () => {
  const choices = ["low", "medium", "high", "critical"];
  elements.options.innerHTML = "";
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn quiz-option";
    button.textContent = choice.toUpperCase();
    button.addEventListener("click", () => handleAnswer(choice));
    button.disabled = roundOver;
    elements.options.appendChild(button);
  });
};

const showRound = () => {
  const round = RISK_ROUNDS[currentIndex];
  if (!round) {
    return;
  }
  elements.prompt.textContent = round.prompt;
  renderOptions();
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

const handleAnswer = (choice) => {
  if (roundOver) {
    return;
  }
  const round = RISK_ROUNDS[currentIndex];
  if (!round) {
    return;
  }

  if (choice === round.answer) {
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

  if (currentIndex >= RISK_ROUNDS.length - 1) {
    endRound("You finished the round! Great risk sense.");
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
  elements.nameModal = document.getElementById("riskNameModal");
  elements.nameInput = document.getElementById("riskModalName");
  elements.nameMessage = document.getElementById("riskModalMessage");
  elements.modalStart = document.getElementById("riskModalStart");
  elements.prompt = document.getElementById("riskPrompt");
  elements.score = document.getElementById("riskScore");
  elements.strikes = document.getElementById("riskStrikes");
  elements.progress = document.getElementById("riskProgress");
  elements.options = document.getElementById("riskOptions");
  elements.message = document.getElementById("riskMessage");
  elements.startBtn = document.getElementById("riskStartBtn");
  elements.nextBtn = document.getElementById("riskNextBtn");
  elements.leaderboard = document.getElementById("riskLeaderboard");

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
