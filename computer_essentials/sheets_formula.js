const LEADERBOARD_KEY = "sheets_formula_leaderboard";

const LEVELS = {
  level1: {
    label: "Level 1 - Basics",
    questions: [
      {
        prompt: "Add the values in cells B2 through B6.",
        table: {
          headers: ["Item", "Score"],
          rows: [
            ["Quiz 1", "7"],
            ["Quiz 2", "8"],
            ["Quiz 3", "10"],
            ["Quiz 4", "9"],
            ["Quiz 5", "6"],
          ],
        },
        answer: "=SUM(B2:B6)",
      },
      {
        prompt: "Find the average score in B2:B6.",
        table: {
          headers: ["Quiz", "Score"],
          rows: [
            ["1", "82"],
            ["2", "91"],
            ["3", "76"],
            ["4", "88"],
            ["5", "95"],
          ],
        },
        answer: "=AVERAGE(B2:B6)",
      },
      {
        prompt: "Return the highest value in B2:B6.",
        table: {
          headers: ["Task", "Minutes"],
          rows: [
            ["Research", "18"],
            ["Draft", "25"],
            ["Review", "12"],
            ["Slides", "30"],
            ["Practice", "15"],
          ],
        },
        answer: "=MAX(B2:B6)",
      },
      {
        prompt: "Return the smallest value in B2:B6.",
        table: {
          headers: ["Station", "Minutes"],
          rows: [
            ["Keyboard", "4"],
            ["Mouse", "7"],
            ["Headphones", "3"],
            ["Printer", "6"],
            ["Monitor", "5"],
          ],
        },
        answer: "=MIN(B2:B6)",
      },
      {
        prompt: "Count how many numbers are in B2:B6.",
        table: {
          headers: ["Device", "Inventory"],
          rows: [
            ["Chromebooks", "24"],
            ["Tablets", "14"],
            ["Cables", "32"],
            ["Adapters", "8"],
            ["Projectors", "2"],
          ],
        },
        answer: "=COUNT(B2:B6)",
      },
    ],
  },
  level2: {
    label: "Level 2 - Cell Referencing",
    questions: [
      {
        prompt: "Lock column A and row 2 in a formula.",
        table: {
          headers: ["Item", "Price"],
          rows: [
            ["Laptop", "$450"],
            ["Headset", "$35"],
            ["Mouse", "$20"],
          ],
        },
        answer: "=$A$2",
      },
      {
        prompt: "Make the row fixed but allow the column to change.",
        table: {
          headers: ["Score", "Bonus"],
          rows: [
            ["82", "5"],
            ["90", "6"],
            ["76", "4"],
          ],
        },
        answer: "=A$2",
      },
      {
        prompt: "Keep the column fixed but allow the row to change.",
        table: {
          headers: ["Task", "Points"],
          rows: [
            ["Warm-up", "10"],
            ["Lab", "20"],
            ["Exit Ticket", "5"],
          ],
        },
        answer: "=$A2",
      },
      {
        prompt: "Refer to cell C3 without locking it.",
        table: {
          headers: ["Class", "Room", "Seats"],
          rows: [
            ["Period 1", "Lab A", "28"],
            ["Period 2", "Lab B", "26"],
          ],
        },
        answer: "=C3",
      },
      {
        prompt: "Multiply the value in B2 by the fixed tax rate in D1.",
        table: {
          headers: ["Item", "Cost", "", "Tax Rate"],
          rows: [
            ["Notebook", "$4", "", "0.08"],
            ["Markers", "$6", "", ""],
          ],
        },
        answer: "=B2*$D$1",
      },
    ],
  },
  level3: {
    label: "Level 3 - Logic Functions",
    questions: [
      {
        prompt: "Return \"Pass\" if B2 is 70 or higher, otherwise \"Retry\".",
        table: {
          headers: ["Student", "Score"],
          rows: [
            ["Jordan", "78"],
            ["Sam", "64"],
          ],
        },
        answer: "=IF(B2>=70,\"Pass\",\"Retry\")",
      },
      {
        prompt: "Return \"Ready\" if B2 is over 80 and C2 is \"Yes\".",
        table: {
          headers: ["Student", "Score", "Homework"],
          rows: [
            ["Mia", "82", "Yes"],
            ["Leo", "79", "No"],
          ],
        },
        answer: "=IF(AND(B2>80,C2=\"Yes\"),\"Ready\",\"Not Yet\")",
      },
      {
        prompt: "Return \"Late\" if C2 is \"No\" or B2 is under 70.",
        table: {
          headers: ["Student", "Score", "Submitted"],
          rows: [
            ["Ava", "72", "No"],
            ["Nora", "85", "Yes"],
          ],
        },
        answer: "=IF(OR(C2=\"No\",B2<70),\"Late\",\"On Time\")",
      },
      {
        prompt: "Count how many cells in B2:B8 equal \"Present\".",
        table: {
          headers: ["Student", "Status"],
          rows: [
            ["Isaac", "Present"],
            ["Maya", "Absent"],
            ["Jules", "Present"],
          ],
        },
        answer: "=COUNTIF(B2:B8,\"Present\")",
      },
      {
        prompt: "Sum C2:C8 only when B2:B8 is \"Approved\".",
        table: {
          headers: ["Request", "Status", "Amount"],
          rows: [
            ["Supplies", "Approved", "12"],
            ["Posters", "Pending", "8"],
            ["Markers", "Approved", "6"],
          ],
        },
        answer: "=SUMIF(B2:B8,\"Approved\",C2:C8)",
      },
    ],
  },
  level4: {
    label: "Level 4 - Lookups",
    questions: [
      {
        prompt: "Look up the device in A2 and return its price from D2:E10.",
        table: {
          headers: ["Device", "", "", "Device", "Price"],
          rows: [
            ["Mouse", "", "", "Mouse", "$18"],
            ["Keyboard", "", "", "Keyboard", "$24"],
            ["Webcam", "", "", "Webcam", "$32"],
          ],
        },
        answer: "=VLOOKUP(A2,D2:E10,2,FALSE)",
      },
      {
        prompt: "Use HLOOKUP to find the score for Quiz 2 in B1:E2.",
        table: {
          headers: ["Quiz 1", "Quiz 2", "Quiz 3", "Quiz 4"],
          rows: [["84", "92", "88", "90"]],
        },
        answer: "=HLOOKUP(\"Quiz 2\",B1:E2,2,FALSE)",
      },
      {
        prompt: "Use XLOOKUP to find the room number for the teacher in A2:B8.",
        table: {
          headers: ["Teacher", "Room"],
          rows: [
            ["Mr. Chen", "104"],
            ["Ms. Ortiz", "206"],
            ["Ms. Rivera", "118"],
          ],
        },
        answer: "=XLOOKUP(A2,A2:A8,B2:B8)",
      },
      {
        prompt: "Return the row for A2 using INDEX/MATCH in D2:D10.",
        table: {
          headers: ["Lookup", "", "", "ID"],
          rows: [
            ["C104", "", "", "A101"],
            ["", "", "", "C104"],
            ["", "", "", "B222"],
          ],
        },
        answer: "=INDEX(D2:D10,MATCH(A2,D2:D10,0))",
      },
      {
        prompt: "Use VLOOKUP to find the student in A2 and return the grade from D2:E10.",
        table: {
          headers: ["Student", "", "", "Student", "Grade"],
          rows: [
            ["Zara", "", "", "Zara", "A"],
            ["", "", "", "Marco", "B"],
            ["", "", "", "Priya", "A"],
          ],
        },
        answer: "=VLOOKUP(A2,D2:E10,2,FALSE)",
      },
    ],
  },
  level5: {
    label: "Level 5 - Advanced",
    questions: [
      {
        prompt: "Pull data from another sheet using its URL.",
        table: {
          headers: ["Source"],
          rows: [["Gradebook link"], ["Attendance link"]],
        },
        answer: "=IMPORTRANGE(\"url\",\"Sheet1!A1:C20\")",
      },
      {
        prompt: "Run a SQL-style query on A1:F50.",
        table: {
          headers: ["Name", "Score", "Grade", "Room", "Club", "Points"],
          rows: [
            ["June", "82", "B", "201", "Robotics", "12"],
            ["Khal", "94", "A", "202", "Media", "18"],
          ],
        },
        answer: "=QUERY(A1:F50,\"select * where F > 70\")",
      },
      {
        prompt: "Apply a formula to every row in A2:A.",
        table: {
          headers: ["Score"],
          rows: [["8"], ["9"], ["10"]],
        },
        answer: "=ARRAYFORMULA(A2:A*2)",
      },
      {
        prompt: "Check if text in B2 matches the word \"quiz\".",
        table: {
          headers: ["Entry"],
          rows: [["quiz 4"], ["quiz 5"], ["project"]],
        },
        answer: "=REGEXMATCH(B2,\"quiz\")",
      },
      {
        prompt: "Return the row where A2 appears in D2:D50 using INDEX/MATCH.",
        table: {
          headers: ["Lookup", "", "", "Roster"],
          rows: [
            ["Jamal", "", "", "Ana"],
            ["", "", "", "Jamal"],
            ["", "", "", "Riley"],
          ],
        },
        answer: "=INDEX(D2:D50,MATCH(A2,D2:D50,0))",
      },
    ],
  },
};

