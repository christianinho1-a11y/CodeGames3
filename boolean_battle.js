// boolean_battle.js

const MAX_STRIKES = 3;
const ROUND_LENGTH = 10;

const BOOLEAN_QUESTIONS = [
  {
    context: "vars: isAdmin = true, hasBadge = false",
    expression: "isAdmin && hasBadge",
    answer: false,
  },
  {
    context: "vars: score = 92",
    expression: "score >= 90",
    answer: true,
  },
  {
    context: "vars: isOnline = false, hasBackup = true",
    expression: "isOnline || hasBackup",
    answer: true,
  },
  {
    context: "vars: attempts = 3",
    expression: "!(attempts > 3)",
    answer: true,
  },
  {
    context: "vars: isMember = true, onGuestList = false",
    expression: "isMember && !onGuestList",
    answer: true,
  },
  {
    context: "vars: battery = 18",
    expression: "battery >= 20 || battery == 18",
    answer: true,
  },
  {
    context: "vars: temperature = 72",
    expression: "temperature < 60 || temperature > 80",
    answer: false,
  },
  {
    context: "vars: hasKey = false, knowsCode = false",
    expression: "hasKey || knowsCode",
    answer: false,
  },
  {
    context: "vars: streak = 4",
    expression: "streak % 2 == 0",
    answer: true,
  },
  {
    context: "vars: seatsOpen = 0, vipPass = true",
    expression: "seatsOpen > 0 && vipPass",
    answer: false,
  },
  {
    context: "vars: speed = 55, limit = 65",
    expression: "speed <= limit",
    answer: true,
  },
  {
    context: "vars: submissions = 5",
    expression: "submissions != 5",
    answer: false,
  },
  {
    context: "vars: hasWifi = true, hasEthernet = false",
    expression: "hasWifi && hasEthernet",
    answer: false,
  },
  {
    context: "vars: level = 3",
    expression: "level == 3 || level == 4",
    answer: true,
  },
  {
    context: "vars: a = 7, b = 9",
    expression: "a < b && b < 10",
    answer: true,
  },
  {
    context: "vars: muted = false",
    expression: "!muted",
    answer: true,
  },
  {
    context: "vars: doorsUnlocked = 2",
    expression: "doorsUnlocked >= 3",
    answer: false,
  },
  {
    context: "vars: completed = true, verified = true",
    expression: "completed && verified",
    answer: true,
  },
  {
    context: "vars: retries = 1",
    expression: "retries > 1",
    answer: false,
  },
  {
    context: "vars: credit = 650",
    expression: "credit >= 700",
    answer: false,
  },
];

let score = 0;
let streak = 0;
let strikes = 0;
let currentIndex = 0;
let roundQuestions = [];
let waitingForNext = false;

let scoreEl;
let streakEl;
let progressEl;
let strikesEl;
let contextEl;
let expressionEl;
let messageEl;
let summaryEl;
let trueBtnEl;
let falseBtnEl;
let nextBtnEl;
let restartBtnEl;
let backBtnEl;

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const updateScoreboard = () => {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  strikesEl.textContent = strikes;
  progressEl.textContent = `${currentIndex + 1} / ${ROUND_LENGTH}`;
};

const setMessage = (text, tone = "") => {
  messageEl.textContent = text;
  messageEl.className = `boolean-message ${tone}`.trim();
};

const setSummary = (text, tone = "") => {
  summaryEl.textContent = text;
  summaryEl.className = `boolean-summary ${tone}`.trim();
};

const renderQuestion = () => {
  const question = roundQuestions[currentIndex];
  contextEl.textContent = question.context;
  expressionEl.textContent = question.expression;
  setMessage("");
  trueBtnEl.disabled = false;
  falseBtnEl.disabled = false;
  nextBtnEl.disabled = true;
  waitingForNext = false;
  updateScoreboard();
};

const endRound = (summaryText) => {
  setSummary(summaryText, "info");
  trueBtnEl.disabled = true;
  falseBtnEl.disabled = true;
  nextBtnEl.disabled = true;
};

const handleAnswer = (value) => {
  if (waitingForNext) {
    return;
  }

  const question = roundQuestions[currentIndex];
  if (value === question.answer) {
    streak += 1;
    score += 10 + streak * 2;
    setMessage("Correct! Keep the streak alive.", "success");
  } else {
    strikes += 1;
    streak = 0;
    setMessage("Incorrect — that’s a strike.", "warning");
  }

  waitingForNext = true;
  trueBtnEl.disabled = true;
  falseBtnEl.disabled = true;
  nextBtnEl.disabled = false;
  updateScoreboard();

  if (strikes >= MAX_STRIKES) {
    endRound("Round over — you reached 3 strikes.");
  }

  if (currentIndex === ROUND_LENGTH - 1) {
    endRound(`Round complete! Final score: ${score}.`);
  }
};

const handleNext = () => {
  if (!waitingForNext || strikes >= MAX_STRIKES) {
    return;
  }

  if (currentIndex >= ROUND_LENGTH - 1) {
    return;
  }

  currentIndex += 1;
  renderQuestion();
};

const startRound = () => {
  roundQuestions = shuffle(BOOLEAN_QUESTIONS).slice(0, ROUND_LENGTH);
  score = 0;
  streak = 0;
  strikes = 0;
  currentIndex = 0;
  setSummary("");
  renderQuestion();
};

const initGame = () => {
  scoreEl = document.getElementById("booleanScore");
  streakEl = document.getElementById("booleanStreak");
  progressEl = document.getElementById("booleanProgress");
  strikesEl = document.getElementById("booleanStrikes");
  contextEl = document.getElementById("booleanContext");
  expressionEl = document.getElementById("booleanExpression");
  messageEl = document.getElementById("booleanMessage");
  summaryEl = document.getElementById("booleanSummary");
  trueBtnEl = document.getElementById("booleanTrueBtn");
  falseBtnEl = document.getElementById("booleanFalseBtn");
  nextBtnEl = document.getElementById("booleanNextBtn");
  restartBtnEl = document.getElementById("booleanRestartBtn");
  backBtnEl = document.getElementById("booleanBackBtn");

  if (
    !scoreEl ||
    !streakEl ||
    !progressEl ||
    !strikesEl ||
    !contextEl ||
    !expressionEl ||
    !messageEl ||
    !summaryEl ||
    !trueBtnEl ||
    !falseBtnEl ||
    !nextBtnEl ||
    !restartBtnEl ||
    !backBtnEl
  ) {
    return;
  }

  trueBtnEl.addEventListener("click", () => handleAnswer(true));
  falseBtnEl.addEventListener("click", () => handleAnswer(false));
  nextBtnEl.addEventListener("click", handleNext);
  restartBtnEl.addEventListener("click", startRound);
  backBtnEl.addEventListener("click", () => {
    window.location.href = "cs_games.html";
  });

  startRound();
};

window.addEventListener("DOMContentLoaded", initGame);
