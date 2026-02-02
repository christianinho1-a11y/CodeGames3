const LEADERBOARD_KEY = "network_defender_leaderboard";

const WAVES = [
  ["DDoS", "Malware", "Phishing"],
  ["Malware", "DDoS", "Phishing", "Malware"],
  ["Phishing", "DDoS", "Malware", "DDoS"],
];

const DEFENSE_MAP = {
  Firewall: ["DDoS", "Scan"],
  Antivirus: ["Malware", "Virus"],
  IDS: ["Phishing", "Spyware"],
};

let playerName = "";
let waveIndex = 0;
let score = 0;
let health = 3;

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let scoreEl;
let healthEl;
let waveEl;
let slot1El;
let slot2El;
let slot3El;
let attacksEl;
let runBtnEl;
let resetBtnEl;
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
      item.textContent = `${entry.name} — ${entry.score} pts — waves ${entry.waves}`;
      leaderboardEl.appendChild(item);
    });
};

const saveScore = () => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  const entries = stored ? JSON.parse(stored) : [];
  entries.push({
    name: playerName,
    score,
    waves: waveIndex,
    date: new Date().toISOString(),
  });
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  renderLeaderboard();
};

const renderWave = () => {
  const wave = WAVES[waveIndex];
  attacksEl.innerHTML = "";
  wave.forEach((attack) => {
    const item = document.createElement("li");
    item.textContent = attack;
    attacksEl.appendChild(item);
  });
  waveEl.textContent = `${waveIndex + 1} / ${WAVES.length}`;
  scoreEl.textContent = score;
  healthEl.textContent = health;
  messageEl.textContent = "";
};

const resetDefenses = () => {
  slot1El.value = "";
  slot2El.value = "";
  slot3El.value = "";
  messageEl.textContent = "Defenses cleared.";
};

const runWave = () => {
  const wave = WAVES[waveIndex];
  const defenses = [slot1El.value, slot2El.value, slot3El.value].filter(Boolean);
  let blocked = 0;
  let leaked = 0;

  wave.forEach((attack) => {
    const handled = defenses.some((defense) => DEFENSE_MAP[defense]?.includes(attack));
    if (handled) {
      blocked += 1;
    } else {
      leaked += 1;
    }
  });

  score += blocked * 15;
  health -= leaked > 0 ? 1 : 0;
  scoreEl.textContent = score;
  healthEl.textContent = health;

  messageEl.textContent = `Wave results: ${blocked} blocked, ${leaked} got through.`;

  waveIndex += 1;
  if (health <= 0 || waveIndex >= WAVES.length) {
    saveScore();
    messageEl.textContent += " Run complete! Score saved to the leaderboard.";
    waveIndex = 0;
    health = 3;
    score = 0;
  }

  renderWave();
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
  waveIndex = 0;
  score = 0;
  health = 3;
  renderWave();
};

const init = () => {
  modalEl = document.getElementById("defenderModal");
  modalNameInputEl = document.getElementById("defenderName");
  modalStartBtnEl = document.getElementById("defenderStart");
  modalMessageEl = document.getElementById("defenderModalMessage");
  scoreEl = document.getElementById("defenderScore");
  healthEl = document.getElementById("defenderHealth");
  waveEl = document.getElementById("defenderWave");
  slot1El = document.getElementById("defenderSlot1");
  slot2El = document.getElementById("defenderSlot2");
  slot3El = document.getElementById("defenderSlot3");
  attacksEl = document.getElementById("defenderAttacks");
  runBtnEl = document.getElementById("defenderRun");
  resetBtnEl = document.getElementById("defenderReset");
  messageEl = document.getElementById("defenderMessage");
  leaderboardEl = document.getElementById("defenderLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !scoreEl ||
    !healthEl ||
    !waveEl ||
    !slot1El ||
    !slot2El ||
    !slot3El ||
    !attacksEl ||
    !runBtnEl ||
    !resetBtnEl ||
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
  runBtnEl.addEventListener("click", runWave);
  resetBtnEl.addEventListener("click", resetDefenses);
};

window.addEventListener("DOMContentLoaded", init);
