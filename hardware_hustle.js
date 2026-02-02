const LEADERBOARD_KEY = "hardware_hustle_leaderboard";

const ROUNDS = [
  {
    slots: [
      { label: "CPU Socket", answer: "CPU" },
      { label: "RAM Slots", answer: "RAM" },
      { label: "PCIe Slot", answer: "GPU" },
    ],
    options: ["CPU", "RAM", "GPU", "SSD"],
  },
  {
    slots: [
      { label: "Storage Bay", answer: "SSD" },
      { label: "Power Supply Bay", answer: "Power Supply" },
      { label: "Motherboard Tray", answer: "Motherboard" },
    ],
    options: ["SSD", "Power Supply", "Motherboard", "RAM"],
  },
  {
    slots: [
      { label: "M.2 Slot", answer: "M.2 SSD" },
      { label: "CPU Cooler Mount", answer: "CPU Cooler" },
      { label: "Front Panel", answer: "Case Fans" },
    ],
    options: ["M.2 SSD", "CPU Cooler", "Case Fans", "GPU"],
  },
];

let playerName = "";
let roundIndex = 0;
let score = 0;

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let scoreEl;
let roundEl;
let slotsEl;
let submitBtnEl;
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

const renderRound = () => {
  const round = ROUNDS[roundIndex];
  slotsEl.innerHTML = "";
  roundEl.textContent = `${roundIndex + 1} / ${ROUNDS.length}`;
  messageEl.textContent = "";
  nextBtnEl.disabled = true;

  round.slots.forEach((slot, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "slot-card";

    const label = document.createElement("p");
    label.className = "slot-label";
    label.textContent = slot.label;

    const select = document.createElement("select");
    select.className = "input";
    select.dataset.slotIndex = index;
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select component";
    select.appendChild(placeholder);
    round.options.forEach((option) => {
      const optionEl = document.createElement("option");
      optionEl.value = option;
      optionEl.textContent = option;
      select.appendChild(optionEl);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    slotsEl.appendChild(wrapper);
  });
};

const checkRound = () => {
  const round = ROUNDS[roundIndex];
  let correct = 0;
  const selects = slotsEl.querySelectorAll("select");

  selects.forEach((select, index) => {
    const answer = round.slots[index].answer;
    if (select.value === answer) {
      correct += 1;
      select.classList.add("success");
    } else {
      select.classList.add("warning");
    }
  });

  if (correct === round.slots.length) {
    score += 50;
    messageEl.textContent = "Perfect build! +50 pts.";
    nextBtnEl.disabled = false;
  } else {
    score += correct * 10;
    messageEl.textContent = `You matched ${correct} slot(s). Adjust and try again.`;
  }
  scoreEl.textContent = score;
};

const nextRound = () => {
  roundIndex += 1;
  if (roundIndex >= ROUNDS.length) {
    saveScore();
    messageEl.textContent = "Build complete! Score saved to the leaderboard.";
    roundIndex = 0;
  }
  renderRound();
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
  roundIndex = 0;
  score = 0;
  scoreEl.textContent = score;
  renderRound();
};

const init = () => {
  modalEl = document.getElementById("hardwareModal");
  modalNameInputEl = document.getElementById("hardwareName");
  modalStartBtnEl = document.getElementById("hardwareStart");
  modalMessageEl = document.getElementById("hardwareModalMessage");
  scoreEl = document.getElementById("hardwareScore");
  roundEl = document.getElementById("hardwareRound");
  slotsEl = document.getElementById("hardwareSlots");
  submitBtnEl = document.getElementById("hardwareSubmit");
  nextBtnEl = document.getElementById("hardwareNext");
  messageEl = document.getElementById("hardwareMessage");
  leaderboardEl = document.getElementById("hardwareLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !scoreEl ||
    !roundEl ||
    !slotsEl ||
    !submitBtnEl ||
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
  submitBtnEl.addEventListener("click", checkRound);
  nextBtnEl.addEventListener("click", nextRound);
};

window.addEventListener("DOMContentLoaded", init);
