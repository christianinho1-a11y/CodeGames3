const LEVELS = {
  1: {
    id: 1,
    label: "Level 1 – Intro CS",
    startSceneId: "intro-position",
    scenes: {
      "intro-position": {
        id: "intro-position",
        storyText:
          "You made the varsity basketball team. The coach asks what position you want to try first.",
        codeSnippet: `// Choose your position\nif (position === "PG") {\n  outcome = "You run the offense and call the plays.";\n} else {\n  outcome = "You explore a new role and learn the system.";\n}`,
        inputs: [
          {
            name: "position",
            label: "Choose your position",
            type: "select",
            options: ["PG", "SG", "SF", "PF", "C", "Other"],
          },
        ],
        evaluate: (inputs) => {
          const isPointGuard = inputs.position === "PG";
          return {
            outcomeText: isPointGuard
              ? "You run the offense and teammates look to you for direction."
              : "You explore a new role and learn how the team flows together.",
            nextSceneId: "intro-effort",
            updates: {
              position: inputs.position,
              leadershipScore: isPointGuard ? 2 : 1,
            },
          };
        },
      },
      "intro-effort": {
        id: "intro-effort",
        storyText:
          "Practice starts tomorrow. Your effort level will shape how fast you improve.",
        codeSnippet: `// Practice effort\nif (effortLevel >= 5) {\n  outcome = "You keep up with drills and gain confidence.";\n} else {\n  outcome = "You struggle to keep pace and need a reset.";\n}`,
        inputs: [
          {
            name: "effortLevel",
            label: "Effort level (1-10)",
            type: "number",
            min: 1,
            max: 10,
            step: 1,
          },
        ],
        isCheckpoint: true,
        checkpointLabel: "Practice routine set",
        evaluate: (inputs) => {
          const effortLevel = Number(inputs.effortLevel);
          const focused = effortLevel >= 5;
          return {
            outcomeText: focused
              ? "You keep up with drills and earn praise for steady effort."
              : "You fall behind in drills and decide to restart with a new plan.",
            nextSceneId: focused ? "intro-big-game" : null,
            isFailure: !focused,
            updates: {
              effortLevel,
              setbacks: focused ? 0 : 1,
            },
          };
        },
      },
      "intro-big-game": {
        id: "intro-big-game",
        storyText:
          "Your first game arrives. How many hours of extra practice do you put in this week?",
        codeSnippet: `// Game-day readiness\nif (practiceHours >= 5) {\n  outcome = "You feel ready and lead a strong start.";\n} else if (practiceHours >= 2) {\n  outcome = "You play steady minutes and build momentum.";\n} else {\n  outcome = "You feel nervous and sit out late in the game.";\n}`,
        inputs: [
          {
            name: "practiceHours",
            label: "Extra practice hours this week",
            type: "number",
            min: 0,
            max: 10,
            step: 1,
          },
        ],
        evaluate: (inputs) => {
          const practiceHours = Number(inputs.practiceHours);
          let outcomeText = "You play steady minutes and build momentum.";
          let updates = { practiceHours, gamesWon: 1 };
          if (practiceHours >= 5) {
            outcomeText = "You feel ready, lead a strong start, and notch a big win.";
            updates = { practiceHours, gamesWon: 2, leadershipScore: 2 };
          } else if (practiceHours < 2) {
            outcomeText = "You feel nervous and sit out late in the game, but learn from it.";
            updates = { practiceHours, setbacks: 1 };
          }
          return {
            outcomeText,
            nextSceneId: null,
            updates,
          };
        },
        isEnding: true,
      },
    },
  },
  2: {
    id: 2,
    label: "Level 2 – AP CSP",
    startSceneId: "csp-roles",
    scenes: {
      "csp-roles": {
        id: "csp-roles",
        storyText:
          "Your CS club is planning a community showcase. You need to choose your focus for the event.",
        codeSnippet: `// Choose your focus\nif (focus === "teamwork") {\n  outcome = "You coordinate volunteers and keep everyone aligned.";\n} else {\n  outcome = "You focus on polishing the demo experience.";\n}`,
        inputs: [
          {
            name: "focus",
            label: "Event focus",
            type: "select",
            options: ["teamwork", "demo", "logistics"],
          },
        ],
        evaluate: (inputs) => {
          const focus = inputs.focus;
          const teamwork = focus === "teamwork";
          return {
            outcomeText: teamwork
              ? "You coordinate volunteers and keep everyone aligned."
              : "You focus on polishing the demo experience.",
            nextSceneId: "csp-practice",
            updates: {
              focus,
              leadershipScore: teamwork ? 2 : 1,
            },
          };
        },
      },
      "csp-practice": {
        id: "csp-practice",
        storyText:
          "The team plans a practice run. Decide how many hours the group rehearses and whether backup devices are ready.",
        codeSnippet: `// Practice readiness\nif (practiceHours >= 3 && backupDevicesReady) {\n  outcome = "You run a smooth rehearsal and feel ready.";\n} else {\n  outcome = "The rehearsal is shaky and you regroup.";\n}`,
        inputs: [
          {
            name: "practiceHours",
            label: "Group practice hours",
            type: "number",
            min: 0,
            max: 6,
            step: 1,
          },
          {
            name: "backupDevicesReady",
            label: "Backup devices ready",
            type: "toggle",
          },
        ],
        isCheckpoint: true,
        checkpointLabel: "Practice run complete",
        evaluate: (inputs) => {
          const practiceHours = Number(inputs.practiceHours);
          const backupDevicesReady = Boolean(inputs.backupDevicesReady);
          const ready = practiceHours >= 3 && backupDevicesReady;
          return {
            outcomeText: ready
              ? "You run a smooth rehearsal and feel ready for the crowd."
              : "The rehearsal is shaky and you decide to regroup.",
            nextSceneId: ready ? "csp-showcase" : null,
            isFailure: !ready,
            updates: {
              practiceHours,
              setbacks: ready ? 0 : 1,
            },
          };
        },
      },
      "csp-showcase": {
        id: "csp-showcase",
        storyText:
          "Showcase night! Choose the size of the greeting team and whether you prepared a quick FAQ sheet.",
        codeSnippet: `// Crowd response\nif (greeters >= 2 || faqReady) {\n  outcome = "Guests feel welcomed and stations stay busy.";\n} else {\n  outcome = "Lines build up and you have to improvise.";\n}`,
        inputs: [
          {
            name: "greeters",
            label: "Number of greeters",
            type: "number",
            min: 0,
            max: 5,
            step: 1,
          },
          {
            name: "faqReady",
            label: "FAQ sheet prepared",
            type: "toggle",
          },
        ],
        evaluate: (inputs) => {
          const greeters = Number(inputs.greeters);
          const faqReady = Boolean(inputs.faqReady);
          const strongWelcome = greeters >= 2 || faqReady;
          return {
            outcomeText: strongWelcome
              ? "Guests feel welcomed and stations stay busy all night."
              : "Lines build up and you learn to adapt on the fly.",
            nextSceneId: null,
            updates: {
              gamesWon: strongWelcome ? 2 : 1,
              leadershipScore: strongWelcome ? 2 : 1,
            },
          };
        },
        isEnding: true,
      },
    },
  },
  3: {
    id: 3,
    label: "Level 3 – AP CSA",
    startSceneId: "csa-brief",
    scenes: {
      "csa-brief": {
        id: "csa-brief",
        storyText:
          "Your robotics team is preparing for a qualifier. You decide how to split time between driving practice and sensor checks.",
        codeSnippet: `// Prep balance\nif (drivePractice >= 4 && sensorsCalibrated) {\n  outcome = "You enter qualifiers confident and stable.";\n} else if (drivePractice >= 2) {\n  outcome = "You feel okay, but worry about sensors.";\n} else {\n  outcome = "The team needs more prep and rethinks the plan.";\n}`,
        inputs: [
          {
            name: "drivePractice",
            label: "Drive practice hours",
            type: "number",
            min: 0,
            max: 6,
            step: 1,
          },
          {
            name: "sensorsCalibrated",
            label: "Sensors calibrated",
            type: "toggle",
          },
        ],
        evaluate: (inputs) => {
          const drivePractice = Number(inputs.drivePractice);
          const sensorsCalibrated = Boolean(inputs.sensorsCalibrated);
          if (drivePractice >= 4 && sensorsCalibrated) {
            return {
              outcomeText: "You enter qualifiers confident and stable.",
              nextSceneId: "csa-qualifier",
              updates: { leadershipScore: 2, drivePractice },
            };
          }
          if (drivePractice >= 2) {
            return {
              outcomeText: "You feel okay, but worry about sensors.",
              nextSceneId: "csa-qualifier",
              updates: { leadershipScore: 1, drivePractice },
            };
          }
          return {
            outcomeText: "The team needs more prep and rethinks the plan.",
            nextSceneId: null,
            isFailure: true,
            updates: { setbacks: 1, drivePractice },
          };
        },
      },
      "csa-qualifier": {
        id: "csa-qualifier",
        storyText:
          "Qualifiers begin. Decide whether to attempt the bonus route based on alignment and time remaining.",
        codeSnippet: `// Bonus route\nif (aligned && timeRemaining >= 30) {\n  outcome = "You take the bonus route and score big.";\n} else {\n  outcome = "You secure steady points and finish the run.";\n}`,
        inputs: [
          {
            name: "aligned",
            label: "Robot aligned",
            type: "toggle",
          },
          {
            name: "timeRemaining",
            label: "Time remaining (seconds)",
            type: "number",
            min: 0,
            max: 60,
            step: 5,
          },
        ],
        isCheckpoint: true,
        checkpointLabel: "Qualifier round finished",
        evaluate: (inputs) => {
          const aligned = Boolean(inputs.aligned);
          const timeRemaining = Number(inputs.timeRemaining);
          const bonus = aligned && timeRemaining >= 30;
          return {
            outcomeText: bonus
              ? "You take the bonus route and score big."
              : "You secure steady points and finish the run.",
            nextSceneId: "csa-finals",
            updates: {
              gamesWon: bonus ? 2 : 1,
              leadershipScore: bonus ? 2 : 1,
            },
          };
        },
      },
      "csa-finals": {
        id: "csa-finals",
        storyText:
          "Finals prep: choose whether to redesign the intake system based on test results and time left in the pit.",
        codeSnippet: `// Redesign decision\nif (testsPassed && pitTime >= 20) {\n  outcome = "You redesign and improve scoring speed.";\n} else if (testsPassed) {\n  outcome = "You keep the system and focus on driving.";\n} else {\n  outcome = "You troubleshoot and play it safe.";\n}`,
        inputs: [
          {
            name: "testsPassed",
            label: "Tests passed",
            type: "toggle",
          },
          {
            name: "pitTime",
            label: "Pit time left (minutes)",
            type: "number",
            min: 0,
            max: 30,
            step: 5,
          },
        ],
        evaluate: (inputs) => {
          const testsPassed = Boolean(inputs.testsPassed);
          const pitTime = Number(inputs.pitTime);
          let outcomeText = "You troubleshoot and play it safe.";
          let updates = { setbacks: 1 };
          if (testsPassed && pitTime >= 20) {
            outcomeText = "You redesign and improve scoring speed.";
            updates = { gamesWon: 2, leadershipScore: 2 };
          } else if (testsPassed) {
            outcomeText = "You keep the system and focus on driving.";
            updates = { gamesWon: 1, leadershipScore: 1 };
          }
          return {
            outcomeText,
            nextSceneId: null,
            updates,
          };
        },
        isEnding: true,
      },
    },
  },
  4: {
    id: 4,
    label: "Level 4 – College / Data Structures",
    startSceneId: "college-brief",
    scenes: {
      "college-brief": {
        id: "college-brief",
        storyText:
          "You are building a campus navigation app. Pick how to store open rooms based on search speed and update frequency.",
        codeSnippet: `// Data structure choice\nif (needsFastLookup && updatesFrequent) {\n  outcome = "You choose a hash set for fast lookups.";\n} else if (needsFastLookup) {\n  outcome = "You choose a sorted list and batch updates.";\n} else {\n  outcome = "You choose a simple list and keep it lightweight.";\n}`,
        inputs: [
          {
            name: "needsFastLookup",
            label: "Fast lookup needed",
            type: "toggle",
          },
          {
            name: "updatesFrequent",
            label: "Updates are frequent",
            type: "toggle",
          },
        ],
        evaluate: (inputs) => {
          const needsFastLookup = Boolean(inputs.needsFastLookup);
          const updatesFrequent = Boolean(inputs.updatesFrequent);
          let outcomeText = "You choose a simple list and keep it lightweight.";
          let updates = { focus: "simplicity" };
          if (needsFastLookup && updatesFrequent) {
            outcomeText = "You choose a hash set for fast lookups.";
            updates = { focus: "performance", leadershipScore: 2 };
          } else if (needsFastLookup) {
            outcomeText = "You choose a sorted list and batch updates.";
            updates = { focus: "balance", leadershipScore: 1 };
          }
          return {
            outcomeText,
            nextSceneId: "college-load",
            updates,
          };
        },
      },
      "college-load": {
        id: "college-load",
        storyText:
          "Load testing begins. Decide whether to scale now based on traffic and cache warmth.",
        codeSnippet: `// Scaling decision\nif ((trafficHigh && cacheCold) || trafficHigh) {\n  outcome = "You scale up before performance drops.";\n} else {\n  outcome = "You monitor and wait for trends.";\n}`,
        inputs: [
          {
            name: "trafficHigh",
            label: "Traffic is high",
            type: "toggle",
          },
          {
            name: "cacheCold",
            label: "Cache is cold",
            type: "toggle",
          },
        ],
        isCheckpoint: true,
        checkpointLabel: "Load test cleared",
        evaluate: (inputs) => {
          const trafficHigh = Boolean(inputs.trafficHigh);
          const cacheCold = Boolean(inputs.cacheCold);
          const scale = (trafficHigh && cacheCold) || trafficHigh;
          return {
            outcomeText: scale
              ? "You scale up before performance drops."
              : "You monitor and wait for trends.",
            nextSceneId: scale ? "college-pitch" : null,
            isFailure: !scale,
            updates: {
              leadershipScore: scale ? 2 : 0,
              setbacks: scale ? 0 : 1,
            },
          };
        },
      },
      "college-pitch": {
        id: "college-pitch",
        storyText:
          "Final presentation: decide whether to highlight complexity details based on audience readiness and slide clarity.",
        codeSnippet: `// Presentation focus\nif (audienceReady && slidesClear) {\n  outcome = "You explain the complexity and win buy-in.";\n} else if (slidesClear) {\n  outcome = "You focus on the feature story and keep it clear.";\n} else {\n  outcome = "You simplify the pitch to avoid confusion.";\n}`,
        inputs: [
          {
            name: "audienceReady",
            label: "Audience ready for complexity",
            type: "toggle",
          },
          {
            name: "slidesClear",
            label: "Slides are clear",
            type: "toggle",
          },
        ],
        evaluate: (inputs) => {
          const audienceReady = Boolean(inputs.audienceReady);
          const slidesClear = Boolean(inputs.slidesClear);
          let outcomeText = "You simplify the pitch to avoid confusion.";
          let updates = { leadershipScore: 1 };
          if (audienceReady && slidesClear) {
            outcomeText = "You explain the complexity and win buy-in.";
            updates = { leadershipScore: 2, gamesWon: 2 };
          } else if (slidesClear) {
            outcomeText = "You focus on the feature story and keep it clear.";
            updates = { leadershipScore: 1, gamesWon: 1 };
          }
          return {
            outcomeText,
            nextSceneId: null,
            updates,
          };
        },
        isEnding: true,
      },
    },
  },
};

