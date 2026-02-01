// boolean_battle.js

const MAX_STRIKES = 3;
const ROUND_LENGTH = 25;
const LEADERBOARD_KEY = "boolean_battle_leaderboard";

const LEVEL_CONFIG = {
  1: { label: "Level 1 – Intro CS", multiplier: 1 },
  2: { label: "Level 2 – AP CSP", multiplier: 2 },
  3: { label: "Level 3 – AP CSA", multiplier: 3 },
  4: { label: "Level 4 – Honors DSA", multiplier: 4 },
  5: { label: "Level 5 – College CS", multiplier: 5 },
};

const BOOLEAN_QUESTIONS = [];

const addQuestion = (level, context, expression, answer) => {
  BOOLEAN_QUESTIONS.push({ level, context, expression, answer });
};

const buildQuestions = () => {
  const comparisons = [
    { value: 92, expr: "score >= 90", answer: (v) => v >= 90, label: "score" },
    { value: 48, expr: "attempts < 5", answer: (v) => v < 5, label: "attempts" },
    { value: 12, expr: "coins == 12", answer: (v) => v == 12, label: "coins" },
    { value: 7, expr: "lives != 3", answer: (v) => v != 3, label: "lives" },
    { value: 4, expr: "stars > 2", answer: (v) => v > 2, label: "stars" },
  ];

  comparisons.forEach((item, index) => {
    const value = item.value + index;
    addQuestion(
      1,
      `vars: ${item.label} = ${value}`,
      item.expr.replace(/\d+/, value),
      item.answer(value)
    );
  });

  const boolPairs = [
    { a: true, b: false, expr: "isAdmin && hasBadge" },
    { a: false, b: true, expr: "isOnline || hasBackup" },
    { a: true, b: true, expr: "hasPass && isReady" },
    { a: false, b: false, expr: "isVIP || hasInvite" },
    { a: true, b: false, expr: "!isMuted && hasMic" },
  ];

  boolPairs.forEach((pair, index) => {
    const answer = evalBoolean(pair.expr, {
      isAdmin: pair.a,
      hasBadge: pair.b,
      isOnline: pair.a,
      hasBackup: pair.b,
      hasPass: pair.a,
      isReady: pair.b,
      isVIP: pair.a,
      hasInvite: pair.b,
      isMuted: pair.b,
      hasMic: pair.a,
    });
    addQuestion(
      1,
      `vars: a = ${pair.a}, b = ${pair.b}`,
      pair.expr,
      answer
    );
  });

  const level1Values = [1, 3, 5, 7, 9];
  level1Values.forEach((value) => {
    addQuestion(
      1,
      `vars: points = ${value}`,
      "points > 4",
      value > 4
    );
    addQuestion(
      1,
      `vars: tries = ${value}`,
      "tries <= 5",
      value <= 5
    );
    addQuestion(
      1,
      `vars: isReady = ${value % 2 === 0}`,
      "isReady",
      value % 2 === 0
    );
  });

  const level2Sets = [
    {
      vars: { score: 81, bonus: true },
      expr: "score >= 80 && bonus",
    },
    {
      vars: { temp: 65, raining: false },
      expr: "temp < 60 || raining",
    },
    {
      vars: { moves: 3, extraLife: false },
      expr: "moves > 5 || extraLife",
    },
    {
      vars: { tries: 2, hint: true },
      expr: "tries < 3 && hint",
    },
    {
      vars: { points: 14, shield: true },
      expr: "points >= 15 || shield",
    },
  ];

  level2Sets.forEach((set, index) => {
    const multiplier = index + 1;
    const vars = {
      score: set.vars.score + multiplier,
      bonus: index % 2 === 0,
      temp: set.vars.temp + multiplier,
      raining: index % 2 === 1,
      moves: set.vars.moves + multiplier,
      extraLife: index % 3 === 0,
      tries: set.vars.tries + (index % 2),
      hint: index % 2 === 0,
      points: set.vars.points + multiplier,
      shield: index % 2 === 1,
    };

    addQuestion(
      2,
      `vars: score = ${vars.score}, bonus = ${vars.bonus}`,
      "score >= 80 && bonus",
      vars.score >= 80 && vars.bonus
    );
    addQuestion(
      2,
      `vars: temp = ${vars.temp}, raining = ${vars.raining}`,
      "temp < 60 || raining",
      vars.temp < 60 || vars.raining
    );
    addQuestion(
      2,
      `vars: moves = ${vars.moves}, extraLife = ${vars.extraLife}`,
      "moves > 5 || extraLife",
      vars.moves > 5 || vars.extraLife
    );
    addQuestion(
      2,
      `vars: tries = ${vars.tries}, hint = ${vars.hint}`,
      "tries < 3 && hint",
      vars.tries < 3 && vars.hint
    );
    addQuestion(
      2,
      `vars: points = ${vars.points}, shield = ${vars.shield}`,
      "points >= 15 || shield",
      vars.points >= 15 || vars.shield
    );
  });

  const level3Values = [
    { a: 4, b: 9, c: true },
    { a: 7, b: 3, c: false },
    { a: 2, b: 5, c: true },
    { a: 9, b: 1, c: false },
    { a: 6, b: 6, c: true },
  ];

  level3Values.forEach((val, index) => {
    addQuestion(
      3,
      `vars: a = ${val.a}, b = ${val.b}, debug = ${val.c}`,
      "(a > b && debug) || b == 1",
      (val.a > val.b && val.c) || val.b == 1
    );
    addQuestion(
      3,
      `vars: a = ${val.a}, b = ${val.b}, debug = ${val.c}`,
      "!(a < b) && debug",
      !(val.a < val.b) && val.c
    );
    addQuestion(
      3,
      `vars: a = ${val.a}, b = ${val.b}`,
      "a >= 5 || b >= 5",
      val.a >= 5 || val.b >= 5
    );
    addQuestion(
      3,
      `vars: a = ${val.a}, b = ${val.b}`,
      "a % 2 == 0 && b % 3 == 0",
      val.a % 2 == 0 && val.b % 3 == 0
    );
    addQuestion(
      3,
      `vars: a = ${val.a}, b = ${val.b}`,
      "a + b > 10",
      val.a + val.b > 10
    );
  });

  const level4Values = [
    { x: 8, y: 2, z: true },
    { x: 5, y: 7, z: false },
    { x: 9, y: 3, z: true },
    { x: 4, y: 6, z: true },
    { x: 7, y: 1, z: false },
  ];

  level4Values.forEach((val) => {
    addQuestion(
      4,
      `vars: x = ${val.x}, y = ${val.y}, shield = ${val.z}`,
      "(x > 6 && y < 4) || shield",
      (val.x > 6 && val.y < 4) || val.z
    );
    addQuestion(
      4,
      `vars: x = ${val.x}, y = ${val.y}, shield = ${val.z}`,
      "!(x <= 4) && (y >= 2 || shield)",
      !(val.x <= 4) && (val.y >= 2 || val.z)
    );
    addQuestion(
      4,
      `vars: x = ${val.x}, y = ${val.y}`,
      "x * y >= 24",
      val.x * val.y >= 24
    );
    addQuestion(
      4,
      `vars: x = ${val.x}, y = ${val.y}`,
      "x - y >= 3",
      val.x - val.y >= 3
    );
    addQuestion(
      4,
      `vars: x = ${val.x}, y = ${val.y}`,
      "x % 2 == 1 && y % 2 == 0",
      val.x % 2 == 1 && val.y % 2 == 0
    );
  });

  const level5Values = [
    { cpu: 75, mem: 62, alert: true },
    { cpu: 40, mem: 81, alert: false },
    { cpu: 92, mem: 55, alert: false },
    { cpu: 68, mem: 70, alert: true },
    { cpu: 85, mem: 45, alert: true },
  ];

  level5Values.forEach((val) => {
    addQuestion(
      5,
      `vars: cpu = ${val.cpu}, mem = ${val.mem}, alert = ${val.alert}`,
      "(cpu > 80 && mem > 60) || alert",
      (val.cpu > 80 && val.mem > 60) || val.alert
    );
    addQuestion(
      5,
      `vars: cpu = ${val.cpu}, mem = ${val.mem}, alert = ${val.alert}`,
      "!(cpu < 50) && (mem >= 50 || alert)",
      !(val.cpu < 50) && (val.mem >= 50 || val.alert)
    );
    addQuestion(
      5,
      `vars: cpu = ${val.cpu}, mem = ${val.mem}`,
      "cpu + mem >= 150",
      val.cpu + val.mem >= 150
    );
    addQuestion(
      5,
      `vars: cpu = ${val.cpu}, mem = ${val.mem}`,
      "(cpu - mem >= 20) || (mem - cpu >= 20)",
      cpuMemGap(val.cpu, val.mem)
    );
    addQuestion(
      5,
      `vars: cpu = ${val.cpu}, mem = ${val.mem}`,
      "(cpu % 2 == 0 && mem % 2 == 0) || (cpu % 2 == 1 && mem % 2 == 1)",
      (val.cpu % 2 == 0 && val.mem % 2 == 0) ||
        (val.cpu % 2 == 1 && val.mem % 2 == 1)
    );
  });
};

