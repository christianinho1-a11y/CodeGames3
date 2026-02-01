// if_else_escape.js

const MAX_LIVES = 3;
const LEADERBOARD_KEY = "if_else_escape_leaderboard";

const LEVEL_CONFIG = {
  1: { label: "Level 1 – Intro CS", multiplier: 1 },
  2: { label: "Level 2 – AP CSP", multiplier: 2 },
  3: { label: "Level 3 – AP CSA", multiplier: 3 },
  4: { label: "Level 4 – Honors DSA", multiplier: 4 },
  5: { label: "Level 5 – College CS", multiplier: 5 },
};

const STORY_LEVELS = {
  1: {
    title: "Rookie Cup Soccer",
    maxSteps: 6,
    start: "kickoff",
    nodes: {
      kickoff: {
        scenario:
          "Kickoff in the rookie cup. You can play it safe, push forward, or call for a quick pass. stamina = 6, support = true.",
        code: `if (stamina > 5 && support) {
  play = "quick pass";
} else if (stamina > 5) {
  play = "push forward";
} else {
  play = "play it safe";
}`,
        choices: [
          {
            label: "Call for the quick pass.",
            next: "throughBall",
            points: 2,
            outcome: "Your teammate is ready and the defense shifts.",
          },
          {
            label: "Push forward on your own.",
            next: "dribble",
            points: 1,
            outcome: "You keep the ball but feel the pressure closing in.",
          },
          {
            label: "Play it safe and reset.",
            next: "reset",
            points: 0,
            outcome: "You keep possession, but the crowd groans.",
          },
        ],
      },
      throughBall: {
        scenario:
          "You spot a runner. accuracy = 4, defenderClose = true.",
        code: `if (accuracy >= 5) {
  pass = "threaded";
} else if (defenderClose) {
  pass = "risky";
} else {
  pass = "clean";
}`,
        choices: [
          {
            label: "Thread the ball through the defenders.",
            next: "goalChance",
            points: 3,
            outcome: "The pass is risky, but it squeaks through.",
          },
          {
            label: "Take a safer touch and look for space.",
            next: "dribble",
            points: 1,
            outcome: "You slow the play and keep control.",
          },
          {
            label: "Reset the play back to midfield.",
            next: "reset",
            points: -1,
            outcome: "You give up momentum for safety.",
          },
        ],
      },
      dribble: {
        scenario:
          "A defender steps up. speed = 7, trickMove = false.",
        code: `if (speed >= 7 && !trickMove) {
  outcome = "beat defender";
} else if (trickMove) {
  outcome = "fancy move";
} else {
  outcome = "lose ball";
}`,
        choices: [
          {
            label: "Explode past the defender.",
            next: "goalChance",
            points: 2,
            outcome: "You beat them on pace and stay on goal.",
          },
          {
            label: "Try a flashy move.",
            next: "counter",
            points: -1,
            livesChange: -1,
            outcome: "The trick backfires and you stumble.",
          },
          {
            label: "Shield and look for help.",
            next: "reset",
            points: 0,
            outcome: "You keep the ball but slow the attack.",
          },
        ],
      },
      reset: {
        scenario:
          "Your team resets. focus = 3, coachSignal = true.",
        code: `if (coachSignal) {
  plan = "build up";
} else if (focus > 4) {
  plan = "quick strike";
} else {
  plan = "hold";
}`,
        choices: [
          {
            label: "Build up patiently.",
            next: "goalChance",
            points: 1,
            outcome: "You regain shape and set up another chance.",
          },
          {
            label: "Hold the ball and burn time.",
            next: "finalWhistle",
            points: 0,
            outcome: "The clock moves, but the crowd wants more.",
          },
        ],
      },
      goalChance: {
        scenario:
          "You line up a shot. shotPower = 8, goalieReady = false.",
        code: `if (shotPower > 7 && !goalieReady) {
  result = "goal";
} else if (shotPower > 7) {
  result = "save";
} else {
  result = "miss";
}`,
        checkpoint: "Goal scored!",
        choices: [
          {
            label: "Fire the shot.",
            next: "finalWhistle",
            points: 4,
            outcome: "Goal! The net ripples and the crowd erupts.",
          },
          {
            label: "Square it to a teammate.",
            next: "finalWhistle",
            points: 2,
            outcome: "They finish it calmly for a goal.",
          },
          {
            label: "Hesitate and look for a better angle.",
            next: "counter",
            points: -2,
            livesChange: -1,
            outcome: "You get closed down and lose the ball.",
          },
        ],
      },
      counter: {
        scenario:
          "The other team counters fast. hustle = 4.",
        code: `if (hustle >= 5) {
  defense = "recover";
} else {
  defense = "exposed";
}`,
        choices: [
          {
            label: "Sprint back to defend.",
            next: "finalWhistle",
            points: 1,
            outcome: "You recover just in time to block a shot.",
          },
          {
            label: "Foul to stop the play.",
            next: "finalWhistle",
            points: -2,
            livesChange: -1,
            outcome: "You take a card but stop the danger.",
          },
        ],
      },
      finalWhistle: {
        scenario: "The final whistle blows. tally = 1.",
        code: `if (tally >= 1) {
  season = "champions";
} else {
  season = "rebuild";
}`,
        ending: "Match complete",
        choices: [
          {
            label: "Celebrate with the team.",
            next: null,
            points: 2,
            outcome: "You lift the trophy with a grin.",
          },
          {
            label: "Reflect on what to improve.",
            next: null,
            points: 1,
            outcome: "You plan your next training session.",
          },
        ],
      },
    },
  },
  2: {
    title: "Temple of Treasure",
    maxSteps: 7,
    start: "entrance",
    nodes: {
      entrance: {
        scenario:
          "You stand at a glowing temple entrance. torchLit = true, mapFound = false.",
        code: `if (torchLit && mapFound) {
  path = "inner gate";
} else if (torchLit) {
  path = "side corridor";
} else {
  path = "dark tunnel";
}`,
        choices: [
          {
            label: "Take the side corridor.",
            next: "glyphs",
            points: 2,
            outcome: "The torch light reveals ancient markings.",
          },
          {
            label: "Brave the dark tunnel.",
            next: "pitTrap",
            points: -1,
            livesChange: -1,
            outcome: "You stumble in the dark but push ahead.",
          },
          {
            label: "Search for a map first.",
            next: "camp",
            points: 1,
            outcome: "You find a scrap map near an old camp.",
          },
        ],
      },
      camp: {
        scenario:
          "You find supplies left behind. supplies = 2, water = 1.",
        code: `if (supplies > 1) {
  pack = "prepared";
} else if (water > 0) {
  pack = "light";
} else {
  pack = "risky";
}`,
        choices: [
          {
            label: "Stock up and move on.",
            next: "glyphs",
            points: 2,
            outcome: "You feel prepared for deeper traps.",
          },
          {
            label: "Move quickly with a light pack.",
            next: "pitTrap",
            points: 0,
            outcome: "Speed helps, but you lack extra gear.",
          },
        ],
      },
      glyphs: {
        scenario:
          "You face a puzzle wall. symbolMatch = 2, hintUsed = false.",
        code: `if (symbolMatch >= 3) {
  door = "open";
} else if (!hintUsed) {
  door = "half open";
} else {
  door = "sealed";
}`,
        choices: [
          {
            label: "Solve the glyphs carefully.",
            next: "treasureRoom",
            points: 3,
            outcome: "The door slides open with a click.",
          },
          {
            label: "Use a hint to force it open.",
            next: "treasureRoom",
            points: 1,
            outcome: "The door opens, but the mechanism groans.",
          },
          {
            label: "Force the door with brute strength.",
            next: "pitTrap",
            points: -2,
            livesChange: -1,
            outcome: "A trap triggers as you push.",
          },
        ],
      },
      pitTrap: {
        scenario:
          "A pit trap appears. ropeLength = 4, jumpSkill = 2.",
        code: `if (ropeLength >= 5) {
  escape = "swing";
} else if (jumpSkill >= 3) {
  escape = "jump";
} else {
  escape = "fall";
}`,
        choices: [
          {
            label: "Swing across with the rope.",
            next: "treasureRoom",
            points: 2,
            outcome: "You swing safely over the pit.",
          },
          {
            label: "Attempt a running jump.",
            next: "treasureRoom",
            points: 0,
            outcome: "You barely clear it with a scrape.",
          },
          {
            label: "Climb down carefully.",
            next: "treasureRoom",
            points: -1,
            livesChange: -1,
            outcome: "You lose time and get banged up.",
          },
        ],
      },
      treasureRoom: {
        scenario:
          "The treasure chamber glows. guardianAwake = false, respectShown = true.",
        code: `if (!guardianAwake && respectShown) {
  treasure = "claim";
} else if (guardianAwake) {
  treasure = "negotiate";
} else {
  treasure = "leave";
}`,
        checkpoint: "Treasure found!",
        choices: [
          {
            label: "Take the treasure respectfully.",
            next: "exit",
            points: 4,
            outcome: "You secure the treasure without a fight.",
          },
          {
            label: "Wake the guardian and negotiate.",
            next: "exit",
            points: 2,
            outcome: "The guardian grants you a smaller prize.",
          },
          {
            label: "Leave the treasure and escape.",
            next: "exit",
            points: 1,
            outcome: "You live to explore another day.",
          },
        ],
      },
      exit: {
        scenario:
          "You reach daylight. teamSafe = true.",
        code: `if (teamSafe) {
  ending = "legend";
} else {
  ending = "lonely exit";
}`,
        ending: "Adventure complete",
        choices: [
          {
            label: "Share the story with your team.",
            next: null,
            points: 2,
            outcome: "Your crew celebrates your success.",
          },
          {
            label: "Keep the details secret.",
            next: null,
            points: 1,
            outcome: "You stash the treasure and slip away.",
          },
        ],
      },
    },
  },
  3: {
    title: "Team Project Drama",
    maxSteps: 7,
    start: "kickoff",
    nodes: {
      kickoff: {
        scenario:
          "Your group project starts. teammatePrepared = false, deadlinesClose = true.",
        code: `if (teammatePrepared && !deadlinesClose) {
  plan = "explore ideas";
} else if (deadlinesClose) {
  plan = "assign tasks";
} else {
  plan = "review basics";
}`,
        choices: [
          {
            label: "Assign tasks immediately.",
            next: "standup",
            points: 2,
            outcome: "You give everyone clear ownership.",
          },
          {
            label: "Review the basics together.",
            next: "standup",
            points: 1,
            outcome: "You reset expectations with the team.",
          },
          {
            label: "Let people self-assign later.",
            next: "conflict",
            points: -2,
            outcome: "Confusion builds as the deadline nears.",
          },
        ],
      },
      standup: {
        scenario:
          "Daily standup time. blockers = 1, clarity = 2.",
        code: `if (blockers == 0) {
  mood = "confident";
} else if (clarity >= 2) {
  mood = "focused";
} else {
  mood = "stressed";
}`,
        choices: [
          {
            label: "Facilitate a quick problem-solve.",
            next: "conflict",
            points: 2,
            outcome: "Blockers drop and momentum rises.",
          },
          {
            label: "Skip standup and keep coding.",
            next: "conflict",
            points: -1,
            outcome: "Progress happens, but issues stay hidden.",
          },
          {
            label: "Ask for clarity on responsibilities.",
            next: "conflict",
            points: 1,
            outcome: "The team re-aligns on roles.",
          },
        ],
      },
      conflict: {
        scenario:
          "Two teammates disagree. respect = 4, timeLeft = 2.",
        code: `if (respect >= 4 && timeLeft > 1) {
  approach = "mediate";
} else if (timeLeft <= 1) {
  approach = "decide quickly";
} else {
  approach = "avoid";
}`,
        choices: [
          {
            label: "Mediate and find common ground.",
            next: "resolution",
            points: 3,
            outcome: "Everyone feels heard and stays on task.",
          },
          {
            label: "Make a quick decision for the team.",
            next: "resolution",
            points: 1,
            outcome: "You move forward, but tension lingers.",
          },
          {
            label: "Avoid the conflict for now.",
            next: "resolution",
            points: -2,
            livesChange: -1,
            outcome: "The disagreement resurfaces later.",
          },
        ],
      },
      resolution: {
        scenario:
          "The conflict is almost resolved. accountability = true.",
        code: `if (accountability) {
  status = "resolved";
} else {
  status = "messy";
}`,
        checkpoint: "Conflict resolved!",
        choices: [
          {
            label: "Document the decision and move on.",
            next: "demoPrep",
            points: 2,
            outcome: "Everyone knows what to do next.",
          },
          {
            label: "Let it go and keep coding.",
            next: "demoPrep",
            points: 0,
            outcome: "You move forward but risk confusion later.",
          },
        ],
      },
      demoPrep: {
        scenario:
          "Demo day is close. bugsLeft = 3, polish = 1.",
        code: `if (bugsLeft <= 1 && polish >= 2) {
  prep = "showcase";
} else if (bugsLeft <= 3) {
  prep = "stable";
} else {
  prep = "rough";
}`,
        choices: [
          {
            label: "Fix the last bugs first.",
            next: "presentation",
            points: 2,
            outcome: "Stability improves before showtime.",
          },
          {
            label: "Polish the visuals.",
            next: "presentation",
            points: 1,
            outcome: "The demo looks sleek, bugs remain.",
          },
          {
            label: "Add one more feature.",
            next: "presentation",
            points: -2,
            livesChange: -1,
            outcome: "Scope creep adds stress.",
          },
        ],
      },
      presentation: {
        scenario:
          "You present the project. confidence = 5, practiceRuns = 1.",
        code: `if (confidence >= 5 && practiceRuns > 1) {
  demo = "smooth";
} else if (confidence >= 5) {
  demo = "okay";
} else {
  demo = "shaky";
}`,
        ending: "Project delivered",
        choices: [
          {
            label: "Let the team handle their sections.",
            next: null,
            points: 3,
            outcome: "The demo flows and the class applauds.",
          },
          {
            label: "Take over the demo yourself.",
            next: null,
            points: 1,
            outcome: "You pull it off, but the team feels sidelined.",
          },
        ],
      },
    },
  },
  4: {
    title: "Rescue Drone Mission",
    maxSteps: 7,
    start: "dispatch",
    nodes: {
      dispatch: {
        scenario:
          "You pilot a rescue drone. battery = 75, wind = 4.",
        code: `if (battery >= 70 && wind <= 4) {
  route = "direct";
} else if (battery >= 50) {
  route = "safe";
} else {
  route = "land and recharge";
}`,
        choices: [
          {
            label: "Take the direct route.",
            next: "scan",
            points: 2,
            outcome: "You reach the zone quickly.",
          },
          {
            label: "Choose the safer route.",
            next: "scan",
            points: 1,
            outcome: "You avoid turbulence but lose time.",
          },
          {
            label: "Land and recharge first.",
            next: "delay",
            points: -1,
            outcome: "You lose time but gain stability.",
          },
        ],
      },
      delay: {
        scenario:
          "The delay costs you time. signal = true.",
        code: `if (signal) {
  update = "received";
} else {
  update = "lost";
}`,
        choices: [
          {
            label: "Proceed with the latest update.",
            next: "scan",
            points: 1,
            outcome: "You get a better location lock.",
          },
          {
            label: "Proceed cautiously without update.",
            next: "scan",
            points: 0,
            outcome: "You rely on visuals alone.",
          },
        ],
      },
      scan: {
        scenario:
          "You scan for survivors. thermalReading = 2, audioPing = true.",
        code: `if (thermalReading >= 3) {
  target = "thermal";
} else if (audioPing) {
  target = "audio";
} else {
  target = "unknown";
}`,
        choices: [
          {
            label: "Follow the audio ping.",
            next: "rescue",
            points: 2,
            outcome: "You detect a faint call for help.",
          },
          {
            label: "Search the thermal spot.",
            next: "rescue",
            points: 1,
            outcome: "The heat signature is weak but promising.",
          },
          {
            label: "Circle wider for more data.",
            next: "storm",
            points: -1,
            outcome: "Clouds start to roll in.",
          },
        ],
      },
      storm: {
        scenario:
          "Weather worsens. gusts = 6.",
        code: `if (gusts >= 5) {
  mode = "stabilize";
} else {
  mode = "search";
}`,
        choices: [
          {
            label: "Stabilize the drone.",
            next: "rescue",
            points: 1,
            outcome: "You steady the drone and keep it safe.",
          },
          {
            label: "Push through the storm.",
            next: "rescue",
            points: -2,
            livesChange: -1,
            outcome: "You take damage but stay airborne.",
          },
        ],
      },
      rescue: {
        scenario:
          "You find the stranded team. payload = true, terrainClear = false.",
        code: `if (payload && terrainClear) {
  rescue = "land";
} else if (payload) {
  rescue = "drop supplies";
} else {
  rescue = "signal only";
}`,
        checkpoint: "Rescue secured!",
        choices: [
          {
            label: "Drop supplies from above.",
            next: "return",
            points: 3,
            outcome: "Supplies land safely near the team.",
          },
          {
            label: "Attempt a landing.",
            next: "return",
            points: 1,
            outcome: "You land but risk the drone.",
          },
          {
            label: "Signal for a ground team.",
            next: "return",
            points: 0,
            outcome: "Help is on the way, but slower.",
          },
        ],
      },
      return: {
        scenario:
          "Return flight. battery = 25.",
        code: `if (battery > 20) {
  return = "successful";
} else {
  return = "emergency landing";
}`,
        ending: "Mission complete",
        choices: [
          {
            label: "Fly straight home.",
            next: null,
            points: 2,
            outcome: "You get the drone back safely.",
          },
          {
            label: "Land at a safe outpost.",
            next: null,
            points: 1,
            outcome: "You secure the drone and log the rescue.",
          },
        ],
      },
    },
  },
  5: {
    title: "Hackathon Finals",
    maxSteps: 7,
    start: "pitch",
    nodes: {
      pitch: {
        scenario:
          "Final round pitch. demoReady = false, judgeFocus = true.",
        code: `if (demoReady && judgeFocus) {
  approach = "live demo";
} else if (judgeFocus) {
  approach = "story pitch";
} else {
  approach = "quick summary";
}`,
        choices: [
          {
            label: "Deliver a story-driven pitch.",
            next: "qa",
            points: 3,
            outcome: "Judges lean in to listen.",
          },
          {
            label: "Attempt a risky live demo.",
            next: "qa",
            points: -2,
            livesChange: -1,
            outcome: "The demo glitches, but you recover.",
          },
          {
            label: "Give a concise summary.",
            next: "qa",
            points: 1,
            outcome: "You stay on time, but miss details.",
          },
        ],
      },
      qa: {
        scenario:
          "Q&A begins. prepNotes = 2, teammateReady = true.",
        code: `if (prepNotes >= 3) {
  response = "detailed";
} else if (teammateReady) {
  response = "team answer";
} else {
  response = "short answer";
}`,
        choices: [
          {
            label: "Bring a teammate in to answer.",
            next: "debug",
            points: 2,
            outcome: "The team shows unity and clarity.",
          },
          {
            label: "Answer briefly and move on.",
            next: "debug",
            points: 0,
            outcome: "You keep pace but miss nuance.",
          },
          {
            label: "Offer a detailed technical breakdown.",
            next: "debug",
            points: 3,
            outcome: "Judges nod, impressed by depth.",
          },
        ],
      },
      debug: {
        scenario:
          "A bug appears right before judging. fixTime = 8, impactHigh = true.",
        code: `if (fixTime <= 5) {
  plan = "patch now";
} else if (impactHigh) {
  plan = "explain workaround";
} else {
  plan = "ignore";
}`,
        choices: [
          {
            label: "Explain a workaround live.",
            next: "finale",
            points: 2,
            outcome: "Judges appreciate the honesty.",
          },
          {
            label: "Patch it quickly anyway.",
            next: "finale",
            points: -1,
            livesChange: -1,
            outcome: "You fix it, but the stress shows.",
          },
          {
            label: "Ignore it and stay on script.",
            next: "finale",
            points: -2,
            outcome: "The bug appears during the demo.",
          },
        ],
      },
      finale: {
        scenario:
          "Final scores come in. innovation = 4, teamwork = 5.",
        code: `if (innovation >= 5 && teamwork >= 5) {
  result = "grand prize";
} else if (teamwork >= 5) {
  result = "team award";
} else {
  result = "honorable mention";
}`,
        checkpoint: "Results announced!",
        choices: [
          {
            label: "Celebrate the team win.",
            next: "wrap",
            points: 3,
            outcome: "Your team takes home a prize.",
          },
          {
            label: "Thank the mentors and judges.",
            next: "wrap",
            points: 2,
            outcome: "You build connections for the future.",
          },
          {
            label: "Set goals for the next hackathon.",
            next: "wrap",
            points: 1,
            outcome: "You leave inspired to improve.",
          },
        ],
      },
      wrap: {
        scenario:
          "The hackathon ends. feedback = true.",
        code: `if (feedback) {
  nextStep = "iterate";
} else {
  nextStep = "ship";
}`,
        ending: "Hackathon complete",
        choices: [
          {
            label: "Iterate on the project.",
            next: null,
            points: 2,
            outcome: "You leave with a roadmap for growth.",
          },
          {
            label: "Ship the project as-is.",
            next: null,
            points: 1,
            outcome: "You push your build to the world.",
          },
        ],
      },
    },
  },
};