let currentLevelId = 1;
let currentSceneId = null;
let pendingNextSceneId = null;
let currentCheckpoint = null;
let checkpointState = null;
let stepCount = 0;
let playerName = "";
let playerState = {};

let levelSelectEl;
let startBtnEl;
let gameAreaEl;
let levelInfoEl;
let questionCounterEl;
let checkpointDisplayEl;
let scenarioTextEl;
let codeSnippetEl;
let inputAreaEl;
let runSceneBtnEl;
let resultTextEl;
let nextBtnEl;
let gameOverEl;
let gameOverTitleEl;
let gameOverMessageEl;
let finalPlayerNameEl;
let finalLevelEl;
let finalSummaryEl;
let continueCheckpointBtnEl;
let playAgainBtnEl;
let nameModalEl;
let modalNameInputEl;
let modalMessageEl;
let modalStartBtnEl;

const escapeHtml = (text) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const setModalMessage = (text, tone = "") => {
  modalMessageEl.textContent = text;
  modalMessageEl.className = `form-note ${tone}`.trim();
};

const getCurrentLevelData = () => LEVELS[currentLevelId];

const applyUpdates = (updates) => {
  if (!updates) {
    return;
  }
  Object.entries(updates).forEach(([key, value]) => {
    if (typeof value === "number" && typeof playerState[key] === "number") {
      playerState[key] += value;
    } else {
      playerState[key] = value;
    }
  });
};

