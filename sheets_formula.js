const LEVELS = {
  level1: {
    label: "Level 1 - Basics",
    questions: [
      {
        prompt: "Add the values in cells A1 and B1.",
        options: ["=SUM(A1,B1)", "=ADD(A1:B1)", "=PLUS(A1,B1)", "=TOTAL(A1:B1)"],
        answer: "=SUM(A1,B1)",
      },
      {
        prompt: "Find the average of A1 through A10.",
        options: ["=AVERAGE(A1:A10)", "=MEAN(A1:A10)", "=AVG(A1-A10)", "=MID(A1:A10)"],
        answer: "=AVERAGE(A1:A10)",
      },
      {
        prompt: "Return the highest number in B2:B20.",
        options: ["=MAX(B2:B20)", "=HIGH(B2:B20)", "=TOP(B2:B20)", "=LARGE(B2:B20,2)"],
        answer: "=MAX(B2:B20)",
      },
      {
        prompt: "Count how many numbers are in C1:C12.",
        options: ["=COUNT(C1:C12)", "=NUMBERS(C1:C12)", "=COUNTIF(C1:C12,\">0\")", "=COUNTA(C1:C12)"],
        answer: "=COUNT(C1:C12)",
      },
      {
        prompt: "Return the smallest value in D3:D18.",
        options: ["=MIN(D3:D18)", "=LOW(D3:D18)", "=SMALL(D3:D18,1)", "=BOTTOM(D3:D18)"],
        answer: "=MIN(D3:D18)",
      },
    ],
  },
  level2: {
    label: "Level 2 - Everyday Tasks",
    questions: [
      {
        prompt: "Round 15.678 to two decimal places.",
        options: ["=ROUND(15.678,2)", "=ROUNDUP(15.678,2)", "=FIX(15.678,2)", "=TRUNC(15.678,2)"],
        answer: "=ROUND(15.678,2)",
      },
      {
        prompt: "Join the text in A2 and B2 with a space.",
        options: ["=A2&\" \"&B2", "=JOIN(A2,B2)", "=CONCATENATE(A2,B2)", "=MERGE(A2,B2)"],
        answer: "=A2&\" \"&B2",
      },
      {
        prompt: "Show today's date.",
        options: ["=TODAY()", "=NOW()", "=DATE()", "=CURRENTDATE()"],
        answer: "=TODAY()",
      },
      {
        prompt: "Pick the correct formula to calculate 8% tax on A2.",
        options: ["=A2*0.08", "=A2/0.08", "=A2+0.08", "=TAX(A2,0.08)"],
        answer: "=A2*0.08",
      },
      {
        prompt: "Combine the text in cells C1:C3 into one line.",
        options: ["=TEXTJOIN(\" \",TRUE,C1:C3)", "=MERGE(C1:C3)", "=CONCAT(C1:C3)", "=JOIN(C1,C3)"],
        answer: "=TEXTJOIN(\" \",TRUE,C1:C3)",
      },
    ],
  },
  level3: {
    label: "Level 3 - Logic & Counts",
    questions: [
      {
        prompt: "Return \"Yes\" if A2 is over 70, otherwise \"No\".",
        options: ["=IF(A2>70,\"Yes\",\"No\")", "=IF(A2=70,\"Yes\",\"No\")", "=IFS(A2>70,\"Yes\",\"No\")", "=SWITCH(A2,70,\"Yes\",\"No\")"],
        answer: "=IF(A2>70,\"Yes\",\"No\")",
      },
      {
        prompt: "Count how many cells in B2:B20 equal \"Late\".",
        options: ["=COUNTIF(B2:B20,\"Late\")", "=COUNT(B2:B20,\"Late\")", "=COUNTMATCH(B2:B20,\"Late\")", "=COUNTALL(B2:B20)"],
        answer: "=COUNTIF(B2:B20,\"Late\")",
      },
      {
        prompt: "Sum values in C2:C20 only if D2:D20 says \"Approved\".",
        options: ["=SUMIF(D2:D20,\"Approved\",C2:C20)", "=SUM(C2:C20,D2:D20)", "=SUMIFS(C2:C20,D2:D20,\"Approved\")", "=ADDIF(C2:C20,D2:D20,\"Approved\")"],
        answer: "=SUMIF(D2:D20,\"Approved\",C2:C20)",
      },
      {
        prompt: "Look up the price for the item in A2 using table G2:H20.",
        options: ["=VLOOKUP(A2,G2:H20,2,FALSE)", "=LOOKUP(A2,G2:H20)", "=HLOOKUP(A2,G2:H20,2)", "=XLOOKUP(A2,G2:H20)"],
        answer: "=VLOOKUP(A2,G2:H20,2,FALSE)",
      },
      {
        prompt: "Show \"Missing\" if B2 is blank.",
        options: ["=IF(B2=\"\",\"Missing\",B2)", "=IF(B2>\"\",\"Missing\",B2)", "=IFBLANK(B2,\"Missing\")", "=IFEMPTY(B2,\"Missing\")"],
        answer: "=IF(B2=\"\",\"Missing\",B2)",
      },
    ],
  },
  level4: {
    label: "Level 4 - Lists & Filters",
    questions: [
      {
        prompt: "Filter rows in A2:D20 where column D is \"Complete\".",
        options: ["=FILTER(A2:D20,D2:D20=\"Complete\")", "=FILTER(A2:D20,\"Complete\")", "=SORT(A2:D20,D2:D20)", "=QUERY(A2:D20,\"Complete\")"],
        answer: "=FILTER(A2:D20,D2:D20=\"Complete\")",
      },
      {
        prompt: "Sort the list A2:A20 alphabetically.",
        options: ["=SORT(A2:A20,1,TRUE)", "=ORDER(A2:A20)", "=ALPHA(A2:A20)", "=SORT(A2:A20,TRUE)"],
        answer: "=SORT(A2:A20,1,TRUE)",
      },
      {
        prompt: "Show only the unique values from B2:B30.",
        options: ["=UNIQUE(B2:B30)", "=DISTINCT(B2:B30)", "=ONLY(B2:B30)", "=UNIQ(B2:B30)"],
        answer: "=UNIQUE(B2:B30)",
      },
      {
        prompt: "Split names in A2 on the space into columns.",
        options: ["=SPLIT(A2,\" \")", "=DIVIDE(A2,\" \")", "=TEXTSPLIT(A2,\" \")", "=SEPARATE(A2,\" \")"],
        answer: "=SPLIT(A2,\" \")",
      },
      {
        prompt: "Sort A2:C20 by column C highest to lowest.",
        options: ["=SORT(A2:C20,3,FALSE)", "=SORTDESC(A2:C20,3)", "=ORDER(A2:C20,3,FALSE)", "=FILTER(A2:C20,C2:C20)"],
        answer: "=SORT(A2:C20,3,FALSE)",
      },
    ],
  },
  level5: {
    label: "Level 5 - Power User",
    questions: [
      {
        prompt: "Pull data from another sheet using its URL.",
        options: ["=IMPORTRANGE(\"url\",\"Sheet1!A1:C20\")", "=IMPORTDATA(\"url\")", "=IMPORTSHEET(\"url\")", "=IMPORTXML(\"url\")"],
        answer: "=IMPORTRANGE(\"url\",\"Sheet1!A1:C20\")",
      },
      {
        prompt: "Run a SQL-style query on A1:F50.",
        options: ["=QUERY(A1:F50,\"select * where F > 70\")", "=FILTER(A1:F50,\"F>70\")", "=SQL(A1:F50,\"F>70\")", "=QUERY(A1:F50,\"F>70\")"],
        answer: "=QUERY(A1:F50,\"select * where F > 70\")",
      },
      {
        prompt: "Apply a formula to every row in A2:A.",
        options: ["=ARRAYFORMULA(A2:A*2)", "=ARRAY(A2:A*2)", "=FORMULAARRAY(A2:A*2)", "=ARRAYS(A2:A*2)"],
        answer: "=ARRAYFORMULA(A2:A*2)",
      },
      {
        prompt: "Check if text in B2 matches the word \"quiz\".",
        options: ["=REGEXMATCH(B2,\"quiz\")", "=MATCH(B2,\"quiz\")", "=FIND(B2,\"quiz\")", "=SEARCH(B2,\"quiz\")"],
        answer: "=REGEXMATCH(B2,\"quiz\")",
      },
      {
        prompt: "Return the row where A2 appears in D2:D50 using INDEX/MATCH.",
        options: ["=INDEX(D2:D50,MATCH(A2,D2:D50,0))", "=MATCH(A2,D2:D50,INDEX)", "=INDEXMATCH(D2:D50,A2)", "=MATCHINDEX(A2,D2:D50)"],
        answer: "=INDEX(D2:D50,MATCH(A2,D2:D50,0))",
      },
    ],
  },
};

