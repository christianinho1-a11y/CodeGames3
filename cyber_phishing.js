const PHISHING_QUESTIONS = [
  {
    text: "Your bank emails: 'Your account is locked. Click this link to verify now.'",
    answer: "phishing",
    tip: "Urgent links asking for credentials are red flags.",
  },
  {
    text: "IT sends: 'Planned maintenance tonight at 9 PM. No action needed.'",
    answer: "legit",
    tip: "Informational notices without links are typically safe.",
  },
  {
    text: "A text says: 'Package delivery failed. Pay $1.99 to reschedule.'",
    answer: "phishing",
    tip: "Unexpected payment requests are suspicious.",
  },
  {
    text: "Your principal shares a calendar invite from the official school domain.",
    answer: "legit",
    tip: "Verified domains help confirm authenticity.",
  },
  {
    text: "A pop-up claims: 'Virus detected! Call support at this number.'",
    answer: "phishing",
    tip: "Scareware and unsolicited support calls are common scams.",
  },
  {
    text: "HR posts benefits updates inside the company intranet portal.",
    answer: "legit",
    tip: "Internal portals are safer than random links.",
  },
  {
    text: "Email from 'payro11@company.com' asks you to confirm direct deposit.",
    answer: "phishing",
    tip: "Look for typos or lookalike domains.",
  },
  {
    text: "Your teacher sends a Google Classroom announcement (no links).",
    answer: "legit",
    tip: "Trusted platforms reduce risk.",
  },
  {
    text: "A gaming site DM offers free skins if you log in with your account.",
    answer: "phishing",
    tip: "Freebie offers often lead to credential theft.",
  },
  {
    text: "The library sends a due-date reminder from its official email.",
    answer: "legit",
    tip: "Verify sender addresses before clicking.",
  },
  {
    text: "Invoice attached from a vendor you have never used.",
    answer: "phishing",
    tip: "Unexpected attachments can be malicious.",
  },
  {
    text: "A known coworker emails meeting notes with no attachments or links.",
    answer: "legit",
    tip: "Context and familiarity matter.",
  },
];

const MAX_STRIKES = 3;
const LEADERBOARD_KEY = "cyber_phishing_leaderboard";

let currentIndex = 0;
let score = 0;
let strikes = 0;
let playerName = "";
let roundOver = false;
let scoreSaved = false;
let correctCount = 0;

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
  elements.progress.textContent = `${Math.min(currentIndex + 1, PHISHING_QUESTIONS.length)} / ${PHISHING_QUESTIONS.length}`;
};

const showQuestion = () => {
  const question = PHISHING_QUESTIONS[currentIndex];
  if (!question) {
    return;
  }
  elements.prompt.textContent = question.text;
  setMessage("", "");
  elements.nextBtn.disabled = true;
  updateScoreboard();
};

const endRound = (message) => {
  roundOver = true;
  setMessage(message, "info");
  elements.nextBtn.disabled = true;
  elements.optionPhish.disabled = true;
  elements.optionLegit.disabled = true;
  saveScore();
};

const handleAnswer = (selection) => {
  if (roundOver) {
    return;
  }
  const question = PHISHING_QUESTIONS[currentIndex];
  if (!question) {
    return;
  }

  if (selection === question.answer) {
    score += 10;
    correctCount += 1;
    setMessage(`Correct! ${question.tip}`, "success");
  } else {
    strikes += 1;
    setMessage(`Strike! ${question.tip}`, "warning");
  }

  if (strikes >= MAX_STRIKES) {
    endRound("Puzzle failed — you ran out of strikes.");
    return;
  }

  if (currentIndex >= PHISHING_QUESTIONS.length - 1) {
    endRound("You finished the round! Great job spotting threats.");
    return;
  }

  elements.nextBtn.disabled = false;
  updateScoreboard();
};

const nextQuestion = () => {
  if (roundOver) {
    return;
  }
  currentIndex += 1;
  showQuestion();
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
  elements.optionPhish.disabled = false;
  elements.optionLegit.disabled = false;
  showQuestion();
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
  elements.nameModal = document.getElementById("phishingNameModal");
  elements.nameInput = document.getElementById("phishingModalName");
  elements.nameMessage = document.getElementById("phishingModalMessage");
  elements.modalStart = document.getElementById("phishingModalStart");
  elements.prompt = document.getElementById("phishingPrompt");
  elements.score = document.getElementById("phishingScore");
  elements.strikes = document.getElementById("phishingStrikes");
  elements.progress = document.getElementById("phishingProgress");
  elements.optionPhish = document.getElementById("phishingOptionPhish");
  elements.optionLegit = document.getElementById("phishingOptionLegit");
  elements.message = document.getElementById("phishingMessage");
  elements.startBtn = document.getElementById("phishingStartBtn");
  elements.nextBtn = document.getElementById("phishingNextBtn");
  elements.leaderboard = document.getElementById("phishingLeaderboard");

  if (Object.values(elements).some((el) => !el)) {
    return;
  }

  updateLeaderboardUI();
  elements.nameModal.classList.remove("hidden");
  elements.modalStart.addEventListener("click", startGame);
  elements.startBtn.addEventListener("click", startRound);
  elements.optionPhish.addEventListener("click", () => handleAnswer("phishing"));
  elements.optionLegit.addEventListener("click", () => handleAnswer("legit"));
  elements.nextBtn.addEventListener("click", nextQuestion);
};

window.addEventListener("DOMContentLoaded", init);
