const PORT_ROUNDS = [
  {
    prompt: "HTTP",
    options: ["80", "22", "53", "443"],
    answerIndex: 0,
    tip: "HTTP uses port 80 (TCP).",
  },
  {
    prompt: "HTTPS",
    options: ["443", "25", "110", "21"],
    answerIndex: 0,
    tip: "HTTPS uses port 443 (TCP).",
  },
  {
    prompt: "SSH",
    options: ["22", "3389", "67", "23"],
    answerIndex: 0,
    tip: "SSH uses port 22 (TCP).",
  },
  {
    prompt: "FTP",
    options: ["21", "69", "8080", "445"],
    answerIndex: 0,
    tip: "FTP control uses port 21 (TCP).",
  },
  {
    prompt: "DNS",
    options: ["53", "161", "143", "587"],
    answerIndex: 0,
    tip: "DNS uses port 53 (TCP/UDP).",
  },
  {
    prompt: "SMTP",
    options: ["25", "139", "20", "993"],
    answerIndex: 0,
    tip: "SMTP uses port 25 (TCP).",
  },
  {
    prompt: "POP3",
    options: ["110", "995", "143", "3389"],
    answerIndex: 0,
    tip: "POP3 uses port 110 (TCP).",
  },
  {
    prompt: "IMAP",
    options: ["143", "993", "389", "88"],
    answerIndex: 0,
    tip: "IMAP uses port 143 (TCP).",
  },
  {
    prompt: "RDP",
    options: ["3389", "23", "1194", "1723"],
    answerIndex: 0,
    tip: "Remote Desktop uses port 3389 (TCP).",
  },
  {
    prompt: "DHCP",
    options: ["67", "1812", "445", "514"],
    answerIndex: 0,
    tip: "DHCP servers listen on UDP 67.",
  },
];

const MAX_STRIKES = 3;
const LEADERBOARD_KEY = "it_port_match_leaderboard";

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
  elements.progress.textContent = `${Math.min(currentIndex + 1, PORT_ROUNDS.length)} / ${PORT_ROUNDS.length}`;
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
  const round = PORT_ROUNDS[currentIndex];
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
  const round = PORT_ROUNDS[currentIndex];
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

  if (currentIndex >= PORT_ROUNDS.length - 1) {
    endRound("You finished the round! Great port knowledge.");
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
  elements.nameModal = document.getElementById("portNameModal");
  elements.nameInput = document.getElementById("portModalName");
  elements.nameMessage = document.getElementById("portModalMessage");
  elements.modalStart = document.getElementById("portModalStart");
  elements.prompt = document.getElementById("portPrompt");
  elements.score = document.getElementById("portScore");
  elements.strikes = document.getElementById("portStrikes");
  elements.progress = document.getElementById("portProgress");
  elements.options = document.getElementById("portOptions");
  elements.message = document.getElementById("portMessage");
  elements.startBtn = document.getElementById("portStartBtn");
  elements.nextBtn = document.getElementById("portNextBtn");
  elements.leaderboard = document.getElementById("portLeaderboard");

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
