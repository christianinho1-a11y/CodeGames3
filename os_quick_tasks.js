const LEADERBOARD_KEY = "os_quick_tasks_leaderboard";

const TASKS = [
  {
    prompt: "Rename a file named 'Notes.txt' to 'Notes_2024.txt'.",
    steps: ["Right-click the file", "Choose Rename"],
    actions: [
      "Right-click the file",
      "Choose Rename",
      "Open Settings",
      "Delete the file",
    ],
  },
  {
    prompt: "Create a new folder named 'Homework'.",
    steps: ["Right-click on the desktop", "Select New Folder"],
    actions: [
      "Right-click on the desktop",
      "Select New Folder",
      "Press Print Screen",
      "Open Task Manager",
    ],
  },
  {
    prompt: "Take a screenshot of your screen.",
    steps: ["Press the screenshot shortcut", "Save the screenshot"],
    actions: [
      "Press the screenshot shortcut",
      "Save the screenshot",
      "Open Recycle Bin",
      "Close the window",
    ],
  },
  {
    prompt: "Move a file into a folder named 'Projects'.",
    steps: ["Drag the file", "Drop it into Projects"],
    actions: [
      "Drag the file",
      "Drop it into Projects",
      "Open Control Panel",
      "Restart the computer",
    ],
  },
  {
    prompt: "Change the desktop background.",
    steps: ["Right-click on the desktop", "Choose Personalize"],
    actions: [
      "Right-click on the desktop",
      "Choose Personalize",
      "Open Downloads",
      "Sign out of the account",
    ],
  },
];

let playerName = "";
let taskIndex = 0;
let stepIndex = 0;
let score = 0;

let modalEl;
let modalNameInputEl;
let modalStartBtnEl;
let modalMessageEl;
let scoreEl;
let roundEl;
let taskPromptEl;
let stepHintEl;
let actionsEl;
let messageEl;
let nextBtnEl;
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

const renderTask = () => {
  const task = TASKS[taskIndex];
  taskPromptEl.textContent = task.prompt;
  roundEl.textContent = `${taskIndex + 1} / ${TASKS.length}`;
  stepIndex = 0;
  stepHintEl.textContent = `Step ${stepIndex + 1} of ${task.steps.length}`;
  actionsEl.innerHTML = "";
  messageEl.textContent = "";
  nextBtnEl.disabled = true;

  task.actions.forEach((action) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline";
    button.type = "button";
    button.textContent = action;
    button.addEventListener("click", () => handleAction(action));
    actionsEl.appendChild(button);
  });
};

const handleAction = (action) => {
  const task = TASKS[taskIndex];
  if (action === task.steps[stepIndex]) {
    score += 10;
    stepIndex += 1;
    if (stepIndex >= task.steps.length) {
      messageEl.textContent = "Task complete!";
      nextBtnEl.disabled = false;
      actionsEl.querySelectorAll("button").forEach((btn) => {
        btn.disabled = true;
      });
    } else {
      messageEl.textContent = "Nice! Keep going.";
      stepHintEl.textContent = `Step ${stepIndex + 1} of ${task.steps.length}`;
    }
  } else {
    score = Math.max(0, score - 5);
    messageEl.textContent = "Not quite. Try a different action.";
  }
  scoreEl.textContent = score;
};

const nextTask = () => {
  taskIndex += 1;
  if (taskIndex >= TASKS.length) {
    saveScore();
    messageEl.textContent = "All tasks complete! Score saved to the leaderboard.";
    taskIndex = 0;
  }
  renderTask();
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
  taskIndex = 0;
  renderTask();
};

const init = () => {
  modalEl = document.getElementById("osModal");
  modalNameInputEl = document.getElementById("osName");
  modalStartBtnEl = document.getElementById("osStart");
  modalMessageEl = document.getElementById("osModalMessage");
  scoreEl = document.getElementById("osScore");
  roundEl = document.getElementById("osRound");
  taskPromptEl = document.getElementById("osTaskPrompt");
  stepHintEl = document.getElementById("osStepHint");
  actionsEl = document.getElementById("osActions");
  messageEl = document.getElementById("osMessage");
  nextBtnEl = document.getElementById("osNext");
  leaderboardEl = document.getElementById("osLeaderboard");

  if (
    !modalEl ||
    !modalNameInputEl ||
    !modalStartBtnEl ||
    !modalMessageEl ||
    !scoreEl ||
    !roundEl ||
    !taskPromptEl ||
    !stepHintEl ||
    !actionsEl ||
    !messageEl ||
    !nextBtnEl ||
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
  nextBtnEl.addEventListener("click", nextTask);
};

window.addEventListener("DOMContentLoaded", init);
