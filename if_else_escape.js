

// if_else_escape.js

// ----- Game configuration -----

const MAX_LIVES = 3;
const QUESTIONS_PER_GAME = 20; // 4 rooms * 5 puzzles each
const LEADERBOARD_KEY = "if_else_escape_leaderboard";

// ----- Story-based question bank -----
//
// Grouped roughly by difficulty slices for levels:
// Level 1 → Intro CS-style conditionals
// Level 2 → AP CSP-style if/else
// Level 3 → AP CSA-style else-if chains
// Level 4 → Honors DSA-style &&, ||, !
// Level 5 → College-ish combined / nested logic

const IF_ELSE_QUESTIONS = [
  // ---------------------------
  // LEVEL 1 SLICE (Intro CS)
  // Simple ifs in the "Pixel High CS Lab"
  // ---------------------------

  {
    scenario:
      "You’re staying after school in the Pixel High CS lab when the lights flicker and the monitors glow neon green. A message appears: 'WELCOME TO THE CODE DUNGEON.' The first door only opens if your keycard level is above 0. keycardLevel = 1.",
    code: `if (keycardLevel > 0) {
  openDoor();
}`,
    choices: [
      "The door unlocks and slides open.",
      "The door stays locked.",
      "The game crashes and restarts.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "You find a holographic vending machine that dispenses hint tokens—but only if you have at least 10 coins. coins = 7.",
    code: `if (coins >= 10) {
  dispenseHintToken();
}`,
    choices: [
      "A hint token pops out.",
      "Nothing happens.",
      "Your coins become 10.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A glowing floor tile says: 'STEP ONLY IF ENERGY == 100.' Your energy is exactly 100. energy = 100.",
    code: `if (energy == 100) {
  safeToStep = true;
}`,
    choices: [
      "safeToStep becomes true and you walk across safely.",
      "safeToStep becomes false and you fall through.",
      "Nothing changes; the tile ignores you.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "You approach a fan tunnel. A sign reads: 'If fanSpeed > 5, duck or be blasted back.' fanSpeed = 3.",
    code: `if (fanSpeed > 5) {
  show("Duck!");
}`,
    choices: [
      'The game shows "Duck!" and you crouch.',
      "Nothing appears; it’s safe.",
      "The fan explodes immediately.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A security drone hovers nearby. It only charges at you if alertLevel is greater than 8. alertLevel = 8.",
    code: `if (alertLevel > 8) {
  droneCharge();
}`,
    choices: [
      "The drone charges at you.",
      "The drone stays where it is.",
      "The drone powers off.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "You find a teleport pad labeled: 'Teleport if crystalsCollected >= 3'. crystalsCollected = 4.",
    code: `if (crystalsCollected >= 3) {
  teleportToNextRoom();
}`,
    choices: [
      "You teleport to the next room.",
      "You stay where you are.",
      "You lose all crystals.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "There’s a hallway full of lockers. A note says: 'If lockersOpened > 10, alarms sound.' lockersOpened = 2.",
    code: `if (lockersOpened > 10) {
  triggerAlarm();
}`,
    choices: [
      "The alarm blares loudly.",
      "No alarm sounds.",
      "All lockers close instantly.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "You see a shimmering save point. The caption says: 'If saveCrystals >= 1, activate checkpoint.' saveCrystals = 1.",
    code: `if (saveCrystals >= 1) {
  activateCheckpoint();
}`,
    choices: [
      "The checkpoint activates with a bright flash.",
      "Nothing happens.",
      "Your saveCrystals reset to 0, but the checkpoint does not activate.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "A digital whiteboard says: 'If puzzlesSolved == 5, reveal secret door.' puzzlesSolved = 3.",
    code: `if (puzzlesSolved == 5) {
  revealSecretDoor();
}`,
    choices: [
      "The secret door appears.",
      "Nothing happens yet.",
      "The whiteboard shuts off forever.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "You find a hologram projector that displays hints only if hintMeter < 2. hintMeter = 0.",
    code: `if (hintMeter < 2) {
  showHint();
}`,
    choices: [
      "A new hint appears on the projector.",
      "No hint appears.",
      "The hintMeter is set to 2, but you get no hint.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "A pressure plate reads: 'If weightOnPlate > 50, spikes extend.' weightOnPlate = 20.",
    code: `if (weightOnPlate > 50) {
  extendSpikes();
}`,
    choices: [
      "Spikes extend and block your path.",
      "The plate does nothing.",
      "The plate launches you upward.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A digital sign says: 'If torchesLit >= 3, the hallway lights up.' torchesLit = 3.",
    code: `if (torchesLit >= 3) {
  lightHallway();
}`,
    choices: [
      "The hallway lights up so you can see.",
      "Nothing changes; it stays dark.",
      "All torches go out.",
    ],
    correctIndex: 0,
  },

  // ---------------------------
  // LEVEL 2 SLICE (AP CSP)
  // if / else with story choices
  // ---------------------------

  {
    scenario:
      "You reach a fork in the code dungeon. A panel says: 'If hasMap is true, show the safe path; else show a random path.' hasMap = true.",
    code: `if (hasMap) {
  path = "safe";
} else {
  path = "random";
}`,
    choices: [
      'path becomes "safe".',
      'path becomes "random".',
      "path stays whatever it was before.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "You approach a riddle door. If your riddleScore >= 3, it opens; otherwise, it locks tighter. riddleScore = 1.",
    code: `if (riddleScore >= 3) {
  doorStatus = "open";
} else {
  doorStatus = "locked";
}`,
    choices: [
      'doorStatus is "open".',
      'doorStatus is "locked".',
      "doorStatus is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "You find a glowing console labeled 'Snack Dispenser'. If isHungry is true, it gives you a snack; otherwise, it says 'Maybe later.' isHungry = false.",
    code: `if (isHungry) {
  message = "Here, have a snack!";
} else {
  message = "Maybe later.";
}`,
    choices: [
      'message becomes "Here, have a snack!".',
      'message becomes "Maybe later."',
      "message stays empty.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A digital bridge appears over a lava pit. If bridgeStable is true, crossing is safe; else you fall. bridgeStable = false.",
    code: `if (bridgeStable) {
  status = "safe";
} else {
  status = "danger";
}`,
    choices: [
      'status is "safe".',
      'status is "danger".',
      "status is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A floating book of spells checks your focus. If focusLevel > 5, you cast a correct spell; else you miscast. focusLevel = 9.",
    code: `if (focusLevel > 5) {
  castStatus = "success";
} else {
  castStatus = "fail";
}`,
    choices: [
      'castStatus is "success".',
      'castStatus is "fail".',
      "castStatus stays unknown.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "You are given a digital companion cube. If companionOnline is true, it follows you; else it stays off. companionOnline = false.",
    code: `if (companionOnline) {
  cubeState = "following";
} else {
  cubeState = "idle";
}`,
    choices: [
      'cubeState is "following".',
      'cubeState is "idle".',
      "cubeState stays whatever it was.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A hallway of doors is labeled 'Only open doors for VIPs.' If isVIP is true, the door opens; else it flashes red. isVIP = true.",
    code: `if (isVIP) {
  doorLight = "green";
} else {
  doorLight = "red";
}`,
    choices: [
      'doorLight is "green".',
      'doorLight is "red".',
      "doorLight turns off.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "A control panel decides if you can access the next puzzle. If puzzlesSolved >= 5, accessGranted is true; else false. puzzlesSolved = 5.",
    code: `if (puzzlesSolved >= 5) {
  accessGranted = true;
} else {
  accessGranted = false;
}`,
    choices: [
      "accessGranted is true.",
      "accessGranted is false.",
      "accessGranted is unchanged.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "You find a terminal that checks if you’ve found the golden key. If hasGoldenKey is false, it says 'Keep searching'; else it says 'Door unlocked.' hasGoldenKey = false.",
    code: `if (!hasGoldenKey) {
  message = "Keep searching";
} else {
  message = "Door unlocked";
}`,
    choices: [
      'message is "Keep searching".',
      'message is "Door unlocked".',
      "message is empty.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "A trap chest checks if chestLocked is false. If it’s not locked, you safely open it; otherwise, it shoots confetti (and scares you). chestLocked = true.",
    code: `if (!chestLocked) {
  chestStatus = "opened safely";
} else {
  chestStatus = "confetti trap";
}`,
    choices: [
      'chestStatus is "opened safely".',
      'chestStatus is "confetti trap".',
      "chestStatus does not change.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A scoreboard shows your performance. If mistakes == 0, rank is 'Flawless'; else 'Human'. mistakes = 2.",
    code: `if (mistakes == 0) {
  rank = "Flawless";
} else {
  rank = "Human";
}`,
    choices: [
      'rank is "Flawless".',
      'rank is "Human".',
      "rank is blank.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A puzzle door checks your time. If timeRemaining > 30, it says 'Relax'; else 'Hurry!'. timeRemaining = 15.",
    code: `if (timeRemaining > 30) {
  doorMessage = "Relax";
} else {
  doorMessage = "Hurry!";
}`,
    choices: [
      'doorMessage is "Relax".',
      'doorMessage is "Hurry!".',
      "doorMessage is unchanged.",
    ],
    correctIndex: 1,
  },

  // ---------------------------
  // LEVEL 3 SLICE (AP CSA)
  // else-if chains narratively
  // ---------------------------

  {
    scenario:
      "You enter the Elemental Room. The temperature determines which elemental spirit appears. temp = 95.",
    code: `if (temp >= 90) {
  spirit = "Fire";
} else if (temp >= 60) {
  spirit = "Air";
} else if (temp >= 30) {
  spirit = "Water";
} else {
  spirit = "Earth";
}`,
    choices: [
      'spirit is "Fire".',
      'spirit is "Air".',
      'spirit is "Water".',
      'spirit is "Earth".',
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "You consult the dungeon’s grade tablet. It assigns a badge based on your puzzleScore. puzzleScore = 82.",
    code: `if (puzzleScore >= 90) {
  badge = "Legend";
} else if (puzzleScore >= 80) {
  badge = "Expert";
} else if (puzzleScore >= 70) {
  badge = "Adept";
} else {
  badge = "Novice";
}`,
    choices: [
      'badge is "Legend".',
      'badge is "Expert".',
      'badge is "Adept".',
      'badge is "Novice".',
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "You open a chest that classifies your progress. progressPercent = 74.",
    code: `if (progressPercent >= 90) {
  label = "Almost Out";
} else if (progressPercent >= 70) {
  label = "Deep In";
} else if (progressPercent >= 40) {
  label = "Halfway";
} else {
  label = "Just Started";
}`,
    choices: [
      'label is "Almost Out".',
      'label is "Deep In".',
      'label is "Halfway".',
      'label is "Just Started".',
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "The dungeon classifies your health state. health = 35.",
    code: `if (health > 75) {
  state = "Strong";
} else if (health > 50) {
  state = "Okay";
} else if (health > 25) {
  state = "Weak";
} else {
  state = "Critical";
}`,
    choices: [
      'state is "Strong".',
      'state is "Okay".',
      'state is "Weak".',
      'state is "Critical".',
    ],
    correctIndex: 2,
  },
  {
    scenario:
      "You adjust the difficulty dial on a console. Setting 0 shows 'Tutorial', 1–2 shows 'Normal', 3–4 shows 'Hard', else 'Insane'. difficultySetting = 3.",
    code: `if (difficultySetting == 0) {
  difficultyText = "Tutorial";
} else if (difficultySetting <= 2) {
  difficultyText = "Normal";
} else if (difficultySetting <= 4) {
  difficultyText = "Hard";
} else {
  difficultyText = "Insane";
}`,
    choices: [
      'difficultyText is "Tutorial".',
      'difficultyText is "Normal".',
      'difficultyText is "Hard".',
      'difficultyText is "Insane".',
    ],
    correctIndex: 2,
  },
  {
    scenario:
      "A puzzle classifies how many secret rooms you've found. secretsFound = 0.",
    code: `if (secretsFound >= 10) {
  classification = "Master Explorer";
} else if (secretsFound >= 5) {
  classification = "Explorer";
} else if (secretsFound >= 1) {
  classification = "Curious";
} else {
  classification = "Just Passing Through";
}`,
    choices: [
      'classification is "Master Explorer".',
      'classification is "Explorer".',
      'classification is "Curious".',
      'classification is "Just Passing Through".',
    ],
    correctIndex: 3,
  },
  {
    scenario:
      "A door chooses background music based on dangerLevel. dangerLevel = 6.",
    code: `if (dangerLevel >= 8) {
  music = "Intense Boss Theme";
} else if (dangerLevel >= 5) {
  music = "Tense Drums";
} else if (dangerLevel >= 2) {
  music = "Curious Ambience";
} else {
  music = "Chill Lo-fi";
}`,
    choices: [
      'music is "Intense Boss Theme".',
      'music is "Tense Drums".',
      'music is "Curious Ambience".',
      'music is "Chill Lo-fi".',
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "The hint system decides how many hints to give. mistakesMade = 3.",
    code: `if (mistakesMade == 0) {
  hintMode = "None";
} else if (mistakesMade == 1) {
  hintMode = "Subtle";
} else if (mistakesMade <= 3) {
  hintMode = "Helpful";
} else {
  hintMode = "Aggressive";
}`,
    choices: [
      'hintMode is "None".',
      'hintMode is "Subtle".',
      'hintMode is "Helpful".',
      'hintMode is "Aggressive".',
    ],
    correctIndex: 2,
  },
  {
    scenario:
      "The dungeon rates your speed by timeRemaining. timeRemaining = 5.",
    code: `if (timeRemaining > 60) {
  speedRating = "Chill Explorer";
} else if (timeRemaining > 30) {
  speedRating = "Balanced Solver";
} else if (timeRemaining > 10) {
  speedRating = "Quick Thinker";
} else {
  speedRating = "Speed Runner";
}`,
    choices: [
      'speedRating is "Chill Explorer".',
      'speedRating is "Balanced Solver".',
      'speedRating is "Quick Thinker".',
      'speedRating is "Speed Runner".',
    ],
    correctIndex: 3,
  },
  {
    scenario:
      "A mysterious mirror labels your courageLevel. courageLevel = 15.",
    code: `if (courageLevel >= 25) {
  courageLabel = "Fearless";
} else if (courageLevel >= 15) {
  courageLabel = "Brave";
} else if (courageLevel >= 5) {
  courageLabel = "Trying";
} else {
  courageLabel = "Nervous";
}`,
    choices: [
      'courageLabel is "Fearless".',
      'courageLabel is "Brave".',
      'courageLabel is "Trying".',
      'courageLabel is "Nervous".',
    ],
    correctIndex: 1,
  },

  // ---------------------------
  // LEVEL 4 SLICE (Honors DSA)
  // &&, ||, ! in story traps
  // ---------------------------

  {
    scenario:
      "You reach the Laser Gate. It only deactivates if you have the passcode AND are wearing safety goggles. hasPasscode = true, wearingGoggles = false.",
    code: `if (hasPasscode && wearingGoggles) {
  lasersOn = false;
} else {
  lasersOn = true;
}`,
    choices: [
      "lasersOn is false.",
      "lasersOn is true.",
      "lasersOn is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "You want to sneak past a sleepy guard. The path is safe if noiseLevel is 0 OR guardAsleep is true. noiseLevel = 4, guardAsleep = true.",
    code: `if (noiseLevel == 0 || guardAsleep) {
  pathSafe = true;
} else {
  pathSafe = false;
}`,
    choices: [
      "pathSafe is true.",
      "pathSafe is false.",
      "pathSafe is unchanged.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "The Code Vault opens only if you are a member AND your keycard is valid. isMember = true, keycardValid = false.",
    code: `if (isMember && keycardValid) {
  vaultStatus = "open";
} else {
  vaultStatus = "closed";
}`,
    choices: [
      'vaultStatus is "open".',
      'vaultStatus is "closed".',
      "vaultStatus is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A door will unlock if you solve the logic puzzle OR you have a master key. solvedPuzzle = false, hasMasterKey = false.",
    code: `if (solvedPuzzle || hasMasterKey) {
  doorUnlocked = true;
} else {
  doorUnlocked = false;
}`,
    choices: [
      "doorUnlocked is true.",
      "doorUnlocked is false.",
      "doorUnlocked is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "The alarm system triggers if NOT isDisarmed. isDisarmed = false.",
    code: `if (!isDisarmed) {
  alarmTriggered = true;
} else {
  alarmTriggered = false;
}`,
    choices: [
      "alarmTriggered is true.",
      "alarmTriggered is false.",
      "alarmTriggered stays whatever it was.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "The alarm system triggers if NOT isDisarmed. isDisarmed = true.",
    code: `if (!isDisarmed) {
  alarmTriggered = true;
} else {
  alarmTriggered = false;
}`,
    choices: [
      "alarmTriggered is true.",
      "alarmTriggered is false.",
      "alarmTriggered stays whatever it was.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A bridge appears only if hasCrystal AND hasRune. hasCrystal = true, hasRune = true.",
    code: `if (hasCrystal && hasRune) {
  bridgeVisible = true;
} else {
  bridgeVisible = false;
}`,
    choices: [
      "bridgeVisible is true.",
      "bridgeVisible is false.",
      "bridgeVisible is unchanged.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "The hint orb glows if your confusionLevel > 5 OR you have no hints left. confusionLevel = 2, hintsRemaining = 0.",
    code: `if (confusionLevel > 5 || hintsRemaining == 0) {
  orbGlowing = true;
} else {
  orbGlowing = false;
}`,
    choices: [
      "orbGlowing is true.",
      "orbGlowing is false.",
      "orbGlowing is unchanged.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "The trap floor opens if weightOnTile > 50 AND isTripped is true. weightOnTile = 80, isTripped = false.",
    code: `if (weightOnTile > 50 && isTripped) {
  floorOpen = true;
} else {
  floorOpen = false;
}`,
    choices: [
      "floorOpen is true.",
      "floorOpen is false.",
      "floorOpen is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A secret library door opens if you enter the code OR the librarian likes you. codeCorrect = false, librarianFriendly = true.",
    code: `if (codeCorrect || librarianFriendly) {
  libraryDoor = "open";
} else {
  libraryDoor = "closed";
}`,
    choices: [
      'libraryDoor is "open".',
      'libraryDoor is "closed".',
      "libraryDoor is unchanged.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "The elevator moves if NOT (overloaded OR powerOut). overloaded = false, powerOut = true.",
    code: `if (!(overloaded || powerOut)) {
  elevatorMoving = true;
} else {
  elevatorMoving = false;
}`,
    choices: [
      "elevatorMoving is true.",
      "elevatorMoving is false.",
      "elevatorMoving is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "The elevator moves if NOT (overloaded OR powerOut). overloaded = false, powerOut = false.",
    code: `if (!(overloaded || powerOut)) {
  elevatorMoving = true;
} else {
  elevatorMoving = false;
}`,
    choices: [
      "elevatorMoving is true.",
      "elevatorMoving is false.",
      "elevatorMoving is unchanged.",
    ],
    correctIndex: 0,
  },

  // ---------------------------
  // LEVEL 5 SLICE (College-ish)
  // Nested / combined story logic
  // ---------------------------

  {
    scenario:
      "You reach the Core Door. First it checks if you’re wearing the correct badge. Only then does it check if your clearanceLevel > 3. wearingBadge = true, clearanceLevel = 2.",
    code: `if (wearingBadge) {
  if (clearanceLevel > 3) {
    coreDoor = "open";
  }
}`,
    choices: [
      'coreDoor becomes "open".',
      'coreDoor stays whatever it was (probably closed).',
      'coreDoor becomes "error".',
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "In another hallway, the code first checks if wearingBadge is true, then checks clearanceLevel > 3. wearingBadge = true, clearanceLevel = 5.",
    code: `if (wearingBadge) {
  if (clearanceLevel > 3) {
    coreDoor = "open";
  }
}`,
    choices: [
      'coreDoor becomes "open".',
      'coreDoor stays whatever it was.',
      'coreDoor becomes "denied".',
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "A logic gate decides whether to show the 'Secret Ending'. It appears only if (allRoomsCleared AND coinsCollected >= 50). allRoomsCleared = true, coinsCollected = 40.",
    code: `if (allRoomsCleared && coinsCollected >= 50) {
  ending = "Secret Ending";
} else {
  ending = "Normal Ending";
}`,
    choices: [
      'ending is "Secret Ending".',
      'ending is "Normal Ending".',
      "ending doesn't change.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A filter decides whether to show you the 'Pro Tip' tutorial. It shows only if NOT (alreadyPro || skipTutorial). alreadyPro = false, skipTutorial = false.",
    code: `if (!(alreadyPro || skipTutorial)) {
  showProTip = true;
} else {
  showProTip = false;
}`,
    choices: [
      "showProTip is true.",
      "showProTip is false.",
      "showProTip is unchanged.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "You stand before the final puzzle console. It grants 'Perfect Clear' only if mistakes == 0 AND timeRemaining > 0. mistakes = 1, timeRemaining = 120.",
    code: `if (mistakes == 0 && timeRemaining > 0) {
  result = "Perfect Clear";
} else {
  result = "Clear";
}`,
    choices: [
      'result is "Perfect Clear".',
      'result is "Clear".',
      "result is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A strange orb reacts only when (magicLevel > 5 OR debugMode is true) AND NOT cursed. magicLevel = 3, debugMode = true, cursed = false.",
    code: `if ((magicLevel > 5 || debugMode) && !cursed) {
  orbState = "Awake";
} else {
  orbState = "Dormant";
}`,
    choices: [
      'orbState is "Awake".',
      'orbState is "Dormant".',
      "orbState is unchanged.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "The orb reacts only when (magicLevel > 5 OR debugMode is true) AND NOT cursed. magicLevel = 3, debugMode = false, cursed = true.",
    code: `if ((magicLevel > 5 || debugMode) && !cursed) {
  orbState = "Awake";
} else {
  orbState = "Dormant";
}`,
    choices: [
      'orbState is "Awake".',
      'orbState is "Dormant".',
      "orbState is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "A gate’s logic says: if (hasBlueKey && hasRedKey) OR masterOverride is true, then open. hasBlueKey = true, hasRedKey = false, masterOverride = true.",
    code: `if ((hasBlueKey && hasRedKey) || masterOverride) {
  gate = "open";
} else {
  gate = "closed";
}`,
    choices: [
      'gate is "open".',
      'gate is "closed".',
      "gate is unchanged.",
    ],
    correctIndex: 0,
  },
  {
    scenario:
      "The same gate logic runs, but this time hasBlueKey = true, hasRedKey = false, masterOverride = false.",
    code: `if ((hasBlueKey && hasRedKey) || masterOverride) {
  gate = "open";
} else {
  gate = "closed";
}`,
    choices: [
      'gate is "open".',
      'gate is "closed".',
      "gate is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "For the final hallway, an AI checks if (goodDeeds >= 5 AND badJokes < 3). goodDeeds = 5, badJokes = 3.",
    code: `if (goodDeeds >= 5 && badJokes < 3) {
  hallwayMood = "Cheerful";
} else {
  hallwayMood = "Slightly Judgy";
}`,
    choices: [
      'hallwayMood is "Cheerful".',
      'hallwayMood is "Slightly Judgy".',
      "hallwayMood is unchanged.",
    ],
    correctIndex: 1,
  },
  {
    scenario:
      "The same AI logic: goodDeeds = 5, badJokes = 2.",
    code: `if (goodDeeds >= 5 && badJokes < 3) {
  hallwayMood = "Cheerful";
} else {
  hallwayMood = "Slightly Judgy";
}`,
    choices: [
      'hallwayMood is "Cheerful".',
      'hallwayMood is "Slightly Judgy".',
      "hallwayMood is unchanged.",
    ],
    correctIndex: 0,
  }
];

// ----- State -----

let currentQuestionIndex = 0;
let questionOrder = [];
let currentScore = 0;
let currentPlayerName = "";
let hasAnsweredCurrent = false;
let gameFinished = false;
let scoreSavedForThisGame = false;
let livesLeft = MAX_LIVES;
let selectedLevel = 1;
let pointsPerQuestion = 1;

// checkpoint state
let checkpointIndex = 0;
let checkpointScore = 0;

// ----- DOM helper -----

function $(id) {
  return document.getElementById(id);
}

// ----- Leaderboard helpers -----

function loadLeaderboard() {
  try {
    const stored = localStorage.getItem(LEADERBOARD_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    console.error("Error loading leaderboard", e);
    return [];
  }
}

function saveLeaderboard(entries) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Error saving leaderboard", e);
  }
}

function addScoreToLeaderboard(name, score) {
  const entries = loadLeaderboard();
  entries.push({
    name: name || "Anonymous",
    score,
    timestamp: Date.now(),
  });

  entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.timestamp - a.timestamp;
  });

  const trimmed = entries.slice(0, 10);
  saveLeaderboard(trimmed);
  renderLeaderboard(trimmed);
}

function renderLeaderboard(entries = loadLeaderboard()) {
  const list = $("leaderboardList");
  if (!list) return;
  list.innerHTML = "";

  if (!entries.length) {
    const li = document.createElement("li");
    li.textContent = "No escape attempts recorded yet.";
    list.appendChild(li);
    return;
  }

  entries.forEach((entry) => {
    const li = document.createElement("li");
    const nameSpan = document.createElement("span");
    nameSpan.textContent = ` ${entry.name} — `;
    const scoreSpan = document.createElement("span");
    scoreSpan.textContent = `${entry.score} pts`;
    scoreSpan.style.color = "#bfdbfe";

    li.appendChild(nameSpan);
    li.appendChild(scoreSpan);
    list.appendChild(li);
  });
}

// ----- Helpers -----

function renderLives() {
  const el = $("livesDisplay");
  if (!el) return;
  el.textContent = "❤".repeat(livesLeft);
}

function updateCheckpointDisplay() {
  const el = $("checkpointDisplay");
  if (!el) return;

  if (checkpointIndex === 0) {
    el.textContent = "None yet";
  } else {
    const roomNumber = Math.floor(checkpointIndex / 5) + 1;
    el.textContent = `Room ${roomNumber}`;
  }
}

function updateQuestionAndRoomDisplay() {
  const totalQuestions = questionOrder.length;
  const questionNumber = currentQuestionIndex + 1;
  const roomNumber = Math.floor(currentQuestionIndex / 5) + 1;
  const totalRooms = Math.ceil(totalQuestions / 5);

  $("questionCounter").textContent = `${questionNumber} / ${totalQuestions}`;
  $("levelInfo").textContent = `Level ${selectedLevel} – Room ${roomNumber} of ${totalRooms}`;
}

// Extract things like "coins = 150" or "hasMap = true"
function extractAssignmentsFromScenario(scenarioText) {
  const assignments = [];
  const regex = /([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^\s,.]+)/g;
  let match;
  while ((match = regex.exec(scenarioText)) !== null) {
    const name = match[1];
    const value = match[2];
    assignments.push(`${name} = ${value}`);
  }
  return assignments;
}

// Fisher–Yates shuffle
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateQuestionOrderForLevel() {
  const total = IF_ELSE_QUESTIONS.length;
  if (total === 0) return [];

  const level = Math.min(Math.max(selectedLevel, 1), 5);
  const sliceSize = Math.floor(total / 5) || 1;
  const startIndex = sliceSize * (level - 1);
  const endIndex = level === 5 ? total : startIndex + sliceSize;

  const levelIndices = [];
  for (let i = startIndex; i < endIndex && i < total; i++) {
    levelIndices.push(i);
  }

  const groups = 4;
  const totalLevelQuestions = levelIndices.length;
  const baseGroupSize = Math.max(1, Math.floor(totalLevelQuestions / groups));
  const ordered = [];

  for (let g = 0; g < groups; g++) {
    const gStart = g * baseGroupSize;
    if (gStart >= totalLevelQuestions) break;
    const gEnd =
      g === groups - 1
        ? totalLevelQuestions
        : Math.min(totalLevelQuestions, gStart + baseGroupSize);

    const groupSlice = levelIndices.slice(gStart, gEnd);
    shuffleArray(groupSlice);
    ordered.push(...groupSlice);
  }

  return ordered.slice(0, Math.min(QUESTIONS_PER_GAME, ordered.length));
}

// ----- Game flow -----

function resetGame() {
  currentQuestionIndex = 0;
  currentScore = 0;
  hasAnsweredCurrent = false;
  gameFinished = false;
  scoreSavedForThisGame = false;
  livesLeft = MAX_LIVES;

  checkpointIndex = 0;
  checkpointScore = 0;

  questionOrder = generateQuestionOrderForLevel();

  $("scoreDisplay").textContent = "0";
  renderLives();
  updateCheckpointDisplay();
  updateQuestionAndRoomDisplay();

  $("gameOver").hidden = true;
  $("gameArea").hidden = false;
  $("nextQuestionBtn").disabled = true;
}

function startGame() {
  const nameInput = $("playerName");
  const levelSelect = $("levelSelect");

  const enteredName = nameInput.value.trim();
  if (!enteredName) {
    alert("Please enter your name to start your escape.");
    nameInput.focus();
    return;
  }

  const levelValue = parseInt(levelSelect.value, 10) || 1;
  selectedLevel = Math.min(Math.max(levelValue, 1), 5);
  pointsPerQuestion = selectedLevel; // L1=1, L2=2, ...

  currentPlayerName = enteredName;
  resetGame();
  loadQuestion();
}

function loadQuestion() {
  const totalQuestions = questionOrder.length;
  if (currentQuestionIndex >= totalQuestions) {
    showEndScreen("escape");
    return;
  }

  const qIndex = questionOrder[currentQuestionIndex];
  const q = IF_ELSE_QUESTIONS[qIndex];

  if (!q) {
    showEndScreen("escape");
    return;
  }

  $("scenarioText").textContent = q.scenario;

  const assignments = extractAssignmentsFromScenario(q.scenario);
  let codeToShow = q.code;
  if (assignments.length > 0) {
    const headerLines = ["// Current values:", ...assignments];
    codeToShow = headerLines.join("\n") + "\n\n" + q.code;
  }

  $("codeSnippet").textContent = codeToShow;

  const container = $("choiceButtons");
  container.innerHTML = "";
  q.choices.forEach((choiceText, index) => {
    const btn = document.createElement("button");
    btn.className = "btn btn-choice";
    btn.dataset.index = index.toString();
    btn.textContent = choiceText;
    btn.addEventListener("click", onChoiceClick);
    container.appendChild(btn);
  });

  hasAnsweredCurrent = false;
  $("nextQuestionBtn").disabled = true;
  updateQuestionAndRoomDisplay();
}

function onChoiceClick(event) {
  if (hasAnsweredCurrent || gameFinished) return;

  const button = event.currentTarget;
  const chosenIndex = parseInt(button.dataset.index || "0", 10);

  const qIndex = questionOrder[currentQuestionIndex];
  const q = IF_ELSE_QUESTIONS[qIndex];
  const correctIndex = q.correctIndex;

  hasAnsweredCurrent = true;

  const buttons = $("choiceButtons").querySelectorAll("button");
  buttons.forEach((btn, index) => {
    btn.disabled = true;

    if (index === correctIndex) {
      btn.style.borderColor = "#22c55e";
      btn.style.boxShadow = "0 0 0 1px rgba(34,197,94,0.7)";
    }

    if (index === chosenIndex && index !== correctIndex) {
      btn.style.borderColor = "#f97373";
      btn.style.boxShadow = "0 0 0 1px rgba(248,113,113,0.7)";
    }
  });

  if (chosenIndex === correctIndex) {
    currentScore += pointsPerQuestion;
    $("scoreDisplay").textContent = String(currentScore);
  } else {
    livesLeft -= 1;
    renderLives();
    if (livesLeft <= 0) {
      showEndScreen("trap");
      return;
    }
  }

  const questionNumber = currentQuestionIndex + 1;
  if (livesLeft > 0 && questionNumber % 5 === 0) {
    checkpointIndex = currentQuestionIndex + 1;
    checkpointScore = currentScore;
    updateCheckpointDisplay();
  }

  $("nextQuestionBtn").disabled = false;
}

function goToNextQuestion() {
  if (!hasAnsweredCurrent || gameFinished) return;

  currentQuestionIndex += 1;
  if (currentQuestionIndex >= questionOrder.length) {
    showEndScreen("escape");
  } else {
    loadQuestion();
  }
}

function showEndScreen(mode) {
  gameFinished = true;
  $("gameArea").hidden = true;
  $("gameOver").hidden = false;

  $("finalPlayerName").textContent = currentPlayerName || "Anonymous";
  $("finalScore").textContent = String(currentScore);
  $("finalLevel").textContent = `Level ${selectedLevel}`;

  const title = $("gameOverTitle");
  const msg = $("gameOverMessage");
  const continueBtn = $("continueCheckpointBtn");
  const saveBtn = $("saveScoreBtn");

  if (mode === "escape") {
    title.textContent = "You Escaped!";
    msg.textContent = "You solved all the logic puzzles in this level.";
    continueBtn.hidden = true;
    saveBtn.disabled = false;
  } else {
    title.textContent = "You Were Caught!";
    if (checkpointIndex > 0) {
      msg.textContent =
        "You hit a trap, but your last checkpoint is still intact. Continue from that checkpoint or restart the entire level.";
      continueBtn.hidden = false;
    } else {
      msg.textContent =
        "You hit a trap before reaching any checkpoint. Try the escape again from the start of the level.";
      continueBtn.hidden = true;
    }
    saveBtn.disabled = false;
  }

  scoreSavedForThisGame = false;
}

function continueFromCheckpoint() {
  if (checkpointIndex === 0) return;

  livesLeft = MAX_LIVES;
  currentScore = checkpointScore;
  currentQuestionIndex = checkpointIndex;
  gameFinished = false;
  hasAnsweredCurrent = false;

  $("scoreDisplay").textContent = String(currentScore);
  renderLives();
  updateCheckpointDisplay();
  updateQuestionAndRoomDisplay();

  $("gameOver").hidden = true;
  $("gameArea").hidden = false;
  $("nextQuestionBtn").disabled = true;

  loadQuestion();
}

function restartLevel() {
  resetGame();
  loadQuestion();
}

function saveCurrentScore() {
  if (!gameFinished) return;
  if (scoreSavedForThisGame) {
    alert("This score is already saved.");
    return;
  }
  addScoreToLeaderboard(currentPlayerName, currentScore);
  scoreSavedForThisGame = true;
  alert("Score saved to leaderboard!");
}

function scrollToLeaderboard() {
  const card = $("leaderboardCard");
  if (!card) return;
  card.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ----- Init -----

document.addEventListener("DOMContentLoaded", () => {
  renderLeaderboard();

  const startBtn = $("startGameBtn");
  const nextBtn = $("nextQuestionBtn");
  const saveBtn = $("saveScoreBtn");
  const playAgainBtn = $("playAgainBtn");
  const openLeaderboardBtn = $("openLeaderboardBtn");
  const continueCheckpointBtn = $("continueCheckpointBtn");

  if (startBtn) startBtn.addEventListener("click", startGame);
  if (nextBtn) nextBtn.addEventListener("click", goToNextQuestion);
  if (saveBtn) saveBtn.addEventListener("click", saveCurrentScore);
  if (playAgainBtn) playAgainBtn.addEventListener("click", restartLevel);
  if (openLeaderboardBtn)
    openLeaderboardBtn.addEventListener("click", scrollToLeaderboard);
  if (continueCheckpointBtn)
    continueCheckpointBtn.addEventListener("click", continueFromCheckpoint);
});