let playerName = "";
let currentLevel = 1;
let currentStory = null;
let currentNodeId = null;
let pendingNextNode = null;
let stepsTaken = 0;
let score = 0;
let lives = MAX_LIVES;
let checkpointNode = null;
let checkpointScore = 0;
let checkpointSteps = 0;

let gameAreaEl;
let scenarioTextEl;
let resultTextEl;
let codeSnippetEl;
let choiceButtonsEl;
let nextQuestionBtnEl;
let levelInfoEl;
let questionCounterEl;
let scoreDisplayEl;
let livesDisplayEl;
let checkpointDisplayEl;
let gameOverEl;
let gameOverTitleEl;
let gameOverMessageEl;
let finalPlayerNameEl;
let finalLevelEl;
let finalScoreEl;
let continueCheckpointBtnEl;
let saveScoreBtnEl;
let playAgainBtnEl;
let leaderboardListEl;
let startGameBtnEl;
let playerNameInputEl;
let levelSelectEl;
let openLeaderboardBtnEl;

const updateScoreboard = () => {
  scoreDisplayEl.textContent = score;
  livesDisplayEl.textContent = "❤".repeat(lives);
  questionCounterEl.textContent = `${stepsTaken} / ${currentStory.maxSteps}`;
  checkpointDisplayEl.textContent = checkpointNode
    ? currentStory.nodes[checkpointNode].checkpoint || "Checkpoint reached"
    : "None yet";
};

