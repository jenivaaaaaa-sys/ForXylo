// ====== EDIT YOUR LETTER HERE ======
const LETTER = {
  secretName: "llyod",   // the only name that opens the letter (not case-sensitive)
  to: "Llyod",           // how the name is displayed on the letter
  from: "Juan",          // your name, shown as the sender
  message:
`Every sunflower turns toward the light.
I just happen to turn toward you.

Thank you for the quiet mornings, the loud laughs,
and for making ordinary days feel like a field in bloom.

I hope this letter makes you smile, even a little.`
};
// ===================================

const $ = (id) => document.getElementById(id);
const nameScreen = $("nameScreen"), cover = $("cover"), seal = $("seal"), wrap = $("letterWrap");
let typingTimer = null;

// Fill in the text
$("recipient").textContent = LETTER.to;
$("sender").textContent = "with love, " + LETTER.from;
$("letterTo").textContent = "Dear " + LETTER.to + ",";
$("letterSign").textContent = "With love, " + LETTER.from;

// Step 1: check the name
const form = $("nameForm"), input = $("nameInput"), error = $("nameError");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const typed = input.value.trim().toLowerCase();
  if (typed === LETTER.secretName.toLowerCase()) {
    error.textContent = "";
    nameScreen.classList.add("hide");
    nameScreen.setAttribute("aria-hidden", "true");
    cover.classList.remove("hide");
    cover.setAttribute("aria-hidden", "false");
    setTimeout(() => seal.focus(), 300);
  } else {
    error.textContent = "That's not the right name. Try again.";
    form.classList.remove("shake");
    void form.offsetWidth;            // restart the shake animation
    form.classList.add("shake");
    input.select();
  }
});
setTimeout(() => input.focus(), 200);

// Twinkling stars
const starBox = document.querySelector(".stars");
for (let i = 0; i < 70; i++) {
  const s = document.createElement("span");
  s.className = "star";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 60 + "%";
  s.style.animationDelay = Math.random() * 3 + "s";
  starBox.appendChild(s);
}

// Falling petals
function petals(count = 24) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = 3 + Math.random() * 3 + "s";
    p.style.animationDelay = Math.random() * 1.2 + "s";
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 8000);
  }
}

// Typewriter effect
function typeText(text) {
  const body = $("letterBody"), sign = $("letterSign");
  clearInterval(typingTimer);
  body.textContent = "";
  sign.classList.remove("visible");
  let i = 0;
  typingTimer = setInterval(() => {
    body.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(typingTimer);
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
