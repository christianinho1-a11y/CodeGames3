const CONNECTIONS_STORAGE_KEY = "cs_connections_leaderboard";
const CONNECTIONS_PUZZLE_COUNT = 4;
const MAX_STRIKES = 4;

let playerName = "";
let puzzleGroups = [];
let tiles = [];
let selected = new Set();
let solvedGroups = [];
let strikes = 0;
let timerInterval;
let startTime;
let puzzleId = 0;

const elements = {};

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const setMessage = (text, tone = "") => {
  elements.message.textContent = text;
  elements.message.className = `connections-message ${tone}`.trim();
};

const updateTimer = () => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  elements.timer.textContent = formatTime(elapsed);
};

const startTimer = () => {
  clearInterval(timerInterval);
  startTime = Date.now();
  elements.timer.textContent = "0:00";
  timerInterval = setInterval(updateTimer, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
};

const updateScoreboard = () => {
  elements.strikes.textContent = strikes;
  elements.solved.textContent = solvedGroups.length;
};

const loadLeaderboard = () => {
  const stored = localStorage.getItem(CONNECTIONS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLeaderboardLocal = (entries) => {
  localStorage.setItem(CONNECTIONS_STORAGE_KEY, JSON.stringify(entries));
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
    .sort((a, b) => a.timeSeconds - b.timeSeconds)
    .slice(0, 10)
    .forEach((entry) => {
      const item = document.createElement("li");
      const date = new Date(entry.date).toLocaleDateString();
      item.textContent = `${entry.name} — ${formatTime(entry.timeSeconds)} — ${date} — Puzzle ${entry.puzzleId} — Solved ${entry.solvedCount}`;
      elements.leaderboard.appendChild(item);
    });
};

const saveLeaderboardRemote = async (entry) => {
  try {
    await fetch("php/save_cs_connections.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch (error) {
    console.error("Failed to save leaderboard", error);
  }
};

const finalizeGame = (didWin) => {
  stopTimer();
  elements.endCard.hidden = false;
  elements.endTitle.textContent = didWin ? "You Win!" : "Puzzle Failed";
  elements.endMessage.textContent = didWin
    ? "You solved all categories!"
    : "You ran out of strikes.";

  const timeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const entry = {
    name: playerName,
    timeSeconds,
    date: new Date().toISOString(),
    puzzleId,
    solvedCount: solvedGroups.length,
  };

  const entries = loadLeaderboard();
  entries.push(entry);
  saveLeaderboardLocal(entries);
  updateLeaderboardUI();
  saveLeaderboardRemote(entry);
};

const renderSolvedGroups = () => {
  elements.solvedGroups.innerHTML = "";
  solvedGroups.forEach((group) => {
    const card = document.createElement("div");
    card.className = `connections-solved-group ${group.difficulty}`;
    card.innerHTML = `
      <h4>${group.category}</h4>
      <p>${group.words.join(" • ")}</p>
    `;
    elements.solvedGroups.appendChild(card);
  });
};

const renderTiles = () => {
  elements.grid.innerHTML = "";
  tiles.forEach((tile) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "connections-tile";
    button.textContent = tile.word;
    button.dataset.word = tile.word;
    if (selected.has(tile.word)) {
      button.classList.add("selected");
    }
    button.addEventListener("click", () => toggleSelect(tile.word));
    elements.grid.appendChild(button);
  });
};

const toggleSelect = (word) => {
  if (selected.has(word)) {
    selected.delete(word);
  } else if (selected.size < 4) {
    selected.add(word);
  }
  elements.submit.disabled = selected.size !== 4;
  renderTiles();
};

const clearSelection = () => {
  selected.clear();
  elements.submit.disabled = true;
  renderTiles();
};

const shuffleTiles = () => {
  tiles = shuffle(tiles);
  renderTiles();
};

const checkSelection = () => {
  if (selected.size !== 4) {
    return;
  }

  const selectedWords = Array.from(selected);
  const matchedGroup = puzzleGroups.find((group) =>
    group.words.every((word) => selectedWords.includes(word))
  );

  if (matchedGroup) {
    solvedGroups.push(matchedGroup);
    tiles = tiles.filter((tile) => !matchedGroup.words.includes(tile.word));
    renderSolvedGroups();
    clearSelection();
    setMessage("Group solved!", "success");
  } else {
    strikes += 1;
    setMessage("Not a match. Strike added.", "warning");
    clearSelection();
  }

  updateScoreboard();

  if (solvedGroups.length === 4) {
    finalizeGame(true);
  }

  if (strikes >= MAX_STRIKES) {
    finalizeGame(false);
  }
};

const buildPuzzle = () => {
  if (!Array.isArray(CONNECTIONS_GROUPS) || CONNECTIONS_GROUPS.length < 4) {
    return;
  }

  const shuffled = shuffle(CONNECTIONS_GROUPS);
  puzzleGroups = shuffled.slice(0, 4);
  puzzleId = Math.floor(Math.random() * 9000) + 1000;
  tiles = shuffle(
    puzzleGroups.flatMap((group) =>
      group.words.map((word) => ({ word, difficulty: group.difficulty }))
    )
  );
  solvedGroups = [];
  strikes = 0;
  selected.clear();
  updateScoreboard();
  renderSolvedGroups();
  renderTiles();
  setMessage("");
  elements.endCard.hidden = true;
  elements.submit.disabled = true;
  startTimer();
};

const openNameModal = () => {
  elements.nameModal.classList.remove("hidden");
  elements.playerName.focus();
};

const closeNameModal = () => {
  elements.nameModal.classList.add("hidden");
};

const startGame = () => {
  const nameValue = elements.playerName.value.trim();
  if (!nameValue) {
    elements.nameMessage.textContent = "Please enter your name to start.";
    elements.nameMessage.className = "form-note warning";
    return;
  }
  playerName = nameValue;
  elements.nameMessage.textContent = "";
  elements.nameMessage.className = "form-note";
  closeNameModal();
  buildPuzzle();
};

const initGame = () => {
  elements.nameModal = document.getElementById("connectionsNameModal");
  elements.playerName = document.getElementById("connectionsPlayerName");
  elements.nameMessage = document.getElementById("connectionsNameMessage");
  elements.startBtn = document.getElementById("connectionsStartBtn");
  elements.grid = document.getElementById("connectionsGrid");
  elements.solvedGroups = document.getElementById("connectionsSolvedGroups");
  elements.submit = document.getElementById("connectionsSubmit");
  elements.shuffle = document.getElementById("connectionsShuffle");
  elements.clear = document.getElementById("connectionsClear");
  elements.message = document.getElementById("connectionsMessage");
  elements.strikes = document.getElementById("connectionsStrikes");
  elements.solved = document.getElementById("connectionsSolved");
  elements.timer = document.getElementById("connectionsTimer");
  elements.endCard = document.getElementById("connectionsEndCard");
  elements.endTitle = document.getElementById("connectionsEndTitle");
  elements.endMessage = document.getElementById("connectionsEndMessage");
  elements.newPuzzle = document.getElementById("connectionsNewPuzzle");
  elements.backBtn = document.getElementById("connectionsBackBtn");
  elements.leaderboard = document.getElementById("connectionsLeaderboard");

  if (Object.values(elements).some((el) => !el)) {
    return;
  }

  updateLeaderboardUI();
  openNameModal();

  elements.startBtn.addEventListener("click", startGame);
  elements.submit.addEventListener("click", checkSelection);
  elements.shuffle.addEventListener("click", shuffleTiles);
  elements.clear.addEventListener("click", clearSelection);
  elements.newPuzzle.addEventListener("click", buildPuzzle);
  elements.backBtn.addEventListener("click", () => {
    window.location.href = "cs_games.html";
  });
};

window.addEventListener("DOMContentLoaded", initGame);