let currentLevelKey = "level1";
let currentQuestionIndex = 0;
let score = 0;
let answered = false;
let playerName = "";
let scoreSaved = false;

let promptEl;
let tableWrapEl;
let inputEl;
let checkBtnEl;
let messageEl;
let scoreEl;
let progressEl;
let levelLabelEl;
let levelSelectEl;
let startBtnEl;
let nextBtnEl;
let leaderboardEl;
let nameModalEl;
let modalNameInputEl;
let modalMessageEl;
let modalStartBtnEl;

const normalize = (value) =>
  value.trim().replace(/\s+/g, "").replace(/'/g, '"').toUpperCase();

const setMessage = (text, tone = "") => {
  messageEl.textContent = text;
  messageEl.className = `quiz-message ${tone}`.trim();
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
      item.textContent = `${entry.name} — ${entry.level} — ${entry.score} pts`;
      leaderboardEl.appendChild(item);
    });
};

const saveScore = (level) => {
  if (scoreSaved) {
    return;
  }
  const entries = loadLeaderboard();
  entries.push({
    name: playerName,
    level: level.label,
    score,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  scoreSaved = true;
};

const updateScoreboard = () => {
  const level = LEVELS[currentLevelKey];
  scoreEl.textContent = score;
  progressEl.textContent = `${Math.min(currentQuestionIndex + 1, level.questions.length)} / ${level.questions.length}`;
  levelLabelEl.textContent = level.label;
};

const renderTable = (table) => {
  tableWrapEl.innerHTML = "";
  const tableEl = document.createElement("table");
  tableEl.className = "mini-table-inner";
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  table.headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  tableEl.appendChild(thead);

  const tbody = document.createElement("tbody");
  table.rows.forEach((row) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  tableEl.appendChild(tbody);
  tableWrapEl.appendChild(tableEl);
};

const renderQuestion = () => {
  const level = LEVELS[currentLevelKey];
  const question = level.questions[currentQuestionIndex];
  if (!question) {
    promptEl.textContent = "Level complete!";
    tableWrapEl.innerHTML = "";
    inputEl.value = "";
    inputEl.disabled = true;
    checkBtnEl.disabled = true;
    setMessage(`You scored ${score} / ${level.questions.length}.`, "success");
    nextBtnEl.disabled = true;
    saveScore(level);
    return;
  }

  answered = false;
  scoreSaved = false;
  promptEl.textContent = question.prompt;
  renderTable(question.table);
  inputEl.value = "";
  inputEl.classList.remove("success", "warning");
  inputEl.disabled = false;
  checkBtnEl.disabled = false;
  nextBtnEl.disabled = true;
  setMessage("");
  updateScoreboard();
  inputEl.focus();
};

const handleCheck = () => {
  if (answered) {
    return;
  }
  const level = LEVELS[currentLevelKey];
  const question = level.questions[currentQuestionIndex];
  const response = normalize(inputEl.value);
  if (!response) {
    setMessage("Type a formula before checking.", "warning");
    return;
  }
  answered = true;
  if (response === normalize(question.answer)) {
    score += 1;
    inputEl.classList.remove("warning");
    inputEl.classList.add("success");
    setMessage("Correct! Great formula.", "success");
  } else {
    inputEl.classList.remove("success");
    inputEl.classList.add("warning");
    setMessage(`Not quite. Correct answer: ${question.answer}`, "warning");
  }
  nextBtnEl.disabled = false;
};

const nextQuestion = () => {
  if (!answered) {
    setMessage("Check your formula before moving on.", "warning");
    return;
  }
  currentQuestionIndex += 1;
  renderQuestion();
};

const startLevel = () => {
  currentLevelKey = levelSelectEl.value;
  currentQuestionIndex = 0;
  score = 0;
  answered = false;
  scoreSaved = false;
  renderQuestion();
};

const startGame = () => {
  const name = modalNameInputEl.value.trim();
  if (!name) {
    setModalMessage("Enter your name to start.", "warning");
    return;
  }
  playerName = name;
  nameModalEl.classList.add("hidden");
  setModalMessage("");
  modalNameInputEl.value = "";
  startLevel();
};

const initGame = () => {
  promptEl = document.getElementById("formulaPrompt");
  tableWrapEl = document.getElementById("formulaTableWrap");
  inputEl = document.getElementById("formulaInput");
  checkBtnEl = document.getElementById("formulaCheckBtn");
  messageEl = document.getElementById("formulaMessage");
  scoreEl = document.getElementById("formulaScore");
  progressEl = document.getElementById("formulaProgress");
  levelLabelEl = document.getElementById("formulaLevelLabel");
  levelSelectEl = document.getElementById("formulaLevel");
  startBtnEl = document.getElementById("formulaStartBtn");
  nextBtnEl = document.getElementById("formulaNextBtn");
  leaderboardEl = document.getElementById("formulaLeaderboard");
  nameModalEl = document.getElementById("formulaNameModal");
  modalNameInputEl = document.getElementById("formulaModalName");
  modalMessageEl = document.getElementById("formulaModalMessage");
  modalStartBtnEl = document.getElementById("formulaModalStart");

  if (!promptEl || !tableWrapEl || !inputEl || !leaderboardEl) {
    return;
  }

  startBtnEl.addEventListener("click", startLevel);
  nextBtnEl.addEventListener("click", nextQuestion);
  checkBtnEl.addEventListener("click", handleCheck);
  inputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleCheck();
    }
  });
  levelSelectEl.addEventListener("change", () => {
    levelLabelEl.textContent = LEVELS[levelSelectEl.value].label;
  });
  modalStartBtnEl.addEventListener("click", startGame);
  modalNameInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      startGame();
    }
  });

  levelLabelEl.textContent = LEVELS[currentLevelKey].label;
  updateLeaderboardUI();
};

window.addEventListener("DOMContentLoaded", initGame);
