const LEADERBOARD_KEY = "shortcut_ninja_leaderboard";

const PROMPTS = [
  { task: "Copy", answer: "Ctrl + C", options: ["Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + Z"] },
  { task: "Paste", answer: "Ctrl + V", options: ["Ctrl + V", "Ctrl + C", "Ctrl + P", "Ctrl + A"] },
  { task: "Undo", answer: "Ctrl + Z", options: ["Ctrl + Y", "Ctrl + Z", "Ctrl + S", "Ctrl + B"] },
  { task: "Reopen closed tab", answer: "Ctrl + Shift + T", options: ["Ctrl + T", "Ctrl + Shift + T", "Ctrl + W", "Ctrl + Tab"] },
  { task: "Select all", answer: "Ctrl + A", options: ["Ctrl + A", "Ctrl + F", "Ctrl + L", "Ctrl + D"] },
];

let playerName = "";
let index = 0;
let score = 0;
let streak = 0;
let timeRemaining = 20;
let timerId = null;

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let scoreEl;
let streakEl;
let timerEl;
let promptEl;
let choicesEl;
let messageEl;
let nextBtnEl;
let leaderboardEl;

const setModalMessage = (text, tone = "") => {
  modalMessageEl.textContent = text;
  modalMessageEl.className = `form-note ${tone}`.trim();
};

const renderLeaderboard = () => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  const entries = stored ? JSON.parse(stored) : [];
  leaderboardEl.innerHTML = "";

  if (!entries.length) {
    const empty = document.createElement("li");
    empty.textContent = "No scores yet. Be the first!";
    leaderboardEl.appendChild(empty);
    return;
  }

  entries
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = `${entry.name} — ${entry.score} pts — streak ${entry.streak}`;
      leaderboardEl.appendChild(item);
    });
};

const saveScore = () => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  const entries = stored ? JSON.parse(stored) : [];
  entries.push({
    name: playerName,
    score,
    streak,
    date: new Date().toISOString(),
  });
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  renderLeaderboard();
};

const startTimer = () => {
  if (timerId) {
    clearInterval(timerId);
  }
  timeRemaining = 20;
  timerEl.textContent = timeRemaining;
  timerId = setInterval(() => {
    timeRemaining -= 1;
    timerEl.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(timerId);
      messageEl.textContent = "Time's up!";
      nextBtnEl.disabled = false;
    }
  }, 1000);
};

const renderPrompt = () => {
  const prompt = PROMPTS[index];
  promptEl.textContent = prompt.task;
  choicesEl.innerHTML = "";
  messageEl.textContent = "";
  nextBtnEl.disabled = true;

  prompt.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => handleChoice(option));
    choicesEl.appendChild(button);
  });

  startTimer();
};

const handleChoice = (choice) => {
  const prompt = PROMPTS[index];
  if (choice === prompt.answer) {
    streak += 1;
    score += 15 + streak * 2;
    messageEl.textContent = "Correct!";
  } else {
    streak = 0;
    score = Math.max(0, score - 5);
    messageEl.textContent = `Incorrect. Correct answer: ${prompt.answer}`;
  }
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  choicesEl.querySelectorAll("button").forEach((btn) => {
    btn.disabled = true;
  });
  clearInterval(timerId);
  nextBtnEl.disabled = false;
};

const nextPrompt = () => {
  index += 1;
  if (index >= PROMPTS.length) {
    saveScore();
    messageEl.textContent = "Round complete! Score saved to the leaderboard.";
    index = 0;
  }
  renderPrompt();
};

const startGame = () => {
  const name = modalNameInputEl.value.trim();
  if (!name) {
    setModalMessage("Enter your name to start.", "warning");
    return;
  }
  playerName = name;
  modalEl.classList.add("hidden");
  setModalMessage("");
  modalNameInputEl.value = "";
  score = 0;
  streak = 0;
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  index = 0;
  renderPrompt();
};

const init = () => {
  modalEl = document.getElementById("ninjaModal");
  modalNameInputEl = document.getElementById("ninjaName");
  modalStartBtnEl = document.getElementById("ninjaStart");
  modalMessageEl = document.getElementById("ninjaModalMessage");
  scoreEl = document.getElementById("ninjaScore");
  streakEl = document.getElementById("ninjaStreak");
  timerEl = document.getElementById("ninjaTimer");
  promptEl = document.getElementById("ninjaPrompt");
  choicesEl = document.getElementById("ninjaChoices");
  messageEl = document.getElementById("ninjaMessage");
  nextBtnEl = document.getElementById("ninjaNext");
  leaderboardEl = document.getElementById("ninjaLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !scoreEl ||
    !streakEl ||
    !timerEl ||
    !promptEl ||
    !choicesEl ||
    !messageEl ||
    !nextBtnEl ||
    !leaderboardEl
  ) {
    return;
  }

  renderLeaderboard();
  modalEl.classList.remove("hidden");

  modalStartBtnEl.addEventListener("click", startGame);
  modalNameInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      startGame();
    }
  });
  nextBtnEl.addEventListener("click", nextPrompt);
};

window.addEventListener("DOMContentLoaded", init);