const renderNode = (nodeId) => {
  const node = currentStory.nodes[nodeId];
  currentNodeId = nodeId;
  pendingNextNode = null;
  scenarioTextEl.textContent = node.scenario;
  codeSnippetEl.textContent = node.code;
  resultTextEl.textContent = "";
  nextQuestionBtnEl.disabled = true;
  choiceButtonsEl.innerHTML = "";

  levelInfoEl.textContent = `${LEVEL_CONFIG[currentLevel].label} – ${nodeId
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase())}`;

  node.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline";
    button.textContent = choice.label;
    button.addEventListener("click", () => handleChoice(choice, node));
    choiceButtonsEl.appendChild(button);
  });

  updateScoreboard();
};

const handleChoice = (choice, node) => {
  if (pendingNextNode || gameOverEl.hidden === false) {
    return;
  }

  const multiplier = LEVEL_CONFIG[currentLevel].multiplier;
  score += choice.points * multiplier;
  if (choice.livesChange) {
    lives = Math.max(0, Math.min(MAX_LIVES, lives + choice.livesChange));
  }

  if (node.checkpoint) {
    checkpointNode = currentNodeId;
    checkpointScore = score;
    checkpointSteps = stepsTaken;
  }

  resultTextEl.textContent = choice.outcome;
  pendingNextNode = choice.next;
  nextQuestionBtnEl.disabled = false;

  updateScoreboard();

  if (lives <= 0) {
    endGame("Out of lives! Try again from your last checkpoint.");
  }

  if (!choice.next) {
    endGame(node.ending || "Story complete!");
  }
};

