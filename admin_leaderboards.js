const ADMIN_CODE = "a005";
const SESSION_KEY = "leaderboard_admin_authed";

const LEADERBOARDS = [
  { key: "binary_blaster_leaderboard", label: "Binary Blaster" },
  { key: "boolean_battle_leaderboard", label: "Boolean Battle" },
  { key: "cs_connections_leaderboard", label: "CS Connections" },
  { key: "cs_tenable_leaderboard", label: "CS Tenable" },
  { key: "cs_wordle_leaderboard", label: "CS Wordle" },
  { key: "cyber_passwords_leaderboard", label: "Password Strength Shootout" },
  { key: "cyber_phishing_leaderboard", label: "Phishing or Legit?" },
  { key: "cyber_risk_leaderboard", label: "Risk Radar" },
  { key: "if_else_escape_leaderboard", label: "If / Else Escape" },
  { key: "it_port_match_leaderboard", label: "Port Match" },
  { key: "it_shortcut_shuffle_leaderboard", label: "Shortcut Shuffle" },
];

const adminEls = {};

const setAdminMessage = (message, tone = "") => {
  adminEls.actionMessage.textContent = message;
  adminEls.actionMessage.className = `form-note ${tone}`.trim();
};

const loadEntries = (key) => {
  const stored = localStorage.getItem(key);
  if (!stored) {
    return [];
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const saveEntries = (key, entries) => {
  localStorage.setItem(key, JSON.stringify(entries));
};

const formatEntry = (entry) => {
  const parts = [];
  if (entry.name) {
    parts.push(entry.name);
  }
  if (entry.mode) {
    parts.push(entry.mode);
  }
  if (entry.difficulty) {
    parts.push(entry.difficulty);
  }
  if (entry.score !== undefined) {
    parts.push(`${entry.score} pts`);
  }
  if (entry.points !== undefined && entry.score === undefined) {
    parts.push(`${entry.points} pts`);
  }
  if (entry.time) {
    parts.push(`${entry.time} sec`);
  }
  if (entry.rounds) {
    parts.push(`${entry.rounds} rounds`);
  }
  if (entry.date) {
    const parsedDate = new Date(entry.date);
    if (!Number.isNaN(parsedDate.valueOf())) {
      parts.push(parsedDate.toLocaleString());
    }
  }
  if (!parts.length) {
    return JSON.stringify(entry);
  }
  return parts.join(" — ");
};

const clearLeaderboard = (key) => {
  saveEntries(key, []);
  renderLeaderboards();
};

const deleteEntry = (key, index) => {
  const entries = loadEntries(key);
  entries.splice(index, 1);
  saveEntries(key, entries);
  renderLeaderboards();
};

const renderLeaderboards = () => {
  adminEls.list.innerHTML = "";

  LEADERBOARDS.forEach((board) => {
    const entries = loadEntries(board.key);
    const wrapper = document.createElement("section");
    wrapper.className = "sub-card";

    const header = document.createElement("div");
    header.className = "sub-card-header";

    const title = document.createElement("h3");
    title.className = "sub-card-title";
    title.textContent = board.label;

    const meta = document.createElement("p");
    meta.className = "sub-card-meta";
    meta.textContent = `${entries.length} entr${entries.length === 1 ? "y" : "ies"}`;

    const clearBtn = document.createElement("button");
    clearBtn.className = "btn btn-outline btn-small";
    clearBtn.textContent = "Clear";
    clearBtn.addEventListener("click", () => {
      if (entries.length && window.confirm(`Clear all scores for ${board.label}?`)) {
        clearLeaderboard(board.key);
        setAdminMessage(`Cleared ${board.label} leaderboard.`);
      }
    });

    header.appendChild(title);
    header.appendChild(meta);
    header.appendChild(clearBtn);

    const list = document.createElement("ul");
    list.className = "admin-leaderboard-list";

    if (!entries.length) {
      const empty = document.createElement("li");
      empty.className = "admin-leaderboard-empty";
      empty.textContent = "No scores saved.";
      list.appendChild(empty);
    } else {
      entries.forEach((entry, index) => {
        const item = document.createElement("li");
        item.className = "admin-leaderboard-item";

        const text = document.createElement("span");
        text.textContent = formatEntry(entry);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn btn-danger btn-small";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
          if (window.confirm("Delete this entry?")) {
            deleteEntry(board.key, index);
            setAdminMessage(`Removed entry from ${board.label}.`);
          }
        });

        item.appendChild(text);
        item.appendChild(deleteBtn);
        list.appendChild(item);
      });
    }

    wrapper.appendChild(header);
    wrapper.appendChild(list);
    adminEls.list.appendChild(wrapper);
  });
};

const clearAllLeaderboards = () => {
  const totalEntries = LEADERBOARDS.reduce(
    (sum, board) => sum + loadEntries(board.key).length,
    0,
  );
  if (!totalEntries) {
    setAdminMessage("No leaderboard entries to clear.");
    return;
  }
  if (!window.confirm("Clear ALL leaderboard entries?")) {
    return;
  }
  LEADERBOARDS.forEach((board) => saveEntries(board.key, []));
  renderLeaderboards();
  setAdminMessage("All leaderboards cleared.");
};

const login = () => {
  const code = adminEls.codeInput.value.trim();
  if (code !== ADMIN_CODE) {
    adminEls.loginMessage.textContent = "Invalid admin password.";
    adminEls.loginMessage.className = "form-note warning";
    return;
  }
  sessionStorage.setItem(SESSION_KEY, "true");
  adminEls.loginModal.classList.add("hidden");
  adminEls.content.hidden = false;
  adminEls.loginMessage.textContent = "";
  adminEls.codeInput.value = "";
};

const bindLogin = () => {
  adminEls.loginBtn.addEventListener("click", login);
  adminEls.codeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      login();
    }
  });
};

const initAdmin = () => {
  adminEls.loginModal = document.getElementById("adminLoginModal");
  adminEls.codeInput = document.getElementById("adminCode");
  adminEls.loginBtn = document.getElementById("adminLoginBtn");
  adminEls.loginMessage = document.getElementById("adminLoginMessage");
  adminEls.list = document.getElementById("leaderboardAdminList");
  adminEls.actionMessage = document.getElementById("adminActionMessage");
  adminEls.clearAllBtn = document.getElementById("clearAllLeaderboards");
  adminEls.content = document.getElementById("adminContent");

  if (Object.values(adminEls).some((el) => !el)) {
    return;
  }

  bindLogin();
  adminEls.clearAllBtn.addEventListener("click", clearAllLeaderboards);

  if (sessionStorage.getItem(SESSION_KEY) === "true") {
    adminEls.loginModal.classList.add("hidden");
    adminEls.content.hidden = false;
  }

  renderLeaderboards();
};

window.addEventListener("DOMContentLoaded", initAdmin);
