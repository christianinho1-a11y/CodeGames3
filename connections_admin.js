const ADMIN_CODE = "A005";

const adminEls = {};
let adminGroups = Array.isArray(CONNECTIONS_GROUPS) ? [...CONNECTIONS_GROUPS] : [];

const setAdminMessage = (el, message, tone = "") => {
  el.textContent = message;
  el.className = `form-note ${tone}`.trim();
};

const renderGroups = () => {
  adminEls.groupsJson.value = JSON.stringify(adminGroups, null, 2);
};

const login = () => {
  const code = adminEls.codeInput.value.trim();
  if (code !== ADMIN_CODE) {
    setAdminMessage(adminEls.loginMessage, "Invalid admin code.", "warning");
    return;
  }
  adminEls.loginModal.classList.add("hidden");
};

const addGroup = () => {
  const category = adminEls.category.value.trim();
  const topic = adminEls.topic.value;
  const difficulty = adminEls.difficulty.value;
  const wordsRaw = adminEls.words.value.trim();

  if (!category || !wordsRaw) {
    setAdminMessage(adminEls.groupMessage, "Add a category and 4 words.", "warning");
    return;
  }

  const words = wordsRaw.split(",").map((w) => w.trim()).filter(Boolean);
  if (words.length !== 4) {
    setAdminMessage(adminEls.groupMessage, "Enter exactly 4 words.", "warning");
    return;
  }

  adminGroups.push({ category, words, difficulty, topic });
  renderGroups();
  adminEls.category.value = "";
  adminEls.words.value = "";
  setAdminMessage(adminEls.groupMessage, "Group added.");
};

const saveGroups = async () => {
  let parsed;
  try {
    parsed = JSON.parse(adminEls.groupsJson.value);
  } catch (error) {
    setAdminMessage(adminEls.groupMessage, "JSON is invalid.", "warning");
    return;
  }

  adminGroups = parsed;
  renderGroups();

  try {
    await fetch("php/save_cs_connections.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "groups", groups: adminGroups }),
    });
    setAdminMessage(adminEls.groupMessage, "Groups saved to server.");
  } catch (error) {
    setAdminMessage(adminEls.groupMessage, "Failed to save groups.", "warning");
  }
};

const randomizePuzzle = () => {
  if (adminGroups.length < 4) {
    setAdminMessage(adminEls.groupMessage, "Need at least 4 groups.", "warning");
    return;
  }
  const shuffled = [...adminGroups].sort(() => 0.5 - Math.random());
  const preview = shuffled.slice(0, 4).map((group) => group.category).join(", ");
  setAdminMessage(adminEls.groupMessage, `Randomized puzzle: ${preview}`);
};

const importCsv = () => {
  const file = adminEls.csvInput.files[0];
  if (!file) {
    setAdminMessage(adminEls.csvMessage, "Select a CSV file first.", "warning");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result;
    const lines = text.split(/\r?\n/).filter(Boolean);
    const newGroups = [];
    lines.forEach((line) => {
      const parts = line.split(",").map((part) => part.trim());
      if (parts.length >= 7) {
        const [category, topic, difficulty, ...words] = parts;
        newGroups.push({ category, difficulty, topic, words: words.slice(0, 4) });
      } else if (parts.length >= 6) {
        const [category, difficulty, ...words] = parts;
        newGroups.push({ category, difficulty, topic: "cs", words: words.slice(0, 4) });
      }
    });
    if (newGroups.length) {
      adminGroups = adminGroups.concat(newGroups);
      renderGroups();
      setAdminMessage(adminEls.csvMessage, `Imported ${newGroups.length} groups.`);
    } else {
      setAdminMessage(adminEls.csvMessage, "No valid rows found.", "warning");
    }
  };
  reader.readAsText(file);
};

const initAdmin = () => {
  adminEls.loginModal = document.getElementById("adminLoginModal");
  adminEls.codeInput = document.getElementById("adminCode");
  adminEls.loginBtn = document.getElementById("adminLoginBtn");
  adminEls.loginMessage = document.getElementById("adminLoginMessage");
  adminEls.category = document.getElementById("adminCategory");
  adminEls.topic = document.getElementById("adminTopic");
  adminEls.difficulty = document.getElementById("adminDifficulty");
  adminEls.words = document.getElementById("adminWords");
  adminEls.addGroup = document.getElementById("adminAddGroup");
  adminEls.groupMessage = document.getElementById("adminGroupMessage");
  adminEls.groupsJson = document.getElementById("adminGroupsJson");
  adminEls.saveGroups = document.getElementById("adminSaveGroups");
  adminEls.randomize = document.getElementById("adminRandomize");
  adminEls.csvInput = document.getElementById("adminCsv");
  adminEls.importCsv = document.getElementById("adminImportCsv");
  adminEls.csvMessage = document.getElementById("adminCsvMessage");

  if (Object.values(adminEls).some((el) => !el)) {
    return;
  }

  fetch("php/load_cs_connections.php")
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.groups) && data.groups.length) {
        adminGroups = data.groups;
      }
      renderGroups();
    })
    .catch(() => {
      renderGroups();
    });
  adminEls.loginBtn.addEventListener("click", login);
  adminEls.addGroup.addEventListener("click", addGroup);
  adminEls.saveGroups.addEventListener("click", saveGroups);
  adminEls.randomize.addEventListener("click", randomizePuzzle);
  adminEls.importCsv.addEventListener("click", importCsv);
};

window.addEventListener("DOMContentLoaded", initAdmin);
