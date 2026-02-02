const LEADERBOARDS = [
  { key: "binary_blaster_leaderboard", label: "Binary Blaster" },
  { key: "algorithm_assembly_leaderboard", label: "Algorithm Assembly" },
  { key: "debugging_dash_leaderboard", label: "Debugging Dash" },
  { key: "variable_vault_leaderboard", label: "Variable Vault" },
  { key: "boolean_battle_leaderboard", label: "Boolean Battle" },
  { key: "cs_connections_leaderboard", label: "CS Connections" },
  { key: "cs_tenable_leaderboard", label: "CS Tenable" },
  { key: "cs_wordle_leaderboard", label: "CS Wordle" },
  { key: "encryption_escape_room_leaderboard", label: "Encryption Escape Room" },
  { key: "secure_or_sus_leaderboard", label: "Secure or Sus?" },
  { key: "network_defender_leaderboard", label: "Network Defender Simulator" },
  { key: "cyber_passwords_leaderboard", label: "Password Strength Shootout" },
  { key: "cyber_phishing_leaderboard", label: "Phishing or Legit?" },
  { key: "cyber_risk_leaderboard", label: "Risk Radar" },
  { key: "if_else_escape_leaderboard", label: "If / Else Escape" },
  { key: "hardware_hustle_leaderboard", label: "Hardware Hustle" },
  { key: "os_quick_tasks_leaderboard", label: "OS Quick Tasks" },
  { key: "network_cable_crafter_leaderboard", label: "Network Cable Crafter" },
  { key: "it_port_match_leaderboard", label: "Port Match" },
  { key: "it_shortcut_shuffle_leaderboard", label: "Shortcut Shuffle" },
  { key: "google_docs_speed_edit_leaderboard", label: "Google Docs Speed Edit" },
  { key: "google_slides_builder_leaderboard", label: "Google Slides SlideBuilder" },
  { key: "shortcut_ninja_leaderboard", label: "Shortcut Ninja" },
  { key: "windows_hotkey_leaderboard", label: "Windows Hotkey Challenge" },
  { key: "sheets_formula_leaderboard", label: "Sheets Formula Master" },
  { key: "file_explorer_leaderboard", label: "File Explorer Quest" },
  { key: "tech_tools_leaderboard", label: "Tech Tools Survival" },
];

const formatScore = (entry) => {
  if (entry.score !== undefined) {
    return `${entry.score} pts`;
  }
  if (entry.points !== undefined) {
    return `${entry.points} pts`;
  }
  if (entry.total !== undefined) {
    return `${entry.total} total`;
  }
  return "-";
};

const getScoreValue = (entry) =>
  entry.score ?? entry.points ?? entry.total ?? 0;

const formatDate = (entry) => {
  if (!entry.date) {
    return "";
  }
  const parsed = new Date(entry.date);
  if (Number.isNaN(parsed.valueOf())) {
    return "";
  }
  return parsed.toLocaleDateString();
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

const renderLeaderboards = () => {
  const listEl = document.getElementById("masterLeaderboardList");
  if (!listEl) {
    return;
  }
  listEl.innerHTML = "";

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

    header.appendChild(title);
    header.appendChild(meta);

    const list = document.createElement("ol");
    list.className = "leaderboard-list";

    if (!entries.length) {
      const empty = document.createElement("li");
      empty.textContent = "No scores yet.";
      list.appendChild(empty);
    } else {
      entries
        .sort((a, b) => getScoreValue(b) - getScoreValue(a))
        .slice(0, 5)
        .forEach((entry) => {
          const item = document.createElement("li");
          const date = formatDate(entry);
          const extras = [entry.level, entry.mode, entry.result, entry.category]
            .filter(Boolean)
            .join(" • ");
          const detail = extras ? ` — ${extras}` : "";
          const dateText = date ? ` — ${date}` : "";
          item.textContent = `${entry.name || "Player"} — ${formatScore(entry)}${detail}${dateText}`;
          list.appendChild(item);
        });
    }

    wrapper.appendChild(header);
    wrapper.appendChild(list);
    listEl.appendChild(wrapper);
  });
};

window.addEventListener("DOMContentLoaded", renderLeaderboards);
