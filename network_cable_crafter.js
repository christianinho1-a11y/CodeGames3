const LEADERBOARD_KEY = "network_cable_crafter_leaderboard";

const STANDARDS = {
  A: [
    "White/Green",
    "Green",
    "White/Orange",
    "Blue",
    "White/Blue",
    "Orange",
    "White/Brown",
    "Brown",
  ],
  B: [
    "White/Orange",
    "Orange",
    "White/Green",
    "Blue",
    "White/Blue",
    "Green",
    "White/Brown",
    "Brown",
  ],
};

let playerName = "";
let attempts = 0;
let score = 0;
let selected = [];

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let standardEl;
let resetBtnEl;
let scoreEl;
let attemptsEl;
let wireSlotsEl;
let wireChoicesEl;
let submitBtnEl;
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

const renderSlots = () => {
  wireSlotsEl.innerHTML = "";
  selected = [];
  for (let i = 0; i < 8; i += 1) {
    const slot = document.createElement("div");
    slot.className = "wire-slot";
    slot.textContent = `${i + 1}`;
    wireSlotsEl.appendChild(slot);
  }
};

const renderChoices = () => {
  wireChoicesEl.innerHTML = "";
  const wires = [...STANDARDS[standardEl.value]];
  wires.forEach((wire) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline chip";
    button.type = "button";
    button.textContent = wire;
    button.addEventListener("click", () => {
      if (selected.length >= 8) {
        return;
      }
      selected.push(wire);
      const slot = wireSlotsEl.children[selected.length - 1];
      slot.textContent = wire;
      button.disabled = true;
    });
    wireChoicesEl.appendChild(button);
  });
};

const resetCable = () => {
  renderSlots();
  renderChoices();
  messageEl.textContent = "";
};

const checkCable = () => {
  attempts += 1;
  attemptsEl.textContent = attempts;
  const target = STANDARDS[standardEl.value];
  if (selected.length < 8) {
    messageEl.textContent = "Fill all 8 slots before checking.";
    return;
  }

  const correct = selected.every((wire, index) => wire === target[index]);
  if (correct) {
    score += Math.max(10, 80 - attempts * 5);
    scoreEl.textContent = score;
    messageEl.textContent = "Perfect cable! Score saved to the leaderboard.";
    saveScore();
    attempts = 0;
    attemptsEl.textContent = attempts;
    resetCable();
  } else {
    messageEl.textContent = "Cable order is off. Try again or reset.";
  }
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
  attempts = 0;
  score = 0;
  scoreEl.textContent = score;
  attemptsEl.textContent = attempts;
  resetCable();
};

const init = () => {
  modalEl = document.getElementById("cableModal");
  modalNameInputEl = document.getElementById("cableName");
  modalStartBtnEl = document.getElementById("cableStart");
  modalMessageEl = document.getElementById("cableModalMessage");
  standardEl = document.getElementById("cableStandard");
  resetBtnEl = document.getElementById("cableReset");
  scoreEl = document.getElementById("cableScore");
  attemptsEl = document.getElementById("cableAttempts");
  wireSlotsEl = document.getElementById("wireSlots");
  wireChoicesEl = document.getElementById("wireChoices");
  submitBtnEl = document.getElementById("cableSubmit");
  messageEl = document.getElementById("cableMessage");
  leaderboardEl = document.getElementById("cableLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !standardEl ||
    !resetBtnEl ||
    !scoreEl ||
    !attemptsEl ||
    !wireSlotsEl ||
    !wireChoicesEl ||
    !submitBtnEl ||
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
  standardEl.addEventListener("change", resetCable);
  resetBtnEl.addEventListener("click", resetCable);
  submitBtnEl.addEventListener("click", checkCable);
};

window.addEventListener("DOMContentLoaded", init);
