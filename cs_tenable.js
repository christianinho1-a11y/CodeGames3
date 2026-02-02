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
    topic: "cs",
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
    topic: "cs",
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
    topic: "cs",
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
    topic: "cs",
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
    topic: "cs",
  },
  {
    title: "Networking Hardware Essentials",
    answers: [
      "Router",
      "Switch",
      "Access point",
      "Modem",
      "Firewall",
      "Patch panel",
      "Ethernet cable",
      "NIC",
      "Rack",
      "UPS",
    ],
    topic: "it",
  },
  {
    title: "IT Support Ticket Issues",
    answers: [
      "Password reset",
      "Printer offline",
      "Wi-Fi down",
      "Slow computer",
      "Email not syncing",
      "Blue screen",
      "VPN access",
      "Frozen app",
      "Disk full",
      "Account lockout",
    ],
    topic: "it",
  },
  {
    title: "Cloud & Virtualization Terms",
    answers: [
      "Virtual machine",
      "Hypervisor",
      "Snapshot",
      "Instance",
      "Load balancer",
      "Auto scaling",
      "IaaS",
      "PaaS",
      "SaaS",
      "Region",
    ],
    topic: "it",
  },
  {
    title: "Computer Essentials in the Lab",
    answers: [
      "Login credentials",
      "File Explorer",
      "Wi-Fi",
      "Headphones",
      "USB drive",
      "Printer queue",
      "Cloud storage",
      "Battery check",
      "Keyboard shortcuts",
      "Projector",
    ],
    topic: "it",
  },
  {
    title: "School-Friendly Apps & Platforms",
    answers: [
      "Google Classroom",
      "YouTube",
      "Quizlet",
      "Kahoot",
      "Scratch",
      "Canva",
      "Padlet",
      "Minecraft Education",
      "Google Docs",
      "Google Drive",
    ],
    topic: "it",
  },
  {
    title: "Most-Used Computer Parts",
    answers: [
      "CPU",
      "RAM",
      "SSD",
      "GPU",
      "Motherboard",
      "Keyboard",
      "Mouse",
      "Monitor",
      "Webcam",
      "Speakers",
    ],
    topic: "it",
  },
  {
    title: "Common Student Tech Issues",
    answers: [
      "Forgot password",
      "Wi-Fi down",
      "Battery dead",
      "Frozen app",
      "Printer jam",
      "Login error",
      "Slow computer",
      "File missing",
      "Audio not working",
      "Upload failed",
    ],
    topic: "it",
  },
  {
    title: "Programming Languages Students Hear About",
    answers: [
      "Python",
      "Java",
      "JavaScript",
      "C++",
      "C#",
      "Scratch",
      "Swift",
      "SQL",
      "HTML",
      "Rust",
    ],
    topic: "cs",
  },
  {
    title: "Popular Apps Students Use for School",
    answers: [
      "Google Classroom",
      "Google Docs",
      "Google Slides",
      "Google Sheets",
      "Google Drive",
      "Canvas",
      "Schoology",
      "Kahoot",
      "Quizlet",
      "Nearpod",
    ],
    topic: "it",
  },
  {
    title: "Cyber Threats Teens Should Know",
    answers: [
      "Phishing",
      "Password reuse",
      "Malware",
      "Ransomware",
      "Scams",
      "Data breach",
      "Fake Wi-Fi",
      "Social engineering",
      "Spyware",
      "Identity theft",
    ],
    topic: "cyber",
  },
  {
    title: "Tech Inventions That Changed Classrooms",
    answers: [
      "Laptop",
      "Projector",
      "Wi-Fi",
      "Smartphone",
      "Smartboard",
      "Cloud storage",
      "Video conferencing",
      "Printer",
      "USB drive",
      "Calculator",
    ],
    topic: "it",
  },
  {
    title: "Common File Extensions",
    answers: [
      ".docx",
      ".pptx",
      ".xlsx",
      ".pdf",
      ".jpg",
      ".png",
      ".mp3",
      ".mp4",
      ".txt",
      ".zip",
    ],
    topic: "it",
  },
  {
    title: "Top 10 Games Students Mention",
    answers: [
      "Minecraft",
      "Roblox",
      "Fortnite",
      "Among Us",
      "Rocket League",
      "Super Smash Bros",
      "Mario Kart",
      "Pokemon",
      "NBA 2K",
      "Mario Party",
    ],
    topic: "essentials",
  },
  {
    title: "Top 10 Social Media & Video Apps (School-Friendly)",
    answers: [
      "YouTube",
      "TikTok",
      "Instagram",
      "Snapchat",
      "Discord",
      "Pinterest",
      "Reddit",
      "Twitch",
      "WhatsApp",
      "BeReal",
    ],
    topic: "essentials",
  },
  {
    title: "Top 10 Online Safety Reminders",
    answers: [
      "Strong passwords",
      "Private accounts",
      "Think before you post",
      "Block strangers",
      "Report bullying",
      "Update apps",
      "Use MFA",
      "Avoid scam links",
      "Ask a trusted adult",
      "Log out on shared devices",
    ],
    topic: "essentials",
  },
  {
    title: "Top 10 Student-Friendly Study Tools",
    answers: [
      "Quizlet",
      "Kahoot",
      "Google Docs",
      "Google Slides",
      "Google Drive",
      "Nearpod",
      "Edpuzzle",
      "Canva",
      "Padlet",
      "Scratch",
    ],
    topic: "essentials",
  },
  {
    title: "Top 10 Ways Students Share Online",
    answers: [
      "Post",
      "Story",
      "Comment",
      "Like",
      "Share",
      "Reply",
      "Stream",
      "DM",
      "Snap",
      "Tag",
    ],
    topic: "essentials",
  },
  {
    title: "Computer Essentials in the Lab",
    answers: [
      "Login credentials",
      "File Explorer",
      "Wi-Fi",
      "Headphones",
      "USB drive",
      "Printer queue",
      "Cloud storage",
      "Battery check",
      "Keyboard shortcuts",
      "Projector",
    ],
    topic: "it",
  },
  {
    title: "School-Friendly Apps & Platforms",
    answers: [
      "Google Classroom",
      "YouTube",
      "Quizlet",
      "Kahoot",
      "Scratch",
      "Canva",
      "Padlet",
      "Minecraft Education",
      "Google Docs",
      "Google Drive",
    ],
    topic: "it",
  },
  {
    title: "Most-Used Computer Parts",
    answers: [
      "CPU",
      "RAM",
      "SSD",
      "GPU",
      "Motherboard",
      "Keyboard",
      "Mouse",
      "Monitor",
      "Webcam",
      "Speakers",
    ],
    topic: "it",
  },
  {
    title: "Common Student Tech Issues",
    answers: [
      "Forgot password",
      "Wi-Fi down",
      "Battery dead",
      "Frozen app",
      "Printer jam",
      "Login error",
      "Slow computer",
      "File missing",
      "Audio not working",
      "Upload failed",
    ],
    topic: "it",
  },
  {
    title: "Programming Languages Students Hear About",
    answers: [
      "Python",
      "Java",
      "JavaScript",
      "C++",
      "C#",
      "Scratch",
      "Swift",
      "SQL",
      "HTML",
      "Rust",
    ],
    topic: "cs",
  },
  {
    title: "Popular Apps Students Use for School",
    answers: [
      "Google Classroom",
      "Google Docs",
      "Google Slides",
      "Google Sheets",
      "Google Drive",
      "Canvas",
      "Schoology",
      "Kahoot",
      "Quizlet",
      "Nearpod",
    ],
    topic: "it",
  },
  {
    title: "Cyber Threats Teens Should Know",
    answers: [
      "Phishing",
      "Password reuse",
      "Malware",
      "Ransomware",
      "Scams",
      "Data breach",
      "Fake Wi-Fi",
      "Social engineering",
      "Spyware",
      "Identity theft",
    ],
    topic: "cyber",
  },
  {
    title: "Tech Inventions That Changed Classrooms",
    answers: [
      "Laptop",
      "Projector",
      "Wi-Fi",
      "Smartphone",
      "Smartboard",
      "Cloud storage",
      "Video conferencing",
      "Printer",
      "USB drive",
      "Calculator",
    ],
    topic: "it",
  },
  {
    title: "Common File Extensions",
    answers: [
      ".docx",
      ".pptx",
      ".xlsx",
      ".pdf",
      ".jpg",
      ".png",
      ".mp3",
      ".mp4",
      ".txt",
      ".zip",
    ],
    topic: "it",
  },
  {
    title: "Common Cyber Threats",
    answers: [
      "Phishing",
      "Ransomware",
      "Spyware",
      "DDoS",
      "SQL injection",
      "Credential stuffing",
      "Malware",
      "Zero-day",
      "Insider threat",
      "MITM",
    ],
    topic: "cyber",
  },
  {
    title: "Security Best Practices",
    answers: [
      "MFA",
      "Strong passwords",
      "Least privilege",
      "Patch updates",
      "Backups",
      "Encryption",
      "Security training",
      "Firewalls",
      "Logging",
      "Antivirus",
    ],
    topic: "cyber",
  },
  {
    title: "Cybersecurity Roles",
    answers: [
      "SOC analyst",
      "Incident responder",
      "Pen tester",
      "Threat hunter",
      "Security engineer",
      "GRC analyst",
      "CISO",
      "Blue team",
      "Red team",
      "Forensics",
    ],
    topic: "cyber",
  },
];