let currentLevelKey = "level1";
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

let promptEl;
let optionsEl;
let messageEl;
let scoreEl;
let progressEl;
let levelLabelEl;
let levelSelectEl;
let startBtnEl;
let nextBtnEl;

const setMessage = (text, tone = "") => {
  messageEl.textContent = text;
  messageEl.className = `quiz-message ${tone}`.trim();
};

const updateScoreboard = () => {
  const level = LEVELS[currentLevelKey];
  scoreEl.textContent = score;
  progressEl.textContent = `${Math.min(currentQuestionIndex + 1, level.questions.length)} / ${level.questions.length}`;
  levelLabelEl.textContent = level.label;
};

const clearOptions = () => {
  optionsEl.innerHTML = "";
};

const renderQuestion = () => {
  const level = LEVELS[currentLevelKey];
  const question = level.questions[currentQuestionIndex];
  if (!question) {
    promptEl.textContent = "Level complete!";
    clearOptions();
    setMessage(`You scored ${score} / ${level.questions.length}.`, "success");
    nextBtnEl.disabled = true;
    return;
  }

  answered = false;
  promptEl.textContent = question.prompt;
  clearOptions();
  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline quiz-option";
    button.textContent = option;
    button.addEventListener("click", () => handleAnswer(option));
    optionsEl.appendChild(button);
  });
  setMessage("");
  nextBtnEl.disabled = true;
  updateScoreboard();
};

