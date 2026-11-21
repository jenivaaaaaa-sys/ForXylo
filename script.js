// ====== EDIT YOUR LETTER HERE ======
const LETTER = {
  from: "Jeniva",   // your name, shown as the sender (the visitor types their own name)
  message:
`Happiness is a warm blanket, a quiet afternoon,
and getting to share both with you.

Thank you for the little moments, the big laughs,
and for making every ordinary day feel like a good one.

I hope this letter makes you smile, even a little.`
};
// ===================================

const $ = (id) => document.getElementById(id);
const cover = $("cover"), seal = $("seal"), wrap = $("letterWrap");
let typingTimer = null;

// Sender text
$("sender").textContent = "with love, " + LETTER.from;
$("letterSign").textContent = "With love, " + LETTER.from;

// Step 1: ask for the visitor's name, then show the cover
const nameScreen = $("nameScreen");
$("nameForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("nameInput").value.trim();
  if (!name) return;
  $("recipient").textContent = name;
  $("letterTo").textContent = "Dear " + name + ",";
  nameScreen.classList.add("hide");
  nameScreen.setAttribute("aria-hidden", "true");
  cover.classList.remove("hide");
  cover.setAttribute("aria-hidden", "false");
  setTimeout(() => seal.focus(), 300);
});
setTimeout(() => $("nameInput").focus(), 200);

// Falling hearts and bones
function petals(count = 22) {
  const icons = ["💙", "🦴", "💙", "🐾"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "heart";
    p.textContent = icons[Math.floor(Math.random() * icons.length)];
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 3 + Math.random() * 3 + "s";
    p.style.animationDelay = Math.random() * 1.2 + "s";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 8000);
  }
}

// Typewriter effect
function typeText(text) {
  const body = $("letterBody"), sign = $("letterSign");
  clearInterval(typingTimer);
  body.textContent = "";
  body.classList.remove("done");
  sign.classList.remove("visible");
  let i = 0;
  typingTimer = setInterval(() => {
    body.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(typingTimer);
      body.classList.add("done");
      sign.classList.add("visible");
    }
  }, 35);
}

function openLetter() {
  seal.classList.add("cracked");
  petals();
  setTimeout(() => {
    cover.classList.add("hide");
    wrap.classList.add("show");
    wrap.setAttribute("aria-hidden", "false");
    typeText(LETTER.message);
  }, 450);
}

function closeLetter() {
  wrap.classList.remove("show");
  wrap.setAttribute("aria-hidden", "true");
  cover.classList.remove("hide");
  seal.classList.remove("cracked");
  clearInterval(typingTimer);
}

seal.addEventListener("click", openLetter);
$("openBtn").addEventListener("click", openLetter);
$("closeBtn").addEventListener("click", closeLetter);