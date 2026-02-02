const LEADERBOARD_KEY = "google_slides_builder_leaderboard";

const TASKS = [
  { id: "theme", label: "Apply a theme" },
  { id: "title", label: "Center the title" },
  { id: "bullets", label: "Turn text into a bulleted list" },
  { id: "image", label: "Add an image placeholder" },
];

let playerName = "";
let score = 0;
const state = {
  theme: false,
  title: false,
  bullets: false,
  image: false,
};

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let scoreEl;
let checklistEl;
let messageEl;
let slidePreviewEl;
let slideTitleEl;
let slideBodyEl;
let slideImageEl;
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

const renderChecklist = () => {
  checklistEl.innerHTML = "";
  TASKS.forEach((task) => {
    const item = document.createElement("li");
    item.textContent = task.label;
    if (state[task.id]) {
      item.classList.add("status-good");
    }
    checklistEl.appendChild(item);
  });
};

const applyAction = (action) => {
  state[action] = true;
  if (action === "theme") {
    slidePreviewEl.classList.add("slide-themed");
  }
  if (action === "title") {
    slideTitleEl.classList.add("doc-center");
  }
  if (action === "bullets") {
    slideBodyEl.classList.add("slide-bullets");
  }
  if (action === "image") {
    slideImageEl.classList.add("doc-image-ready");
  }

  renderChecklist();

  if (TASKS.every((task) => state[task.id])) {
    score += 140;
    scoreEl.textContent = score;
    messageEl.textContent = "Slide polished! Score saved to the leaderboard.";
    saveScore();
  }
};

const resetGame = () => {
  Object.keys(state).forEach((key) => {
    state[key] = false;
  });
  slidePreviewEl.classList.remove("slide-themed");
  slideTitleEl.classList.remove("doc-center");
  slideBodyEl.classList.remove("slide-bullets");
  slideImageEl.classList.remove("doc-image-ready");
  renderChecklist();
  messageEl.textContent = "";
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
  resetGame();
};

const init = () => {
  modalEl = document.getElementById("slidesModal");
  modalNameInputEl = document.getElementById("slidesName");
  modalStartBtnEl = document.getElementById("slidesStart");
  modalMessageEl = document.getElementById("slidesModalMessage");
  scoreEl = document.getElementById("slidesScore");
  checklistEl = document.getElementById("slidesChecklist");
  messageEl = document.getElementById("slidesMessage");
  slidePreviewEl = document.getElementById("slidePreview");
  slideTitleEl = document.getElementById("slideTitle");
  slideBodyEl = document.getElementById("slideBody");
  slideImageEl = document.getElementById("slideImage");
  leaderboardEl = document.getElementById("slidesLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !scoreEl ||
    !checklistEl ||
    !messageEl ||
    !slidePreviewEl ||
    !slideTitleEl ||
    !slideBodyEl ||
    !slideImageEl ||
    !leaderboardEl
  ) {
    return;
  }

  renderLeaderboard();
  renderChecklist();
  modalEl.classList.remove("hidden");

  modalStartBtnEl.addEventListener("click", startGame);
  modalNameInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      startGame();
    }
  });

  document.querySelectorAll("[data-slide-action]").forEach((button) => {
    button.addEventListener("click", () => {
      applyAction(button.dataset.slideAction);
    });
  });
};

window.addEventListener("DOMContentLoaded", init);