const buildSummary = () => {
  const name = playerState.name || "Player";
  const position = playerState.position || "flex";
  const focus = playerState.focus || "growth";
  const effortLevel = playerState.effortLevel || 0;
  const wins = playerState.gamesWon || 0;
  const setbacks = playerState.setbacks || 0;
  const leadership = playerState.leadershipScore || 0;

  const momentumLine = wins >= 2
    ? "You stacked multiple wins and kept momentum high."
    : wins === 1
      ? "You secured a key win and learned from each moment."
      : "You focused on learning moments more than wins.";

  const effortLine = effortLevel >= 7
    ? "Your effort level stayed high, and teammates noticed."
    : effortLevel >= 4
      ? "Your effort level stayed steady, even when things got tough."
      : "You learned where to boost effort for next time.";

  const leadershipLine = leadership >= 4
    ? "Your leadership stood out and people looked to you for direction."
    : leadership >= 2
      ? "You showed leadership in key moments."
      : "You supported the team and kept growing.";

  const setbackLine = setbacks > 0
    ? "You faced a setback or two, but regrouped with a plan."
    : "You avoided major setbacks and stayed consistent.";

  return `Season Summary:\nYou, ${name}, leaned into the ${position} role and focused on ${focus}. ${momentumLine} ${effortLine} ${leadershipLine} ${setbackLine}`;
};