const MAX_STRIKES = 3;
const LEADERBOARD_KEY = "cs_tenable_leaderboard";

let currentCategoryIndex = -1;
let currentCategory = null;
let revealedAnswers = [];
let normalizedAnswers = [];
let strikes = 0;
let correctCount = 0;
let roundOver = false;
let playerName = "";
let scoreSaved = false;
let currentTopic = "all";

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
let startBtnEl;
let topicSelectEl;
let backLinkEl;
let nameModalEl;
let modalNameInputEl;
let modalMessageEl;
let modalStartBtnEl;
let leaderboardEl;

const normalizeGuess = (value) => value.trim().toLowerCase();
const validTopic = (topic) => ["all", "cs", "it", "cyber", "essentials"].includes(topic);
const topicLabels = {
  all: "All Topics",
  cs: "Computer Science",
  it: "Information Technology",
  cyber: "Cybersecurity",
  essentials: "Computer Essentials",
};

const getTopicFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const topic = params.get("topic");
  return validTopic(topic) ? topic : "all";
};

const getBackLinkFromQuery = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("from") || "cs_games.html";
};

const getBackLabel = (href) => {
  if (href.includes("it_games")) {
    return "IT Games";
  }
  if (href.includes("computer_essentials")) {
    return "Computer Essentials";
  }
  if (href.includes("cyber_games")) {
    return "Cyber Games";
  }
  return "CS Games";
};

