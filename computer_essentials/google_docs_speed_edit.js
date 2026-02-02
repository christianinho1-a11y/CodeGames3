const LEADERBOARD_KEY = "google_docs_speed_edit_leaderboard";

const TASKS = [
  { id: "bold", label: "Bold the title" },
  { id: "center", label: "Center the heading" },
  { id: "bullets", label: "Ensure the list is bulleted" },
  { id: "image", label: "Insert an image placeholder" },
];

let playerName = "";
let score = 0;
let timeRemaining = 60;
let timerId = null;
const state = {
  bold: false,
  center: false,
  bullets: true,
  image: false,
};

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let scoreEl;
let timerEl;
let checklistEl;
let messageEl;
let titleEl;
let headingEl;
let listEl;
let imageEl;
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
  if (action === "bold") {
    state.bold = true;
    titleEl.classList.add("doc-bold");
  }
  if (action === "center") {
    state.center = true;
    headingEl.classList.add("doc-center");
  }
  if (action === "bullets") {
    state.bullets = true;
    listEl.classList.add("doc-list");
  }
  if (action === "image") {
    state.image = true;
    imageEl.classList.add("doc-image-ready");
  }

  renderChecklist();

  const complete = TASKS.every((task) => state[task.id]);
  if (complete) {
    score += 120 + timeRemaining;
    scoreEl.textContent = score;
    messageEl.textContent = "Checklist complete! Score saved to the leaderboard.";
    clearInterval(timerId);
    saveScore();
  }
};

const startTimer = () => {
  if (timerId) {
    clearInterval(timerId);
  }
  timeRemaining = 60;
  timerEl.textContent = timeRemaining;
  timerId = setInterval(() => {
    timeRemaining -= 1;
    timerEl.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(timerId);
      messageEl.textContent = "Time's up!";
    }
  }, 1000);
};

const resetGame = () => {
  state.bold = false;
  state.center = false;
  state.bullets = true;
  state.image = false;
  titleEl.classList.remove("doc-bold");
  headingEl.classList.remove("doc-center");
  listEl.classList.add("doc-list");
  imageEl.classList.remove("doc-image-ready");
  renderChecklist();
  messageEl.textContent = "";
  startTimer();
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
  modalEl = document.getElementById("docsModal");
  modalNameInputEl = document.getElementById("docsName");
  modalStartBtnEl = document.getElementById("docsStart");
  modalMessageEl = document.getElementById("docsModalMessage");
  scoreEl = document.getElementById("docsScore");
  timerEl = document.getElementById("docsTimer");
  checklistEl = document.getElementById("docsChecklist");
  messageEl = document.getElementById("docsMessage");
  titleEl = document.getElementById("docTitle");
  headingEl = document.getElementById("docHeading");
  listEl = document.getElementById("docList");
  imageEl = document.getElementById("docImage");
  leaderboardEl = document.getElementById("docsLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !scoreEl ||
    !timerEl ||
    !checklistEl ||
    !messageEl ||
    !titleEl ||
    !headingEl ||
    !listEl ||
    !imageEl ||
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

  document.querySelectorAll("[data-doc-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (timeRemaining <= 0) {
        return;
      }
      applyAction(button.dataset.docAction);
    });
  });
};

window.addEventListener("DOMContentLoaded", init);