const updateScoreboard = () => {
  const levelConfig = LEVELS[currentLevelId];
  levelInfoEl.textContent = `${levelConfig.label} — Scene ${stepCount}`;
  questionCounterEl.textContent = `${stepCount}`;
  checkpointDisplayEl.textContent = currentCheckpoint?.label || "None yet";
};

const renderInputs = (scene) => {
  inputAreaEl.innerHTML = "";
  scene.inputs.forEach((input) => {
    const wrapper = document.createElement("div");
    wrapper.className = "input-group";

    const label = document.createElement("label");
    label.className = "input-label";
    label.textContent = input.label;

    let control;
    if (input.type === "select") {
      control = document.createElement("select");
      input.options.forEach((option) => {
        const optionEl = document.createElement("option");
        optionEl.value = option;
        optionEl.textContent = option;
        control.appendChild(optionEl);
      });
    } else if (input.type === "toggle") {
      control = document.createElement("input");
      control.type = "checkbox";
      control.className = "toggle-input";
    } else {
      control = document.createElement("input");
      control.type = input.type || "text";
      if (input.min !== undefined) control.min = input.min;
      if (input.max !== undefined) control.max = input.max;
      if (input.step !== undefined) control.step = input.step;
      if (input.placeholder) control.placeholder = input.placeholder;
    }

    control.classList.add("input");
    control.name = input.name;
    control.dataset.inputName = input.name;

    wrapper.appendChild(label);
    wrapper.appendChild(control);
    inputAreaEl.appendChild(wrapper);
  });
};