const findMatchingAnswerIndex = (guess) => {
  const guessTokens = guess.split(/\s+/).filter(Boolean);

  return normalizedAnswers.findIndex((answer, index) => {
    if (revealedAnswers[index]) {
      return false;
    }

    if (answer.includes(guess) || guess.includes(answer)) {
      return true;
    }

    return guessTokens.some((token) => token.length > 1 && answer.includes(token));
  });
};

const getCategoryPool = () => {
  if (currentTopic === "all") {
    return TENABLE_CATEGORIES;
  }
  return TENABLE_CATEGORIES.filter((category) => (category.topic || "cs") === currentTopic);
};

const pickNewCategory = () => {
  const pool = getCategoryPool();
  if (!pool.length) {
    return null;
  }
  if (pool.length === 1) {
    currentCategoryIndex = 0;
    return pool[0];
  }

  let nextIndex = currentCategoryIndex;
  while (nextIndex === currentCategoryIndex) {
    nextIndex = Math.floor(Math.random() * pool.length);
  }

  currentCategoryIndex = nextIndex;
  return pool[nextIndex];
};

const updateScoreboard = () => {
  correctCountEl.textContent = correctCount;
  strikeCountEl.textContent = strikes;
  totalCountEl.textContent = currentCategory ? currentCategory.answers.length : 0;
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
      const topicLabel = topicLabels[entry.topic] || "All Topics";
      item.textContent = `${entry.name} — ${entry.score} / ${entry.total} (${entry.category}) — ${topicLabel}`;
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
    score: correctCount,
    total: currentCategory.answers.length,
    category: currentCategory.title,
    topic: currentTopic,
    date: new Date().toISOString(),
  });
  saveLeaderboard(entries);
  updateLeaderboardUI();
  scoreSaved = true;
};

