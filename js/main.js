console.log("🚀 Quavron Loaded Successfully");

/* ========================================
NAVIGATION ACTIVE STATES
======================================== */

const navButtons = document.querySelectorAll(
".top-btn, .dashboard-sidebar li"
);

navButtons.forEach(button => {

button.addEventListener("click", () => {

navButtons.forEach(item => {
  item.classList.remove("active-menu");
});

button.classList.add("active-menu");

});

});

/* ========================================
DASHBOARD BUTTONS
======================================== */

const dashboardButtons = document.querySelectorAll(
".dashboard-btn"
);

dashboardButtons.forEach(button => {

button.addEventListener("click", () => {

console.log(
  button.innerText + " clicked"
);

});

});

/* ========================================
QUICK ACTIONS
======================================== */

const actionButtons = document.querySelectorAll(
".actions-grid button"
);

actionButtons.forEach(button => {

button.addEventListener("click", () => {

alert(
  button.innerText + " feature coming soon 🚀"
);

});

});

/* ========================================
AUTH FORMS
======================================== */

const authForms = document.querySelectorAll(
".auth-form"
);

authForms.forEach(form => {

form.addEventListener("submit", (e) => {

e.preventDefault();

alert("Authentication system coming soon 🚀");

});

});

/* ========================================
LANGUAGE SWITCHER
======================================== */

const languageSwitcher = document.querySelector(
".language-switcher"
);

if (languageSwitcher) {

languageSwitcher.addEventListener(
"change",
() => {

  const selectedLanguage =
    languageSwitcher.value;

  console.log(
    "Language Changed:",
    selectedLanguage
  );

}

);

}

/* ========================================
SEARCH BAR
======================================== */

const searchBars = document.querySelectorAll(
".search-bar"
);

searchBars.forEach(search => {

search.addEventListener("input", () => {

console.log(
  "Searching:",
  search.value
);

});

});

/* ========================================
PROJECT CARDS
======================================== */

const projectButtons = document.querySelectorAll(
".project-card button"
);

projectButtons.forEach(button => {

button.addEventListener("click", () => {

window.location.href = "/editor";

});

});

/* ========================================
FUTURE THEME SYSTEM
======================================== */

let currentTheme = "dark";

function toggleTheme() {

if (currentTheme === "dark") {

document.body.classList.add(
  "light-theme"
);

currentTheme = "light";

} else {

document.body.classList.remove(
  "light-theme"
);

currentTheme = "dark";

}

}

console.log("Theme System Ready");

/* ========================================
FUTURE NOTIFICATIONS
======================================== */

function showNotification(message) {

console.log(
"Notification:",
message
);

}

/* ========================================
INITIALIZATION
======================================== */

window.addEventListener("load", () => {

console.log(
"Quavron Initialized Successfully"
);

});