const readInputs = () => {
  const inputs = {};
  const controls = inputAreaEl.querySelectorAll("[data-input-name]");
  controls.forEach((control) => {
    const name = control.dataset.inputName;
    if (control.type === "checkbox") {
      inputs[name] = control.checked;
    } else {
      inputs[name] = control.value;
    }
  });
  return inputs;
};

const setInputsDisabled = (disabled) => {
  const controls = inputAreaEl.querySelectorAll("[data-input-name]");
  controls.forEach((control) => {
    control.disabled = disabled;
  });
};

const renderScene = (sceneId) => {
  const levelData = getCurrentLevelData();
  const scene = levelData.scenes[sceneId];
  if (!scene) {
    return;
  }

  currentSceneId = scene.id;
  stepCount += 1;
  pendingNextSceneId = null;
  scenarioTextEl.textContent = scene.storyText;
  resultTextEl.textContent = "";

  codeSnippetEl.textContent = scene.codeSnippet || "// Scene code";
  renderInputs(scene);
  setInputsDisabled(false);

  runSceneBtnEl.disabled = false;
  nextBtnEl.disabled = true;
  updateScoreboard();
};

const handleRunScene = () => {
  const levelData = getCurrentLevelData();
  const scene = levelData.scenes[currentSceneId];
  if (!scene) {
    return;
  }

  const inputs = readInputs();
  const outcome = scene.evaluate(inputs, playerState);
  applyUpdates(outcome.updates);

  resultTextEl.textContent = outcome.outcomeText || "You continue the story.";
  pendingNextSceneId = outcome.nextSceneId || null;

  if (scene.isCheckpoint && !outcome.isFailure) {
    currentCheckpoint = {
      sceneId: scene.id,
      label: scene.checkpointLabel || "Checkpoint reached",
    };
    checkpointState = JSON.parse(JSON.stringify(playerState));
  }

  setInputsDisabled(true);
  runSceneBtnEl.disabled = true;

  if (outcome.isFailure || !pendingNextSceneId) {
    endRun(outcome.outcomeText, outcome.isFailure);
    return;
  }

  nextBtnEl.disabled = false;
  updateScoreboard();
};

