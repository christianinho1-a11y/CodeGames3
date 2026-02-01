// cs-tenable.js
// CS Tenable – Top 10 Computer Science guessing game

const TENABLE_CATEGORIES = [
  {
    title: "Programming Languages Students Should Know",
    answers: [
      "Python",
      "Java",
      "JavaScript",
      "C++",
      "C#",
      "HTML/CSS",
      "SQL",
      "Swift",
      "Kotlin",
      "Scratch",
    ],
  },
  {
    title: "Core Computer Science Ideas",
    answers: [
      "Algorithms",
      "Data structures",
      "Variables",
      "Loops",
      "Conditionals",
      "Functions",
      "Abstraction",
      "Debugging",
      "Recursion",
      "Object-oriented programming",
    ],
  },
  {
    title: "Common Data Structures",
    answers: [
      "Array",
      "List",
      "Stack",
      "Queue",
      "Hash table",
      "Tree",
      "Binary search tree",
      "Heap",
      "Graph",
      "Set",
    ],
  },
  {
    title: "Famous Algorithms",
    answers: [
      "Linear search",
      "Binary search",
      "Bubble sort",
      "Selection sort",
      "Insertion sort",
      "Merge sort",
      "Quick sort",
      "Dijkstra’s shortest path",
      "Breadth-first search",
      "Depth-first search",
    ],
  },
  {
    title: "Computer Science Careers",
    answers: [
      "Software developer",
      "Web developer",
      "Data scientist",
      "Game developer",
      "Cybersecurity analyst",
      "Network administrator",
      "Database administrator",
      "Systems analyst",
      "Machine learning engineer",
      "IT support specialist",
    ],
  },
];

const MAX_STRIKES = 3;
const LEADERBOARD_KEY = "cs_tenable_leaderboard";

let currentCategoryIndex = -1;
let currentCategory = null;
let revealedAnswers = [];
let normalizedAnswers = [];
let strikes = 0;
let correctCount = 0;
let roundOver = false;
let playerName = "";
let scoreSaved = false;

let categoryTitleEl;
let answerBoardEl;
let correctCountEl;
let totalCountEl;
let strikeCountEl;
let maxStrikesEl;
let guessInputEl;
let submitBtnEl;
let revealBtnEl;
let nextBtnEl;
let backBtnEl;
let messageEl;
let summaryEl;
let startBtnEl;
let nameModalEl;
let modalNameInputEl;
let modalMessageEl;
let modalStartBtnEl;
let leaderboardEl;

const normalizeGuess = (value) => value.trim().toLowerCase();

const findMatchingAnswerIndex = (guess) => {
  const guessTokens = guess.split(/\s+/).filter(Boolean);

  return normalizedAnswers.findIndex((answer, index) => {
    if (revealedAnswers[index]) {
      return false;
    }

    if (answer.includes(guess) || guess.includes(answer)) {
      return true;
    }

    return guessTokens.some((token) => token.length > 1 && answer.includes(token));
  });
};

const pickNewCategory = () => {
  if (TENABLE_CATEGORIES.length === 1) {
    currentCategoryIndex = 0;
    return TENABLE_CATEGORIES[0];
  }

  let nextIndex = currentCategoryIndex;
  while (nextIndex === currentCategoryIndex) {
    nextIndex = Math.floor(Math.random() * TENABLE_CATEGORIES.length);
  }

  currentCategoryIndex = nextIndex;
  return TENABLE_CATEGORIES[nextIndex];
};

const updateScoreboard = () => {
  correctCountEl.textContent = correctCount;
  strikeCountEl.textContent = strikes;
  totalCountEl.textContent = currentCategory ? currentCategory.answers.length : 0;
  maxStrikesEl.textContent = MAX_STRIKES;
};

const setMessage = (text, tone = "") => {
  messageEl.textContent = text;
  messageEl.className = `tenable-message ${tone}`.trim();
};

const setSummary = (text, tone = "") => {
  summaryEl.textContent = text;
  summaryEl.className = `tenable-summary ${tone}`.trim();
};

const setModalMessage = (text, tone = "") => {
  modalMessageEl.textContent = text;
  modalMessageEl.className = `form-note ${tone}`.trim();
};

const loadLeaderboard = () => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveLeaderboard = (entries) => {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
};

const updateLeaderboardUI = () => {
  const entries = loadLeaderboard();
  leaderboardEl.innerHTML = "";

  if (!entries.length) {
    const empty = document.createElement("li");
    empty.textContent = "No scores yet. Be the first!";
    leaderboardEl.appendChild(empty);
    return;
  }

  entries
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = `${entry.name} — ${entry.score} / ${entry.total} (${entry.category})`;
      leaderboardEl.appendChild(item);
    });
};

