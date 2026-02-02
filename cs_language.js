const LANGUAGE_KEY = "cs_language_preference";

const LANGUAGE_OPTIONS = [
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
];

const getStoredLanguage = () => {
  const stored = localStorage.getItem(LANGUAGE_KEY);
  return LANGUAGE_OPTIONS.some((option) => option.value === stored)
    ? stored
    : "python";
};

const updateLabels = (languageValue) => {
  const label = LANGUAGE_OPTIONS.find((option) => option.value === languageValue)?.label;
  document.querySelectorAll("[data-language-label]").forEach((el) => {
    el.textContent = label ? `Language: ${label}` : "Language: Python";
  });
};

const initLanguageSelectors = () => {
  const selects = document.querySelectorAll("[data-language-select]");
  if (!selects.length) {
    return;
  }

  const storedLanguage = getStoredLanguage();
  selects.forEach((select) => {
    select.innerHTML = "";
    LANGUAGE_OPTIONS.forEach((option) => {
      const optionEl = document.createElement("option");
      optionEl.value = option.value;
      optionEl.textContent = option.label;
      select.appendChild(optionEl);
    });
    select.value = storedLanguage;
    select.addEventListener("change", () => {
      localStorage.setItem(LANGUAGE_KEY, select.value);
      updateLabels(select.value);
    });
  });

  updateLabels(storedLanguage);
};

window.addEventListener("DOMContentLoaded", initLanguageSelectors);