const renderBoard = () => {
  answerBoardEl.innerHTML = "";

  currentCategory.answers.forEach((answer, index) => {
    const slot = document.createElement("div");
    slot.className = "tenable-slot";
    slot.dataset.index = index;

    const indexBadge = document.createElement("span");
    indexBadge.className = "tenable-slot-index";
    indexBadge.textContent = `${currentCategory.answers.length - index}.`;

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
  saveScore();
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

  const answerIndex = findMatchingAnswerIndex(guess);
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

const openNameModal = () => {
  nameModalEl.classList.remove("hidden");
  modalNameInputEl.focus();
};

const closeNameModal = () => {
  nameModalEl.classList.add("hidden");
};

const startNewRound = () => {
  if (!playerName) {
    openNameModal();
    return;
  }

  currentCategory = pickNewCategory();
  if (!currentCategory) {
    categoryTitleEl.textContent = "No categories available";
    answerBoardEl.innerHTML = "";
    setMessage("No categories exist for this topic yet.", "warning");
    setRoundState(true);
    return;
  }
  revealedAnswers = currentCategory.answers.map(() => false);
  normalizedAnswers = currentCategory.answers.map((answer) =>
    normalizeGuess(answer)
  );
  strikes = 0;
  correctCount = 0;
  scoreSaved = false;
  setRoundState(false);
  setMessage("");
  setSummary("");
  setModalMessage("");

  categoryTitleEl.textContent = currentCategory.title;
  updateScoreboard();
  renderBoard();

  guessInputEl.value = "";
  guessInputEl.focus();
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
  startNewRound();
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
  startBtnEl = document.getElementById("tenableStartBtn");
  nameModalEl = document.getElementById("tenableNameModal");
  modalNameInputEl = document.getElementById("tenableModalName");
  modalMessageEl = document.getElementById("tenableModalMessage");
  modalStartBtnEl = document.getElementById("tenableModalStart");
  leaderboardEl = document.getElementById("tenableLeaderboard");
  topicSelectEl = document.getElementById("tenableTopic");
  backLinkEl = document.getElementById("tenableBackLink");

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
    !summaryEl ||
    !startBtnEl ||
    !nameModalEl ||
    !modalNameInputEl ||
    !modalMessageEl ||
    !modalStartBtnEl ||
    !leaderboardEl ||
    !topicSelectEl ||
    !backLinkEl
  ) {
    return;
  }

  backLinkEl.href = getBackLinkFromQuery();
  const backLabel = getBackLabel(backLinkEl.href);
  backLinkEl.textContent = `← Back to ${backLabel}`;
  const initialTopic = getTopicFromQuery();
  topicSelectEl.value = initialTopic;
  currentTopic = initialTopic;
  currentCategoryIndex = -1;

  updateLeaderboardUI();

  setRoundState(true);

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

  startBtnEl.addEventListener("click", startNewRound);
  modalStartBtnEl.addEventListener("click", startGame);

  nextBtnEl.addEventListener("click", startNewRound);
  topicSelectEl.addEventListener("change", (event) => {
    currentTopic = validTopic(event.target.value) ? event.target.value : "all";
    currentCategoryIndex = -1;
    startNewRound();
  });

  backBtnEl.addEventListener("click", () => {
    window.location.href = getBackLinkFromQuery();
  });
  backBtnEl.textContent = `← Back to ${backLabel}`;

  answerBoardEl.innerHTML = "";
  updateScoreboard();
  openNameModal();
};

window.addEventListener("DOMContentLoaded", initGame);
