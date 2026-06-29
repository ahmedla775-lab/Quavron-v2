console.log("🚀 Quavron Loaded Successfully");

/* ========================================
Navbar Active State
======================================== */

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(link => {

link.addEventListener("click", () => {

navLinks.forEach(item => {
  item.classList.remove("active");
});

link.classList.add("active");

});

});

/* ========================================
Simple Welcome Notification
======================================== */

window.addEventListener("load", () => {

console.log("Welcome To Quavron");

});

/* ========================================
Future Language System Placeholder
======================================== */

const supportedLanguages = [
"ar",
"en",
"fr",
"es",
"ru",
"zh",
"it",
"de"
];

console.log("Supported Languages:", supportedLanguages);

/* ========================================
Future Theme System Placeholder
======================================== */

let currentTheme = "dark";

function toggleTheme() {

if (currentTheme === "dark") {

document.body.classList.add("light-theme");

currentTheme = "light";

} else {

document.body.classList.remove("light-theme");

currentTheme = "dark";

}

}

console.log("Theme System Ready");

/* ========================================
Future Authentication Placeholder
======================================== */

function checkAuth() {

console.log("Authentication System Ready");

}

checkAuth();