const continueStory = () => {
  if (!pendingNextSceneId) {
    return;
  }
  renderScene(pendingNextSceneId);
};

const endRun = (message, isFailure = false) => {
  gameAreaEl.hidden = true;
  gameOverEl.hidden = false;
  gameOverTitleEl.textContent = isFailure ? "Try Again" : "Story Complete";
  gameOverMessageEl.textContent = message || "Run complete!";
  finalPlayerNameEl.textContent = playerName;
  finalLevelEl.textContent = getCurrentLevelData().label;
  finalSummaryEl.textContent = buildSummary();
  continueCheckpointBtnEl.hidden = !currentCheckpoint;
};

const resetPlayerState = () => {
  playerState = {
    name: playerName,
    sport: "basketball",
    position: "",
    focus: "",
    effortLevel: 0,
    practiceHours: 0,
    drivePractice: 0,
    gamesWon: 0,
    setbacks: 0,
    injuries: 0,
    leadershipScore: 0,
  };
};

const startLevel = (levelId) => {
  currentLevelId = levelId;
  const levelData = getCurrentLevelData();
  stepCount = 0;
  pendingNextSceneId = null;
  currentCheckpoint = null;
  checkpointState = null;

  resetPlayerState();

  gameAreaEl.hidden = false;
  gameOverEl.hidden = true;
  renderScene(levelData.startSceneId);
};