const evalBoolean = (expression, values) => {
  const {
    isAdmin,
    hasBadge,
    isOnline,
    hasBackup,
    hasPass,
    isReady,
    isVIP,
    hasInvite,
    isMuted,
    hasMic,
  } = values;

  switch (expression) {
    case "isAdmin && hasBadge":
      return isAdmin && hasBadge;
    case "isOnline || hasBackup":
      return isOnline || hasBackup;
    case "hasPass && isReady":
      return hasPass && isReady;
    case "isVIP || hasInvite":
      return isVIP || hasInvite;
    case "!isMuted && hasMic":
      return !isMuted && hasMic;
    default:
      return false;
  }
};

const cpuMemGap = (cpu, mem) => Math.abs(cpu - mem) >= 20;

let score = 0;
let streak = 0;
let strikes = 0;
let currentIndex = 0;
let roundQuestions = [];
let waitingForNext = false;
let currentLevel = 1;
let playerName = "";
let scoreSaved = false;

let scoreEl;
let streakEl;
let progressEl;
let strikesEl;
let levelLabelEl;
let contextEl;
let expressionEl;
let messageEl;
let summaryEl;
let nameModalEl;
let modalNameInputEl;
let modalMessageEl;
let modalStartBtnEl;
let trueBtnEl;
let falseBtnEl;
let nextBtnEl;
let restartBtnEl;
let backBtnEl;
let levelSelectEl;
let startBtnEl;
let leaderboardEl;

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
  levelLabelEl.textContent = LEVEL_CONFIG[currentLevel].label;
};

