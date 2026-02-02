const LEADERBOARD_KEY = "variable_vault_leaderboard";

const SCENARIOS = [
  {
    prompt: "Store a student's age.",
    choices: [
      { label: "let studentAge = 16; (number)", correct: true },
      { label: "let studentAge = 'sixteen'; (string)", correct: false },
      { label: "let studentAge = [16]; (array)", correct: false },
      { label: "let studentAge = true; (boolean)", correct: false },
    ],
  },
  {
    prompt: "Track whether a user is logged in.",
    choices: [
      { label: "let isLoggedIn = true; (boolean)", correct: true },
      { label: "let isLoggedIn = 'yes'; (string)", correct: false },
      { label: "let isLoggedIn = 1; (number)", correct: false },
      { label: "let isLoggedIn = ['yes', 'no']; (array)", correct: false },
    ],
  },
  {
    prompt: "Save a list of quiz scores.",
    choices: [
      { label: "let scores = [88, 91, 77]; (array)", correct: true },
      { label: "let scores = '88,91,77'; (string)", correct: false },
      { label: "let scores = 88; (number)", correct: false },
      { label: "let scores = false; (boolean)", correct: false },
    ],
  },
  {
    prompt: "Record a student's first name.",
    choices: [
      { label: "let firstName = 'Avery'; (string)", correct: true },
      { label: "let firstName = 12; (number)", correct: false },
      { label: "let firstName = true; (boolean)", correct: false },
      { label: "let firstName = ['Avery']; (array)", correct: false },
    ],
  },
  {
    prompt: "Store a map of classes to teacher names.",
    choices: [
      { label: "let teachers = { math: 'Ms. Lee' }; (object)", correct: true },
      { label: "let teachers = ['math', 'Ms. Lee']; (array)", correct: false },
      { label: "let teachers = 'math'; (string)", correct: false },
      { label: "let teachers = 3; (number)", correct: false },
    ],
  },
  {
    prompt: "Track the total number of wins.",
    choices: [
      { label: "let wins = 12; (number)", correct: true },
      { label: "let wins = 'twelve'; (string)", correct: false },
      { label: "let wins = false; (boolean)", correct: false },
      { label: "let wins = [12]; (array)", correct: false },
    ],
  },
];

let playerName = "";
let currentIndex = 0;
let score = 0;

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let scoreEl;
let roundEl;
let promptEl;
let scenarioEl;
let choicesEl;
let nextBtnEl;
let messageEl;
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
      item.textContent = `${entry.name} — ${entry.score} pts`;
      leaderboardEl.appendChild(item);
    });
};

const saveScore = () => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  const entries = stored ? JSON.parse(stored) : [];
  entries.push({
    name: playerName,
    score,
    date: new Date().toISOString(),
  });
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  renderLeaderboard();
};

const renderScenario = () => {
  const scenario = SCENARIOS[currentIndex];
  roundEl.textContent = `${currentIndex + 1} / ${SCENARIOS.length}`;
  scenarioEl.textContent = "Scenario";
  promptEl.textContent = scenario.prompt;
  choicesEl.innerHTML = "";
  messageEl.textContent = "";
  nextBtnEl.disabled = true;

  scenario.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline";
    button.type = "button";
    button.textContent = choice.label;
    button.addEventListener("click", () => {
      if (choice.correct) {
        score += 20;
        messageEl.textContent = "Correct! That choice fits the scenario.";
      } else {
        score = Math.max(0, score - 5);
        messageEl.textContent = "Not quite. Look for the data type that matches.";
      }
      scoreEl.textContent = score;
      choicesEl.querySelectorAll("button").forEach((btn) => {
        btn.disabled = true;
      });
      nextBtnEl.disabled = false;
    });
    choicesEl.appendChild(button);
  });
};

const nextScenario = () => {
  currentIndex += 1;
  if (currentIndex >= SCENARIOS.length) {
    saveScore();
    messageEl.textContent = "Vault complete! Score saved to the leaderboard.";
    currentIndex = 0;
  }
  renderScenario();
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
  scoreEl.textContent = score;
  currentIndex = 0;
  renderScenario();
};

const init = () => {
  modalEl = document.getElementById("vaultNameModal");
  modalNameInputEl = document.getElementById("vaultModalName");
  modalStartBtnEl = document.getElementById("vaultModalStart");
  modalMessageEl = document.getElementById("vaultModalMessage");
  scoreEl = document.getElementById("vaultScore");
  roundEl = document.getElementById("vaultRound");
  promptEl = document.getElementById("vaultPrompt");
  scenarioEl = document.getElementById("vaultScenario");
  choicesEl = document.getElementById("vaultChoices");
  nextBtnEl = document.getElementById("vaultNext");
  messageEl = document.getElementById("vaultMessage");
  leaderboardEl = document.getElementById("vaultLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !scoreEl ||
    !roundEl ||
    !promptEl ||
    !scenarioEl ||
    !choicesEl ||
    !nextBtnEl ||
    !messageEl ||
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
  nextBtnEl.addEventListener("click", nextScenario);
};

window.addEventListener("DOMContentLoaded", init);