const saveScore = () => {
  if (scoreSaved) {
    return;
  }
  const entries = loadLeaderboard();
  entries.push({
    name: playerName,
    score: correctCount,
    total: currentCategory.answers.length,
    category: currentCategory.title,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  scoreSaved = true;
};

const renderBoard = () => {
  answerBoardEl.innerHTML = "";

  currentCategory.answers.forEach((answer, index) => {
    const slot = document.createElement("div");
    slot.className = "tenable-slot";
    slot.dataset.index = index;

    const indexBadge = document.createElement("span");
    indexBadge.className = "tenable-slot-index";
    indexBadge.textContent = `${currentCategory.answers.length - index}.`;

    const text = document.createElement("span");
    if (revealedAnswers[index]) {
      slot.classList.add("revealed");
      text.textContent = answer;
    } else {
      text.textContent = "Hidden";
    }

    slot.append(indexBadge, text);
    answerBoardEl.appendChild(slot);
  });
};

const setRoundState = (isOver) => {
  roundOver = isOver;
  guessInputEl.disabled = isOver;
  submitBtnEl.disabled = isOver;
  revealBtnEl.disabled = isOver;
};

const revealAllAnswers = () => {
  revealedAnswers = revealedAnswers.map(() => true);
  renderBoard();
};

const endRound = (summaryText) => {
  revealAllAnswers();
  setRoundState(true);
  setSummary(summaryText, "info");
  saveScore();
};

const handleCorrectGuess = (answerIndex) => {
  revealedAnswers[answerIndex] = true;
  correctCount += 1;
  renderBoard();
  updateScoreboard();
  setMessage("Nice! That answer is in the Top 10.", "success");

  if (correctCount === currentCategory.answers.length) {
    endRound("You found all 10 answers! Great work.");
  }
};

const handleIncorrectGuess = () => {
  strikes += 1;
  updateScoreboard();
  setMessage("Not in the Top 10 — that’s a strike.", "warning");

  if (strikes >= MAX_STRIKES) {
    endRound("Round over — you’re out of strikes.");
  }
};

const handleGuess = () => {
  if (roundOver) {
    return;
  }

  const guess = normalizeGuess(guessInputEl.value);
  if (!guess) {
    setMessage("Type a guess before submitting.", "warning");
    return;
  }

  const answerIndex = findMatchingAnswerIndex(guess);
  if (answerIndex === -1) {
    handleIncorrectGuess();
  } else if (revealedAnswers[answerIndex]) {
    setMessage("You already found that one.", "info");
  } else {
    handleCorrectGuess(answerIndex);
  }

  guessInputEl.value = "";
  guessInputEl.focus();
};

const openNameModal = () => {
  nameModalEl.classList.remove("hidden");
  modalNameInputEl.focus();
};

const closeNameModal = () => {
  nameModalEl.classList.add("hidden");
};

const startNewRound = () => {
  if (!playerName) {
    openNameModal();
    return;
  }

  currentCategory = pickNewCategory();
  revealedAnswers = currentCategory.answers.map(() => false);
  normalizedAnswers = currentCategory.answers.map((answer) =>
    normalizeGuess(answer)
  );
  strikes = 0;
  correctCount = 0;
  scoreSaved = false;
  setRoundState(false);
  setMessage("");
  setSummary("");
  setModalMessage("");

  categoryTitleEl.textContent = currentCategory.title;
  updateScoreboard();
  renderBoard();

  guessInputEl.value = "";
  guessInputEl.focus();
};

const startGame = () => {
  const nameValue = modalNameInputEl.value.trim();
  if (!nameValue) {
    setModalMessage("Please enter your name to start.", "warning");
    return;
  }
  playerName = nameValue;
  setModalMessage("");
  closeNameModal();
  startNewRound();
};

const initGame = () => {
  categoryTitleEl = document.getElementById("tenableCategoryTitle");
  answerBoardEl = document.getElementById("tenableAnswerBoard");
  correctCountEl = document.getElementById("tenableCorrectCount");
  totalCountEl = document.getElementById("tenableTotalCount");
  strikeCountEl = document.getElementById("tenableStrikeCount");
  maxStrikesEl = document.getElementById("tenableMaxStrikes");
  guessInputEl = document.getElementById("tenableGuessInput");
  submitBtnEl = document.getElementById("tenableSubmitBtn");
  revealBtnEl = document.getElementById("tenableRevealBtn");
  nextBtnEl = document.getElementById("tenableNextBtn");
  backBtnEl = document.getElementById("tenableBackBtn");
  messageEl = document.getElementById("tenableMessage");
  summaryEl = document.getElementById("tenableSummary");
  startBtnEl = document.getElementById("tenableStartBtn");
  nameModalEl = document.getElementById("tenableNameModal");
  modalNameInputEl = document.getElementById("tenableModalName");
  modalMessageEl = document.getElementById("tenableModalMessage");
  modalStartBtnEl = document.getElementById("tenableModalStart");
  leaderboardEl = document.getElementById("tenableLeaderboard");

  if (
    !categoryTitleEl ||
    !answerBoardEl ||
    !correctCountEl ||
    !totalCountEl ||
    !strikeCountEl ||
    !maxStrikesEl ||
    !guessInputEl ||
    !submitBtnEl ||
    !revealBtnEl ||
    !nextBtnEl ||
    !backBtnEl ||
    !messageEl ||
    !summaryEl ||
    !startBtnEl ||
    !nameModalEl ||
    !modalNameInputEl ||
    !modalMessageEl ||
    !modalStartBtnEl ||
    !leaderboardEl
  ) {
    return;
  }

  updateLeaderboardUI();

  setRoundState(true);

  submitBtnEl.addEventListener("click", handleGuess);
  guessInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleGuess();
    }
  });

  revealBtnEl.addEventListener("click", () => {
    if (roundOver) {
      return;
    }
    endRound("Remaining answers revealed.");
  });

  startBtnEl.addEventListener("click", startNewRound);
  modalStartBtnEl.addEventListener("click", startGame);

  nextBtnEl.addEventListener("click", startNewRound);

  backBtnEl.addEventListener("click", () => {
    window.location.href = "cs_games.html";
  });

  answerBoardEl.innerHTML = "";
  updateScoreboard();
  openNameModal();
};

window.addEventListener("DOMContentLoaded", initGame);
