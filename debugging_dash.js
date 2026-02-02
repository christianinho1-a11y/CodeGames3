const LEADERBOARD_KEY = "debugging_dash_leaderboard";

const BUG_SNIPPETS = {
  easy: [
    {
      code: `let score = 10;\nif (score > 10) {\n  print("Level up");\n}`,
      bugs: [
        { id: "print", label: "print() should be console.log()" },
      ],
      options: [
        "print() should be console.log()",
        "Condition should be score >= 10",
        "Missing semicolon after score",
      ],
    },
  ],
  medium: [
    {
      code: `const names = ["Ava", "Kai"];\nif (names.length = 2) {\n  message = "Team ready";\n}`,
      bugs: [
        { id: "assign", label: "Uses = instead of === in the condition" },
        { id: "message", label: "message is assigned without let/const" },
      ],
      options: [
        "Uses = instead of === in the condition",
        "message is assigned without let/const",
        "Array should use {} instead of []",
        "names.length should be 3",
      ],
    },
  ],
  hard: [
    {
      code: `let points = 0;\nfor (let i = 0; i <= 5; i++) {\n  points = points + i;\n}\nif (points = 10 && i === 5) {\n  announce("Ready");\n}`,
      bugs: [
        { id: "scope", label: "i is out of scope in the if statement" },
        { id: "assign", label: "Uses = instead of === for points" },
        { id: "announce", label: "announce() is not defined" },
      ],
      options: [
        "i is out of scope in the if statement",
        "Uses = instead of === for points",
        "announce() is not defined",
        "Loop should start at i = 1",
      ],
    },
  ],
};

const TIMER_LIMITS = {
  easy: 45,
  medium: 40,
  hard: 35,
};

let playerName = "";
let roundIndex = 0;
let score = 0;
let timerId = null;
let timeRemaining = 0;
let selected = new Set();

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let difficultySelectEl;
let startBtnEl;
let timerEl;
let scoreEl;
let roundEl;
let codeEl;
let choicesEl;
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
      item.textContent = `${entry.name} — ${entry.score} pts — ${entry.difficulty}`;
      leaderboardEl.appendChild(item);
    });
};

const saveScore = (difficulty) => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  const entries = stored ? JSON.parse(stored) : [];
  entries.push({
    name: playerName,
    score,
    difficulty,
    date: new Date().toISOString(),
  });
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  renderLeaderboard();
};

const resetTimer = () => {
  if (timerId) {
    clearInterval(timerId);
  }
  timerId = null;
};

const startTimer = (seconds) => {
  timeRemaining = seconds;
  timerEl.textContent = timeRemaining;
  timerId = setInterval(() => {
    timeRemaining -= 1;
    timerEl.textContent = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(timerId);
      timerId = null;
      submitBtnEl.disabled = true;
      messageEl.textContent = "Time's up! Click Next Snippet to continue.";
      nextBtnEl.disabled = false;
    }
  }, 1000);
};

const getCurrentSnippet = () => {
  const difficulty = difficultySelectEl.value;
  const snippets = BUG_SNIPPETS[difficulty];
  return snippets[roundIndex % snippets.length];
};

const renderSnippet = () => {
  const difficulty = difficultySelectEl.value;
  const snippet = getCurrentSnippet();
  selected = new Set();
  messageEl.textContent = "";
  codeEl.textContent = snippet.code;
  choicesEl.innerHTML = "";
  roundEl.textContent = `${roundIndex + 1} / 3`;

  snippet.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline chip";
    button.textContent = option;
    button.type = "button";
    button.addEventListener("click", () => {
      if (selected.has(option)) {
        selected.delete(option);
        button.classList.remove("chip-selected");
      } else {
        selected.add(option);
        button.classList.add("chip-selected");
      }
    });
    choicesEl.appendChild(button);
  });

  submitBtnEl.disabled = false;
  nextBtnEl.disabled = true;
  resetTimer();
  startTimer(TIMER_LIMITS[difficulty]);
};

const submitBugs = () => {
  const snippet = getCurrentSnippet();
  const correctLabels = snippet.bugs.map((bug) => bug.label);
  let correctCount = 0;
  let wrongCount = 0;

  selected.forEach((choice) => {
    if (correctLabels.includes(choice)) {
      correctCount += 1;
    } else {
      wrongCount += 1;
    }
  });

  const allFound = correctCount === correctLabels.length && wrongCount === 0;
  const roundScore = correctCount * 15 + Math.max(0, timeRemaining) - wrongCount * 10;
  score += Math.max(0, roundScore);
  scoreEl.textContent = score;

  if (allFound) {
    messageEl.textContent = `Great job! You found every bug (+${roundScore} pts).`;
  } else {
    messageEl.textContent = `You found ${correctCount} bug(s). Review and move on.`;
  }

  submitBtnEl.disabled = true;
  nextBtnEl.disabled = false;
  resetTimer();
};

const nextSnippet = () => {
  roundIndex += 1;
  if (roundIndex >= 3) {
    const difficulty = difficultySelectEl.value;
    saveScore(difficulty);
    messageEl.textContent = "Round complete! Score saved to the leaderboard.";
    roundIndex = 0;
  }
  renderSnippet();
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
  roundIndex = 0;
  renderSnippet();
};

const init = () => {
  modalEl = document.getElementById("debugNameModal");
  modalNameInputEl = document.getElementById("debugModalName");
  modalStartBtnEl = document.getElementById("debugModalStart");
  modalMessageEl = document.getElementById("debugModalMessage");
  difficultySelectEl = document.getElementById("debugDifficulty");
  startBtnEl = document.getElementById("debugStartBtn");
  timerEl = document.getElementById("debugTimer");
  scoreEl = document.getElementById("debugScore");
  roundEl = document.getElementById("debugRound");
  codeEl = document.getElementById("debugCode");
  choicesEl = document.getElementById("debugChoices");
  submitBtnEl = document.getElementById("debugSubmit");
  nextBtnEl = document.getElementById("debugNext");
  messageEl = document.getElementById("debugMessage");
  leaderboardEl = document.getElementById("debugLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !difficultySelectEl ||
    !startBtnEl ||
    !timerEl ||
    !scoreEl ||
    !roundEl ||
    !codeEl ||
    !choicesEl ||
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

  startBtnEl.addEventListener("click", () => {
    score = 0;
    scoreEl.textContent = score;
    roundIndex = 0;
    renderSnippet();
  });
  submitBtnEl.addEventListener("click", submitBugs);
  nextBtnEl.addEventListener("click", nextSnippet);
};

window.addEventListener("DOMContentLoaded", init);
