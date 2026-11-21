// ====== EDIT YOUR LETTER HERE ======
const LETTER = {
  to: "You",
  from: "Me",
  message:
`Okay, real talk.

I've been craving kwek kwek all week
and the only thing that would make it better
is eating it with you.

My treat. Sauce is on me.
Sweet, spicy, or both. We'll fight about it there.

See you soon!`
};
// ===================================
const ACCESS_CODE = "062326";   // the code needed to open the envelope
// ===================================

const $ = (id) => document.getElementById(id);
const env = $("env"), card = $("card"), stage = $("stage");
const yesBtn = $("yesBtn"), noBtn = $("noBtn");
let typingTimer = null;

$("letterTo").textContent = "Hey " + LETTER.to + ",";
$("letterSign").textContent = "- " + LETTER.from;

// 0) Log in with the secret code
const loginForm = $("loginForm"), codeInput = $("codeInput"), codeError = $("codeError");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (codeInput.value.trim() === ACCESS_CODE) {
    codeError.textContent = "";
    $("login").classList.add("hide");
    setTimeout(() => {
      $("login").style.display = "none";
      stage.classList.remove("locked");
      $("envOpen").focus();
    }, 500);
  } else {
    codeError.textContent = "Wrong code. Try again.";
    loginForm.classList.remove("shake");
    void loginForm.offsetWidth;   // restart the shake animation
    loginForm.classList.add("shake");
    codeInput.select();
  }
});
setTimeout(() => codeInput.focus(), 200);

// 1) Click the envelope: flap opens, card rises out, envelope fades away
function openEnvelope() {
  env.classList.add("open");
  $("hint").classList.add("hide");
  setTimeout(() => env.classList.add("rise"), 450);
  setTimeout(() => env.classList.add("out"), 1500);
}
$("envOpen").addEventListener("click", openEnvelope);

// 2) "No" disappears, only "Yes" stays, and "no choice ka" shows under the buttons
noBtn.addEventListener("click", () => {
  $("noChoice").textContent = "no choice ka";
  $("noChoice").classList.add("show");
  noBtn.classList.add("gone");
  yesBtn.classList.add("big");
  setTimeout(() => noBtn.remove(), 450);
  yesBtn.focus();
});

// 3) "Yes" -> HELL YEAHHH + confetti -> letter pops out
function confetti(count = 40) {
  const icons = ["🍢", "🎉", "💙", "🐾", "✨"];
  for (let i = 0; i < count; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = icons[Math.floor(Math.random() * icons.length)];
    c.style.left = Math.random() * 100 + "vw";
    c.style.animationDuration = 2.5 + Math.random() * 3 + "s";
    c.style.animationDelay = Math.random() * 1.4 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 8000);
  }
}

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

yesBtn.addEventListener("click", () => {
  yesBtn.disabled = true;
  card.classList.add("leave");
  const cheer = $("cheer");
  setTimeout(() => {
    stage.classList.add("done");
    cheer.classList.add("show");
    cheer.setAttribute("aria-hidden", "false");
    confetti();
  }, 350);

  // after the cheer, the letter pops out
  setTimeout(() => {
    cheer.classList.add("fade");
    const wrap = $("letterWrap");
    wrap.classList.add("show");
    wrap.setAttribute("aria-hidden", "false");
    typeText(LETTER.message);
  }, 2800);
});

// Start over
$("againBtn").addEventListener("click", () => location.reload());