const handleAnswer = (choice) => {
  if (answered) {
    return;
  }
  answered = true;
  const level = LEVELS[currentLevelKey];
  const question = level.questions[currentQuestionIndex];
  const correct = choice === question.answer;
  if (correct) {
    score += 1;
    setMessage("Correct! Nice work.", "success");
  } else {
    setMessage(`Not quite. Correct answer: ${question.answer}`, "warning");
  }
  nextBtnEl.disabled = false;
};

const nextQuestion = () => {
  if (!answered) {
    setMessage("Choose an answer before moving on.", "warning");
    return;
  }
  currentQuestionIndex += 1;
  renderQuestion();
};

const startLevel = () => {
  currentLevelKey = levelSelectEl.value;
  currentQuestionIndex = 0;
  score = 0;
  renderQuestion();
};

const initGame = () => {
  promptEl = document.getElementById("formulaPrompt");
  optionsEl = document.getElementById("formulaOptions");
  messageEl = document.getElementById("formulaMessage");
  scoreEl = document.getElementById("formulaScore");
  progressEl = document.getElementById("formulaProgress");
  levelLabelEl = document.getElementById("formulaLevelLabel");
  levelSelectEl = document.getElementById("formulaLevel");
  startBtnEl = document.getElementById("formulaStartBtn");
  nextBtnEl = document.getElementById("formulaNextBtn");

  if (!promptEl || !optionsEl || !messageEl) {
    return;
  }

  startBtnEl.addEventListener("click", startLevel);
  nextBtnEl.addEventListener("click", nextQuestion);
  levelSelectEl.addEventListener("change", () => {
    levelLabelEl.textContent = LEVELS[levelSelectEl.value].label;
  });

  levelLabelEl.textContent = LEVELS[currentLevelKey].label;
};

window.addEventListener("DOMContentLoaded", initGame);
