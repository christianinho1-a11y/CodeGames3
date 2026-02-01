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

let currentCategoryIndex = -1;
let currentCategory = null;
let revealedAnswers = [];
let normalizedAnswers = [];
let strikes = 0;
let correctCount = 0;
let roundOver = false;

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

const normalizeGuess = (value) => value.trim().toLowerCase();

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
  totalCountEl.textContent = currentCategory.answers.length;
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

const renderBoard = () => {
  answerBoardEl.innerHTML = "";

  currentCategory.answers.forEach((answer, index) => {
    const slot = document.createElement("div");
    slot.className = "tenable-slot";
    slot.dataset.index = index;

    const indexBadge = document.createElement("span");
    indexBadge.className = "tenable-slot-index";
    indexBadge.textContent = `${index + 1}.`;

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

  const answerIndex = normalizedAnswers.indexOf(guess);
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

const startNewRound = () => {
  currentCategory = pickNewCategory();
  revealedAnswers = currentCategory.answers.map(() => false);
  normalizedAnswers = currentCategory.answers.map((answer) =>
    normalizeGuess(answer)
  );
  strikes = 0;
  correctCount = 0;
  setRoundState(false);
  setMessage("");
  setSummary("");

  categoryTitleEl.textContent = currentCategory.title;
  updateScoreboard();
  renderBoard();

  guessInputEl.value = "";
  guessInputEl.focus();
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
    !summaryEl
  ) {
    return;
  }

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

  nextBtnEl.addEventListener("click", startNewRound);

  backBtnEl.addEventListener("click", () => {
    window.location.href = "cs_games.html";
  });

  startNewRound();
};

window.addEventListener("DOMContentLoaded", initGame);