const restartFromCheckpoint = () => {
  if (!currentCheckpoint) {
    startLevel(currentLevelId);
    return;
  }
  playerState = checkpointState
    ? JSON.parse(JSON.stringify(checkpointState))
    : playerState;
  stepCount = 0;
  pendingNextSceneId = null;
  gameAreaEl.hidden = false;
  gameOverEl.hidden = true;
  renderScene(currentCheckpoint.sceneId);
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

  const selectedLevel = parseInt(levelSelectEl.value, 10);
  startLevel(selectedLevel);
};

const initGame = () => {
  levelSelectEl = document.getElementById("levelSelect");
  startBtnEl = document.getElementById("startGameBtn");
  gameAreaEl = document.getElementById("gameArea");
  levelInfoEl = document.getElementById("levelInfo");
  questionCounterEl = document.getElementById("questionCounter");
  checkpointDisplayEl = document.getElementById("checkpointDisplay");
  scenarioTextEl = document.getElementById("scenarioText");
  codeSnippetEl = document.getElementById("codeSnippet");
  inputAreaEl = document.getElementById("inputArea");
  runSceneBtnEl = document.getElementById("runSceneBtn");
  resultTextEl = document.getElementById("resultText");
  nextBtnEl = document.getElementById("nextQuestionBtn");
  gameOverEl = document.getElementById("gameOver");
  gameOverTitleEl = document.getElementById("gameOverTitle");
  gameOverMessageEl = document.getElementById("gameOverMessage");
  finalPlayerNameEl = document.getElementById("finalPlayerName");
  finalLevelEl = document.getElementById("finalLevel");
  finalSummaryEl = document.getElementById("finalSummary");
  continueCheckpointBtnEl = document.getElementById("continueCheckpointBtn");
  playAgainBtnEl = document.getElementById("playAgainBtn");
  nameModalEl = document.getElementById("escapeNameModal");
  modalNameInputEl = document.getElementById("escapeModalName");
  modalMessageEl = document.getElementById("escapeModalMessage");
  modalStartBtnEl = document.getElementById("escapeModalStart");

  if (
    !levelSelectEl ||
    !startBtnEl ||
    !gameAreaEl ||
    !levelInfoEl ||
    !questionCounterEl ||
    !checkpointDisplayEl ||
    !scenarioTextEl ||
    !codeSnippetEl ||
    !inputAreaEl ||
    !runSceneBtnEl ||
    !resultTextEl ||
    !nextBtnEl ||
    !gameOverEl ||
    !gameOverTitleEl ||
    !gameOverMessageEl ||
    !finalPlayerNameEl ||
    !finalLevelEl ||
    !finalSummaryEl ||
    !continueCheckpointBtnEl ||
    !playAgainBtnEl ||
    !nameModalEl ||
    !modalNameInputEl ||
    !modalMessageEl ||
    !modalStartBtnEl
  ) {
    return;
  }

  nameModalEl.classList.remove("hidden");

  startBtnEl.addEventListener("click", () => {
    startLevel(parseInt(levelSelectEl.value, 10));
  });
  modalStartBtnEl.addEventListener("click", startGame);
  modalNameInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      startGame();
    }
  });
  runSceneBtnEl.addEventListener("click", handleRunScene);
  nextBtnEl.addEventListener("click", continueStory);
  playAgainBtnEl.addEventListener("click", () => startLevel(currentLevelId));
  continueCheckpointBtnEl.addEventListener("click", restartFromCheckpoint);
};

window.addEventListener("DOMContentLoaded", initGame);
