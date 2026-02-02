const LEADERBOARD_KEY = "secure_or_sus_leaderboard";

const SCENARIOS = [
  {
    text: "Public Wi-Fi named 'FreeAirportWiFi' with no password.",
    secure: false,
    explanation: "Open networks can be monitored. Use a VPN or avoid logging in.",
  },
  {
    text: "An email from IT asking you to change your password with a strange link.",
    secure: false,
    explanation: "Verify the sender and use the official portal instead.",
  },
  {
    text: "A website with HTTPS and the exact school domain asking you to log in.",
    secure: true,
    explanation: "The correct domain with HTTPS is a good sign to proceed.",
  },
  {
    text: "A classmate shares a file using your school's approved drive.",
    secure: true,
    explanation: "Approved tools with known sharing settings are safer.",
  },
  {
    text: "A pop-up says your device is infected and asks for a download.",
    secure: false,
    explanation: "Pop-ups that push downloads are often scams.",
  },
  {
    text: "An app asks for location access when it isn't needed.",
    secure: false,
    explanation: "Unnecessary permissions are a red flag.",
  },
];

let playerName = "";
let index = 0;
let score = 0;
let streak = 0;

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let scoreEl;
let streakEl;
let roundEl;
let scenarioEl;
let feedbackEl;
let secureBtnEl;
let susBtnEl;
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

const renderScenario = () => {
  const scenario = SCENARIOS[index];
  roundEl.textContent = `${index + 1} / ${SCENARIOS.length}`;
  scenarioEl.textContent = scenario.text;
  feedbackEl.textContent = "";
  nextBtnEl.disabled = true;
  secureBtnEl.disabled = false;
  susBtnEl.disabled = false;
};

const handleAnswer = (isSecure) => {
  const scenario = SCENARIOS[index];
  if (scenario.secure === isSecure) {
    streak += 1;
    score += 20 + streak * 2;
    feedbackEl.textContent = `Correct. ${scenario.explanation}`;
  } else {
    streak = 0;
    score = Math.max(0, score - 5);
    feedbackEl.textContent = `Not quite. ${scenario.explanation}`;
  }

  scoreEl.textContent = score;
  streakEl.textContent = streak;
  nextBtnEl.disabled = false;
  secureBtnEl.disabled = true;
  susBtnEl.disabled = true;
};

const nextScenario = () => {
  index += 1;
  if (index >= SCENARIOS.length) {
    saveScore();
    feedbackEl.textContent = "Round complete! Score saved to the leaderboard.";
    index = 0;
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
  streak = 0;
  index = 0;
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  renderScenario();
};

const init = () => {
  modalEl = document.getElementById("susModal");
  modalNameInputEl = document.getElementById("susName");
  modalStartBtnEl = document.getElementById("susStart");
  modalMessageEl = document.getElementById("susModalMessage");
  scoreEl = document.getElementById("susScore");
  streakEl = document.getElementById("susStreak");
  roundEl = document.getElementById("susRound");
  scenarioEl = document.getElementById("susScenario");
  feedbackEl = document.getElementById("susFeedback");
  secureBtnEl = document.getElementById("susSecureBtn");
  susBtnEl = document.getElementById("susSusBtn");
  nextBtnEl = document.getElementById("susNext");
  leaderboardEl = document.getElementById("susLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !scoreEl ||
    !streakEl ||
    !roundEl ||
    !scenarioEl ||
    !feedbackEl ||
    !secureBtnEl ||
    !susBtnEl ||
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
  secureBtnEl.addEventListener("click", () => handleAnswer(true));
  susBtnEl.addEventListener("click", () => handleAnswer(false));
  nextBtnEl.addEventListener("click", nextScenario);
};

window.addEventListener("DOMContentLoaded", init);
