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

/* ---------- 0) Log in with the numpad ---------- */
let entered = "";
const dots = document.querySelectorAll("#dots .dot");
const codeError = $("codeError");
let loginOpen = true;

function renderDots() {
  dots.forEach((d, i) => d.classList.toggle("on", i < entered.length));
}

function submitCode() {
  if (entered.length < ACCESS_CODE.length) {
    codeError.textContent = "Enter all 6 digits.";
    return;
  }
  if (entered === ACCESS_CODE) {
    codeError.textContent = "";
    loginOpen = false;
    $("login").classList.add("hide");
    setTimeout(() => {
      $("login").style.display = "none";
      stage.classList.remove("locked");
      $("envOpen").focus();
    }, 500);
  } else {
    codeError.textContent = "Wrong code. Try again.";
    const panel = $("loginPanel");
    panel.classList.remove("shake");
    void panel.offsetWidth;          // restart the shake animation
    panel.classList.add("shake");
    entered = "";
    renderDots();
  }
}

function pressKey(k) {
  if (!loginOpen) return;
  if (k === "back") {
    entered = entered.slice(0, -1);
    codeError.textContent = "";
  } else if (k === "ok") {
    submitCode();
    return;
  } else if (entered.length < ACCESS_CODE.length) {
    entered += k;
    codeError.textContent = "";
  }
  renderDots();
  if (entered.length === ACCESS_CODE.length) setTimeout(submitCode, 150);
}

$("numpad").addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (btn) pressKey(btn.dataset.key);
});
// Keyboard support too
document.addEventListener("keydown", (e) => {
  if (!loginOpen) return;
  if (/^[0-9]$/.test(e.key)) pressKey(e.key);
  else if (e.key === "Backspace") pressKey("back");
  else if (e.key === "Enter") pressKey("ok");
});

/* ---------- 1) Click the envelope ---------- */
function openEnvelope() {
  env.classList.add("open");
  $("hint").classList.add("hide");
  setTimeout(() => env.classList.add("rise"), 450);
  setTimeout(() => env.classList.add("out"), 1500);
}
$("envOpen").addEventListener("click", openEnvelope);

/* ---------- 2) "No" disappears, "no choice ka" appears ---------- */
noBtn.addEventListener("click", () => {
  $("noChoice").textContent = "no choice ka";
  $("noChoice").classList.add("show");
  noBtn.classList.add("gone");
  yesBtn.classList.add("big");
  setTimeout(() => noBtn.remove(), 450);
  yesBtn.focus();
});

/* ---------- helpers ---------- */
function confetti(count = 40, icons = ["🍢", "🎉", "💙", "🐾", "✨"]) {
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
  const body = $("letterBody"), sign = $("letterSign"), next = $("nextBtn");
  clearInterval(typingTimer);
  body.textContent = "";
  body.classList.remove("done");
  sign.classList.remove("visible");
  next.classList.remove("visible");
  let i = 0;
  typingTimer = setInterval(() => {
    body.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(typingTimer);
      body.classList.add("done");
      sign.classList.add("visible");
      next.classList.add("visible");
    }
  }, 35);
}

/* ---------- 3) Yes -> HELL YEAHHH -> blue bouquet + closed letter ---------- */
const scene = $("bouquetScene");
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

  setTimeout(() => {
    cheer.classList.add("fade");
    scene.hidden = false;
    void scene.offsetWidth;
    scene.classList.add("show");
    setTimeout(() => $("mail").focus(), 1900);
  }, 2800);
});

/* ---------- 4) Click the letter to open it ---------- */
$("mail").addEventListener("click", () => {
  scene.classList.add("leave");
  setTimeout(() => {
    scene.hidden = true;
    const wrap = $("letterWrap");
    wrap.classList.add("show");
    wrap.setAttribute("aria-hidden", "false");
    typeText(LETTER.message);
  }, 500);
});

/* ---------- 5) Next -> Choose a date ---------- */
let chosenDate = "", chosenEmoji = "";
$("nextBtn").addEventListener("click", () => {
  clearInterval(typingTimer);
  const wrap = $("letterWrap");
  wrap.classList.remove("show");
  wrap.classList.add("leave");
  setTimeout(() => {
    wrap.style.display = "none";
    $("datePage").hidden = false;
  }, 450);
});

const opts = document.querySelectorAll(".opt");
opts.forEach((o) => {
  o.addEventListener("click", () => {
    opts.forEach((x) => x.setAttribute("aria-pressed", "false"));
    o.setAttribute("aria-pressed", "true");
    chosenDate = o.dataset.date;
    chosenEmoji = o.dataset.emoji;
    $("confirmBtn").disabled = false;
  });
});

/* ---------- 6) Confirm -> Date confirmed ---------- */
$("confirmBtn").addEventListener("click", () => {
  if (!chosenDate) return;
  $("datePage").hidden = true;
  $("chosen").textContent = chosenEmoji + " " + chosenDate;
  $("confirmPage").hidden = false;
  confetti(50, ["💙", "🎉", "✨", "🌸", chosenEmoji]);
});
