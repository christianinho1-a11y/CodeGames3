const LEADERBOARD_KEY = "encryption_escape_room_leaderboard";

const LOCKS = [
  {
    story: "A sticky note says the lock uses a Caesar shift of 3.",
    cipher: "FRGH ERRP",
    answer: "CODE ROOM",
    hint: "Shift each letter back by 3.",
  },
  {
    story: "A poster shows a keyword: SAFE. Use it to decode the message.",
    cipher: "TKXKJ JSVF",
    answer: "HIDDEN KEY",
    hint: "Look for repeated letters to align the keyword.",
  },
  {
    story: "The next lock uses a simple substitution: A=Q, B=W, C=E...",
    cipher: "ITSSG ZGKSX",
    answer: "HELLO ROOM",
    hint: "It is a keyboard shift cipher.",
  },
  {
    story: "Final lock: shift letters forward by 1.",
    cipher: "BTFU UIF NFU",
    answer: "MEET THE NET",
    hint: "Shift each letter back by 1.",
  },
];

let playerName = "";
let lockIndex = 0;
let attempts = 0;
let score = 0;

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let lockEl;
let scoreEl;
let attemptsEl;
let clueEl;
let storyEl;
let cipherEl;
let answerInputEl;
let submitBtnEl;
let hintEl;
let leaderboardEl;

const normalize = (value) => value.trim().toLowerCase();

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
      item.textContent = `${entry.name} — ${entry.score} pts — ${entry.locks} locks`;
      leaderboardEl.appendChild(item);
    });
};

const saveScore = () => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  const entries = stored ? JSON.parse(stored) : [];
  entries.push({
    name: playerName,
    score,
    locks: LOCKS.length,
    date: new Date().toISOString(),
  });
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  renderLeaderboard();
};

const renderLock = () => {
  const lock = LOCKS[lockIndex];
  lockEl.textContent = lockIndex + 1;
  scoreEl.textContent = score;
  attemptsEl.textContent = attempts;
  clueEl.textContent = "Clue";
  storyEl.textContent = lock.story;
  cipherEl.textContent = lock.cipher;
  answerInputEl.value = "";
  hintEl.textContent = "";
};

const submitAnswer = () => {
  const lock = LOCKS[lockIndex];
  attempts += 1;
  attemptsEl.textContent = attempts;

  if (normalize(answerInputEl.value) === normalize(lock.answer)) {
    const lockScore = Math.max(20, 100 - attempts * 10);
    score += lockScore;
    scoreEl.textContent = score;
    hintEl.textContent = `Unlocked! +${lockScore} pts.`;
    attempts = 0;
    lockIndex += 1;

    if (lockIndex >= LOCKS.length) {
      hintEl.textContent = "All locks cleared! Score saved to the leaderboard.";
      saveScore();
      lockIndex = 0;
    }
    renderLock();
  } else if (attempts >= 3) {
    hintEl.textContent = `Hint: ${lock.hint}`;
  } else {
    hintEl.textContent = "Not quite. Try another decode.";
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
  lockIndex = 0;
  attempts = 0;
  score = 0;
  renderLock();
};

const init = () => {
  modalEl = document.getElementById("escapeRoomModal");
  modalNameInputEl = document.getElementById("escapeRoomName");
  modalStartBtnEl = document.getElementById("escapeRoomStart");
  modalMessageEl = document.getElementById("escapeRoomMessage");
  lockEl = document.getElementById("escapeLock");
  scoreEl = document.getElementById("escapeScore");
  attemptsEl = document.getElementById("escapeAttempts");
  clueEl = document.getElementById("escapeClue");
  storyEl = document.getElementById("escapeStory");
  cipherEl = document.getElementById("escapeCipher");
  answerInputEl = document.getElementById("escapeAnswer");
  submitBtnEl = document.getElementById("escapeSubmit");
  hintEl = document.getElementById("escapeHint");
  leaderboardEl = document.getElementById("escapeLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !lockEl ||
    !scoreEl ||
    !attemptsEl ||
    !clueEl ||
    !storyEl ||
    !cipherEl ||
    !answerInputEl ||
    !submitBtnEl ||
    !hintEl ||
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
  submitBtnEl.addEventListener("click", submitAnswer);
};

window.addEventListener("DOMContentLoaded", init);