const goToNextNode = () => {
  if (!pendingNextNode || lives <= 0) {
    return;
  }

  stepsTaken += 1;
  renderNode(pendingNextNode);
};

const startGame = () => {
  playerName = playerNameInputEl.value.trim() || "Player";
  currentLevel = parseInt(levelSelectEl.value, 10);
  currentStory = STORY_LEVELS[currentLevel];
  currentNodeId = currentStory.start;
  pendingNextNode = null;
  stepsTaken = 1;
  score = 0;
  lives = MAX_LIVES;
  checkpointNode = null;
  checkpointScore = 0;
  checkpointSteps = 0;

  gameAreaEl.hidden = false;
  gameOverEl.hidden = true;
  continueCheckpointBtnEl.hidden = true;
  saveScoreBtnEl.disabled = false;
  renderNode(currentNodeId);
};

const endGame = (message) => {
  gameAreaEl.hidden = true;
  gameOverEl.hidden = false;
  gameOverMessageEl.textContent = message;
  gameOverTitleEl.textContent = message.includes("complete")
    ? "Story Complete"
    : "Game Over";
  finalPlayerNameEl.textContent = playerName;
  finalLevelEl.textContent = LEVEL_CONFIG[currentLevel].label;
  finalScoreEl.textContent = score;
  continueCheckpointBtnEl.hidden = !checkpointNode;
};