const setMessage = (text, tone = "") => {
  messageEl.textContent = text;
  messageEl.className = `boolean-message ${tone}`.trim();
};

const setSummary = (text, tone = "") => {
  summaryEl.textContent = text;
  summaryEl.className = `boolean-summary ${tone}`.trim();
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

const saveScore = () => {
  if (scoreSaved) {
    return;
  }
  const entries = loadLeaderboard();
  entries.push({
    name: playerName,
    level: LEVEL_CONFIG[currentLevel].label,
    score,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  scoreSaved = true;
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
  saveScore();
};

const handleAnswer = (value) => {
  if (waitingForNext) {
    return;
  }

  const question = roundQuestions[currentIndex];
  if (value === question.answer) {
    streak += 1;
    score += (10 + streak * 2) * LEVEL_CONFIG[currentLevel].multiplier;
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

const getQuestionsForLevel = (level) =>
  BOOLEAN_QUESTIONS.filter((question) => question.level === level);

const openNameModal = () => {
  nameModalEl.classList.remove("hidden");
  modalNameInputEl.focus();
};

const closeNameModal = () => {
  nameModalEl.classList.add("hidden");
};

const startRound = () => {
  if (!playerName) {
    openNameModal();
    return;
  }

  currentLevel = parseInt(levelSelectEl.value, 10);
  const questions = getQuestionsForLevel(currentLevel);
  roundQuestions = shuffle(questions).slice(0, ROUND_LENGTH);
  score = 0;
  streak = 0;
  strikes = 0;
  currentIndex = 0;
  scoreSaved = false;
  setSummary("");
  setModalMessage("");
  renderQuestion();
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
  startRound();
};

const initGame = () => {
  scoreEl = document.getElementById("booleanScore");
  streakEl = document.getElementById("booleanStreak");
  progressEl = document.getElementById("booleanProgress");
  strikesEl = document.getElementById("booleanStrikes");
  levelLabelEl = document.getElementById("booleanLevelLabel");
  contextEl = document.getElementById("booleanContext");
  expressionEl = document.getElementById("booleanExpression");
  messageEl = document.getElementById("booleanMessage");
  summaryEl = document.getElementById("booleanSummary");
  nameModalEl = document.getElementById("booleanNameModal");
  modalNameInputEl = document.getElementById("booleanModalName");
  modalMessageEl = document.getElementById("booleanModalMessage");
  modalStartBtnEl = document.getElementById("booleanModalStart");
  trueBtnEl = document.getElementById("booleanTrueBtn");
  falseBtnEl = document.getElementById("booleanFalseBtn");
  nextBtnEl = document.getElementById("booleanNextBtn");
  restartBtnEl = document.getElementById("booleanRestartBtn");
  backBtnEl = document.getElementById("booleanBackBtn");
  levelSelectEl = document.getElementById("booleanLevelSelect");
  startBtnEl = document.getElementById("booleanStartBtn");
  leaderboardEl = document.getElementById("booleanLeaderboard");

  if (
    !scoreEl ||
    !streakEl ||
    !progressEl ||
    !strikesEl ||
    !levelLabelEl ||
    !contextEl ||
    !expressionEl ||
    !messageEl ||
    !summaryEl ||
    !nameModalEl ||
    !modalNameInputEl ||
    !modalMessageEl ||
    !modalStartBtnEl ||
    !trueBtnEl ||
    !falseBtnEl ||
    !nextBtnEl ||
    !restartBtnEl ||
    !backBtnEl ||
    !levelSelectEl ||
    !startBtnEl ||
    !leaderboardEl
  ) {
    return;
  }

  if (BOOLEAN_QUESTIONS.length === 0) {
    buildQuestions();
  }

  updateLeaderboardUI();

  trueBtnEl.addEventListener("click", () => handleAnswer(true));
  falseBtnEl.addEventListener("click", () => handleAnswer(false));
  nextBtnEl.addEventListener("click", handleNext);
  restartBtnEl.addEventListener("click", startRound);
  startBtnEl.addEventListener("click", startRound);
  modalStartBtnEl.addEventListener("click", startGame);
  backBtnEl.addEventListener("click", () => {
    window.location.href = "cs_games.html";
  });

  updateScoreboard();
  openNameModal();
};

window.addEventListener("DOMContentLoaded", initGame);
