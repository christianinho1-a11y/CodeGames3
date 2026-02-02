const LEADERBOARD_KEY = "algorithm_assembly_leaderboard";

const ALGORITHMS = [
  {
    id: "bubble",
    name: "Bubble Sort",
    description: "Swap adjacent items to bubble the largest values to the end.",
    steps: [
      "Start at the beginning of the list",
      "Compare adjacent elements",
      "Swap elements if out of order",
      "Repeat until no swaps occur",
      "Largest values collect at the end",
    ],
  },
  {
    id: "selection",
    name: "Selection Sort",
    description: "Select the smallest item and place it at the front each pass.",
    steps: [
      "Scan for the smallest unsorted element",
      "Select the smallest element found",
      "Swap it into the next open position",
      "Move the boundary forward",
      "Repeat until the list is sorted",
    ],
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    description: "Insert each item into its correct spot in a growing sorted list.",
    steps: [
      "Start with the first element as sorted",
      "Take the next element",
      "Shift larger sorted elements to the right",
      "Insert the element into the open spot",
      "Repeat for all elements",
    ],
  },
];

const DIFFICULTY_STEPS = {
  easy: 3,
  medium: 4,
  hard: 5,
};

let playerName = "";
let currentAlgorithmIndex = 0;
let currentOrder = [];
let mistakes = 0;
let score = 0;
let startTime = null;

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let difficultySelectEl;
let shuffleBtnEl;
let resetBtnEl;
let algorithmEl;
let descriptionEl;
let cardsEl;
let orderEl;
let submitBtnEl;
let nextBtnEl;
let messageEl;
let leaderboardEl;

const setModalMessage = (text, tone = "") => {
  modalMessageEl.textContent = text;
  modalMessageEl.className = `form-note ${tone}`.trim();
};

const shuffleArray = (items) => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getCurrentAlgorithm = () => ALGORITHMS[currentAlgorithmIndex % ALGORITHMS.length];

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

const saveScore = (difficultyLabel) => {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  const entries = stored ? JSON.parse(stored) : [];
  entries.push({
    name: playerName,
    score,
    difficulty: difficultyLabel,
    date: new Date().toISOString(),
  });
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  renderLeaderboard();
};

const resetOrder = () => {
  currentOrder = [];
  orderEl.innerHTML = "";
  const buttons = cardsEl.querySelectorAll("button");
  buttons.forEach((button) => {
    button.disabled = false;
  });
  messageEl.textContent = "";
};

const renderAlgorithm = () => {
  const algorithm = getCurrentAlgorithm();
  const difficulty = difficultySelectEl.value;
  const stepCount = DIFFICULTY_STEPS[difficulty];
  const steps = algorithm.steps.slice(0, stepCount);

  algorithmEl.textContent = `Algorithm: ${algorithm.name}`;
  descriptionEl.textContent = `Description: ${algorithm.description}`;

  cardsEl.innerHTML = "";
  shuffleArray(steps).forEach((step) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline chip";
    button.type = "button";
    button.textContent = step;
    button.addEventListener("click", () => {
      if (currentOrder.length >= steps.length) {
        return;
      }
      currentOrder.push(step);
      button.disabled = true;
      const li = document.createElement("li");
      li.textContent = step;
      orderEl.appendChild(li);
    });
    cardsEl.appendChild(button);
  });

  resetOrder();
  startTime = Date.now();
  submitBtnEl.disabled = false;
  nextBtnEl.disabled = true;
};

const submitOrder = () => {
  const algorithm = getCurrentAlgorithm();
  const difficulty = difficultySelectEl.value;
  const stepCount = DIFFICULTY_STEPS[difficulty];
  const expected = algorithm.steps.slice(0, stepCount);

  if (currentOrder.length !== expected.length) {
    messageEl.textContent = "Place all steps before submitting.";
    return;
  }

  let correctCount = 0;
  orderEl.querySelectorAll("li").forEach((item, index) => {
    if (currentOrder[index] === expected[index]) {
      item.classList.add("status-good");
      correctCount += 1;
    } else {
      item.classList.add("status-bad");
    }
  });

  if (correctCount === expected.length) {
    const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const bonus = Math.max(0, 60 - elapsed);
    const difficultyBonus = difficulty === "hard" ? 40 : difficulty === "medium" ? 20 : 10;
    const roundScore = 100 + bonus + difficultyBonus - mistakes * 5;
    score += roundScore;
    messageEl.textContent = `Correct! +${roundScore} pts. Ready for the next algorithm.`;
    nextBtnEl.disabled = false;
    submitBtnEl.disabled = true;
    mistakes = 0;
    saveScore(difficulty);
  } else {
    mistakes += 1;
    messageEl.textContent = "Some steps are out of order. Try again or reset.";
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
  score = 0;
  mistakes = 0;
  renderAlgorithm();
};

const init = () => {
  modalEl = document.getElementById("assemblyNameModal");
  modalNameInputEl = document.getElementById("assemblyModalName");
  modalStartBtnEl = document.getElementById("assemblyModalStart");
  modalMessageEl = document.getElementById("assemblyModalMessage");
  difficultySelectEl = document.getElementById("assemblyDifficulty");
  shuffleBtnEl = document.getElementById("assemblyShuffle");
  resetBtnEl = document.getElementById("assemblyReset");
  algorithmEl = document.getElementById("assemblyAlgorithm");
  descriptionEl = document.getElementById("assemblyDescription");
  cardsEl = document.getElementById("assemblyCards");
  orderEl = document.getElementById("assemblyOrder");
  submitBtnEl = document.getElementById("assemblySubmit");
  nextBtnEl = document.getElementById("assemblyNext");
  messageEl = document.getElementById("assemblyMessage");
  leaderboardEl = document.getElementById("assemblyLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !difficultySelectEl ||
    !shuffleBtnEl ||
    !resetBtnEl ||
    !algorithmEl ||
    !descriptionEl ||
    !cardsEl ||
    !orderEl ||
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

  shuffleBtnEl.addEventListener("click", renderAlgorithm);
  resetBtnEl.addEventListener("click", resetOrder);
  submitBtnEl.addEventListener("click", submitOrder);
  nextBtnEl.addEventListener("click", () => {
    currentAlgorithmIndex += 1;
    renderAlgorithm();
  });
};

window.addEventListener("DOMContentLoaded", init);
