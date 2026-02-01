const PASSWORD_ROUNDS = [
  {
    prompt: "Choose the strongest password for a student account:",
    options: ["password123", "Summer2024", "B!gT1me#92", "qwerty"],
    answerIndex: 2,
    tip: "Longer, mixed characters with symbols is stronger.",
  },
  {
    prompt: "Pick the best option for a school Wi-Fi login:",
    options: ["admin", "letmein", "S3cure!Net55", "student"],
    answerIndex: 2,
    tip: "Avoid common words and add complexity.",
  },
  {
    prompt: "Which password is the most secure?",
    options: ["monkey", "Tr33House!", "baseball", "welcome"],
    answerIndex: 1,
    tip: "Mixing words with symbols increases strength.",
  },
  {
    prompt: "Choose the best password for a cloud service:",
    options: ["cloud2024", "C1oud^Sky#88", "service", "123456"],
    answerIndex: 1,
    tip: "Randomized characters beat predictable patterns.",
  },
  {
    prompt: "Pick the strongest password:",
    options: ["football", "Pa$$w0rd", "M@rble*77", "hello"],
    answerIndex: 2,
    tip: "Unique combos plus length win.",
  },
  {
    prompt: "Which is safest for an admin account?",
    options: ["Admin2024", "Secure!Desk#41", "changeme", "abc123"],
    answerIndex: 1,
    tip: "Avoid role-based and default passwords.",
  },
  {
    prompt: "Pick the best password for a gaming account:",
    options: ["dragon", "Play123", "B1t#Breaker77", "gamer"],
    answerIndex: 2,
    tip: "Use non-guessable phrases with symbols.",
  },
  {
    prompt: "Which password is the strongest for an email account?",
    options: ["email", "E!Mail#908", "Summer", "sunshine"],
    answerIndex: 1,
    tip: "Short common words are weaker.",
  },
  {
    prompt: "Choose the safest password for a laptop:",
    options: ["Laptop1", "M0untain!Ice#9", "computer", "pass"],
    answerIndex: 1,
    tip: "Length plus variety makes it strong.",
  },
  {
    prompt: "Pick the best password for a shared tablet:",
    options: ["tablet", "UseMe", "T@blet*Lock77", "school"],
    answerIndex: 2,
    tip: "Unique passwords reduce reuse risk.",
  },
];

const MAX_STRIKES = 3;
const LEADERBOARD_KEY = "cyber_passwords_leaderboard";

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
  elements.progress.textContent = `${Math.min(currentIndex + 1, PASSWORD_ROUNDS.length)} / ${PASSWORD_ROUNDS.length}`;
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
  const round = PASSWORD_ROUNDS[currentIndex];
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
  const round = PASSWORD_ROUNDS[currentIndex];
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

  if (currentIndex >= PASSWORD_ROUNDS.length - 1) {
    endRound("You finished the round! Nice password sense.");
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
  elements.nameModal = document.getElementById("passwordNameModal");
  elements.nameInput = document.getElementById("passwordModalName");
  elements.nameMessage = document.getElementById("passwordModalMessage");
  elements.modalStart = document.getElementById("passwordModalStart");
  elements.prompt = document.getElementById("passwordPrompt");
  elements.score = document.getElementById("passwordScore");
  elements.strikes = document.getElementById("passwordStrikes");
  elements.progress = document.getElementById("passwordProgress");
  elements.options = document.getElementById("passwordOptions");
  elements.message = document.getElementById("passwordMessage");
  elements.startBtn = document.getElementById("passwordStartBtn");
  elements.nextBtn = document.getElementById("passwordNextBtn");
  elements.leaderboard = document.getElementById("passwordLeaderboard");

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