const continueFromCheckpoint = () => {
  if (!checkpointNode) {
    return;
  }

  score = checkpointScore;
  lives = MAX_LIVES;
  stepsTaken = checkpointSteps;
  gameAreaEl.hidden = false;
  gameOverEl.hidden = true;
  renderNode(checkpointNode);
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
  leaderboardListEl.innerHTML = "";

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No scores yet. Be the first!";
    leaderboardListEl.appendChild(empty);
    return;
  }

  entries
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach((entry) => {
      const item = document.createElement("li");
      item.textContent = `${entry.name} — ${entry.level} — ${entry.score} pts`;
      leaderboardListEl.appendChild(item);
    });
};

const saveScore = () => {
  const entries = loadLeaderboard();
  entries.push({
    name: playerName,
    level: LEVEL_CONFIG[currentLevel].label,
    score,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  saveScoreBtnEl.disabled = true;
};

const initGame = () => {
  gameAreaEl = document.getElementById("gameArea");
  scenarioTextEl = document.getElementById("scenarioText");
  resultTextEl = document.getElementById("resultText");
  codeSnippetEl = document.getElementById("codeSnippet");
  choiceButtonsEl = document.getElementById("choiceButtons");
  nextQuestionBtnEl = document.getElementById("nextQuestionBtn");
  levelInfoEl = document.getElementById("levelInfo");
  questionCounterEl = document.getElementById("questionCounter");
  scoreDisplayEl = document.getElementById("scoreDisplay");
  livesDisplayEl = document.getElementById("livesDisplay");
  checkpointDisplayEl = document.getElementById("checkpointDisplay");
  gameOverEl = document.getElementById("gameOver");
  gameOverTitleEl = document.getElementById("gameOverTitle");
  gameOverMessageEl = document.getElementById("gameOverMessage");
  finalPlayerNameEl = document.getElementById("finalPlayerName");
  finalLevelEl = document.getElementById("finalLevel");
  finalScoreEl = document.getElementById("finalScore");
  continueCheckpointBtnEl = document.getElementById("continueCheckpointBtn");
  saveScoreBtnEl = document.getElementById("saveScoreBtn");
  playAgainBtnEl = document.getElementById("playAgainBtn");
  leaderboardListEl = document.getElementById("leaderboardList");
  startGameBtnEl = document.getElementById("startGameBtn");
  playerNameInputEl = document.getElementById("playerName");
  levelSelectEl = document.getElementById("levelSelect");
  openLeaderboardBtnEl = document.getElementById("openLeaderboardBtn");

  if (
    !gameAreaEl ||
    !scenarioTextEl ||
    !resultTextEl ||
    !codeSnippetEl ||
    !choiceButtonsEl ||
    !nextQuestionBtnEl ||
    !levelInfoEl ||
    !questionCounterEl ||
    !scoreDisplayEl ||
    !livesDisplayEl ||
    !checkpointDisplayEl ||
    !gameOverEl ||
    !gameOverTitleEl ||
    !gameOverMessageEl ||
    !finalPlayerNameEl ||
    !finalLevelEl ||
    !finalScoreEl ||
    !continueCheckpointBtnEl ||
    !saveScoreBtnEl ||
    !playAgainBtnEl ||
    !leaderboardListEl ||
    !startGameBtnEl ||
    !playerNameInputEl ||
    !levelSelectEl ||
    !openLeaderboardBtnEl
  ) {
    return;
  }

  updateLeaderboardUI();

  startGameBtnEl.addEventListener("click", startGame);
  nextQuestionBtnEl.addEventListener("click", goToNextNode);
  continueCheckpointBtnEl.addEventListener("click", continueFromCheckpoint);
  saveScoreBtnEl.addEventListener("click", saveScore);
  playAgainBtnEl.addEventListener("click", startGame);
  openLeaderboardBtnEl.addEventListener("click", () => {
    leaderboardListEl.scrollIntoView({ behavior: "smooth" });
  });
};

window.addEventListener("DOMContentLoaded", initGame);
