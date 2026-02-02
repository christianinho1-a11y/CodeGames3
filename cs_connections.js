const CONNECTIONS_STORAGE_KEY = "cs_connections_leaderboard";
const CONNECTIONS_PUZZLE_COUNT = 4;
const MAX_STRIKES = 4;
const DAILY_KEY_PREFIX = "cs_connections_daily";

let playerName = "";
let puzzleGroups = [];
let tiles = [];
let selected = new Set();
let solvedGroups = [];
let strikes = 0;
let timerInterval;
let startTime;
let puzzleId = 0;
let currentTopic = "all";

const elements = {};

const validTopic = (topic) => ["all", "cs", "it", "cyber", "essentials"].includes(topic);
const topicLabels = {
  all: "All Topics",
  cs: "Computer Science",
  it: "Information Technology",
  cyber: "Cybersecurity",
  essentials: "Computer Essentials",
};

const getTopicFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic");
  return validTopic(topic) ? topic : "all";
};

const getBackLinkFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("from") || "cs_games.html";
};

const getBackLabel = (href) => {
  if (href.includes("it_games")) {
    return "IT Games";
  }
  if (href.includes("computer_essentials")) {
    return "Computer Essentials";
  }
  if (href.includes("cyber_games")) {
    return "Cyber Games";
  }
  return "CS Games";
};

const getTodayKey = () => new Date().toISOString().split("T")[0];

const getDailyKey = () => {
  if (!playerName) {
    return "";
  }
  return `${DAILY_KEY_PREFIX}_${currentTopic}_${playerName.toLowerCase()}_${getTodayKey()}`;
};

const hasPlayedToday = () => {
  const key = getDailyKey();
  return key ? localStorage.getItem(key) === "done" : false;
};

const markPlayedToday = () => {
  const key = getDailyKey();
  if (key) {
    localStorage.setItem(key, "done");
  }
};

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
      const topicLabel = topicLabels[entry.topic] || "All Topics";
      item.textContent = `${entry.name} — ${formatTime(entry.timeSeconds)} — ${date} — Puzzle ${entry.puzzleId} — Solved ${entry.solvedCount} — ${topicLabel}`;
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
    topic: currentTopic,
  };

  const entries = loadLeaderboard();
  entries.push(entry);
  saveLeaderboardLocal(entries);
  updateLeaderboardUI();
  saveLeaderboardRemote(entry);
  markPlayedToday();
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

const getGroupsForTopic = () => {
  if (!Array.isArray(CONNECTIONS_GROUPS)) {
    return [];
  }
  if (currentTopic === "all") {
    return CONNECTIONS_GROUPS;
  }
  return CONNECTIONS_GROUPS.filter((group) => (group.topic || "cs") === currentTopic);
};

const buildPuzzle = () => {
  if (hasPlayedToday()) {
    elements.grid.innerHTML = "";
    elements.solvedGroups.innerHTML = "";
    elements.endCard.hidden = true;
    elements.message.textContent = "Daily Connections puzzle already completed for this topic. Come back tomorrow.";
    elements.submit.disabled = true;
    stopTimer();
    return;
  }

  const pool = getGroupsForTopic();
  if (!pool.length || pool.length < 4) {
    elements.grid.innerHTML = "";
    elements.solvedGroups.innerHTML = "";
    elements.endCard.hidden = true;
    elements.message.textContent = "Not enough groups for this topic yet.";
    elements.submit.disabled = true;
    return;
  }

  const shuffled = shuffle(pool);
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
  if (hasPlayedToday()) {
    elements.nameMessage.textContent = "You already completed today's puzzle for this topic.";
    elements.nameMessage.className = "form-note warning";
    return;
  }
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
  elements.topicSelect = document.getElementById("connectionsTopic");
  elements.backLink = document.getElementById("connectionsBackLink");

  if (Object.values(elements).some((el) => !el)) {
    return;
  }

  elements.backLink.href = getBackLinkFromQuery();
  const backLabel = getBackLabel(elements.backLink.href);
  elements.backLink.textContent = `← Back to ${backLabel}`;
  const initialTopic = getTopicFromQuery();
  elements.topicSelect.value = initialTopic;
  currentTopic = initialTopic;

  updateLeaderboardUI();
  openNameModal();

  elements.startBtn.addEventListener("click", startGame);
  elements.submit.addEventListener("click", checkSelection);
  elements.shuffle.addEventListener("click", shuffleTiles);
  elements.clear.addEventListener("click", clearSelection);
  elements.newPuzzle.addEventListener("click", buildPuzzle);
  elements.backBtn.addEventListener("click", () => {
    window.location.href = getBackLinkFromQuery();
  });
  elements.backBtn.textContent = `← Back to ${backLabel}`;
  elements.topicSelect.addEventListener("change", (event) => {
    currentTopic = validTopic(event.target.value) ? event.target.value : "all";
    if (playerName) {
      buildPuzzle();
    } else {
      elements.grid.innerHTML = "";
      elements.solvedGroups.innerHTML = "";
      elements.message.textContent = "Start the game to load a puzzle for this topic.";
    }
  });
};

window.addEventListener("DOMContentLoaded", initGame);
