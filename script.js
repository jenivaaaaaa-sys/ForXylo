// ====== EDIT YOUR LETTER HERE ======
const LETTER = {
  to: "myOneandOnly",
  from: "Jenibabes",
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
  dots.forEach((d, i) => { d.textContent = entered[i] || ""; });
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
  setTimeout(() => { env.classList.add("out"); centerCard(); }, 1500);
}

// Lift the card out of the envelope and glide it to the exact middle of the window
function centerCard() {
  const r = card.getBoundingClientRect();
  env.style.perspective = "none";              // so "fixed" is measured from the window
  card.style.transition = "none";
  card.style.position = "fixed";
  card.style.left = r.left + "px";
  card.style.top = r.top + "px";
  card.style.width = r.width + "px";
  card.style.height = r.height + "px";
  card.style.transform = "none";
  void card.offsetWidth;                       // apply the starting spot first
  const ease = "cubic-bezier(.2,.9,.3,1.1)";
  card.style.transition = "left .8s " + ease + ", top .8s " + ease + ", transform .8s " + ease + ", opacity .4s ease";
  card.dataset.w = r.width; card.dataset.h = r.height;
  placeCard();
  card.style.transform = "scale(1.22)";
}
function placeCard() {
  card.style.left = (window.innerWidth  - card.dataset.w) / 2 + "px";
  card.style.top  = (window.innerHeight - card.dataset.h) / 2 + "px";
}
window.addEventListener("resize", () => { if (card.dataset.w) placeCard(); });
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
// Split "HELL YEAHHH" into letters so they can pop in one by one
(function () {
  const h2 = document.querySelector("#cheer h2");
  const text = h2.textContent.trim();
  h2.setAttribute("aria-label", text);
  let i = 0;
  h2.innerHTML = text.split(" ").map((word) =>
    '<span class="w" aria-hidden="true">' +
    [...word].map((ch) => '<span class="l" style="--i:' + (i++) + '">' + ch + "</span>").join("") +
    "</span>"
  ).join(" ");
})();

/* ---------- Fireworks (canvas) ---------- */
const fx = { canvas: $("fx"), parts: [], rockets: [], raf: null, running: false, timers: [], w: 0, h: 0 };
fx.ctx = fx.canvas.getContext("2d");
const FW_COLORS = ["#8fd0ff", "#ffffff", "#ffb3d1", "#ffe27a", "#b4c0ff", "#7fe3ff"];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function fxResize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  fx.w = window.innerWidth; fx.h = window.innerHeight;
  fx.canvas.width = fx.w * dpr; fx.canvas.height = fx.h * dpr;
  fx.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", fxResize);
fxResize();

function launchRocket() {
  const targetY = fx.h * (0.14 + Math.random() * 0.3);
  fx.rockets.push({
    x: fx.w * (0.12 + Math.random() * 0.76), y: fx.h + 10, targetY,
    vy: -(fx.h * 0.011 + Math.random() * 2),
    color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)]
  });
}

function explode(x, y, color) {
  const heart = Math.random() < 0.4;
  const n = heart ? 70 : 90;
  const second = FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)];
  for (let i = 0; i < n; i++) {
    let vx, vy;
    if (heart) {                                   // heart-shaped burst
      const t = (i / n) * Math.PI * 2, k = 0.33 + Math.random() * 0.03;
      vx = 16 * Math.pow(Math.sin(t), 3) * k;
      vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * k;
    } else {                                       // round burst
      const a = Math.random() * Math.PI * 2, sp = 1 + Math.random() * 5.5;
      vx = Math.cos(a) * sp; vy = Math.sin(a) * sp;
    }
    fx.parts.push({
      x, y, vx, vy, life: 1, decay: 0.010 + Math.random() * 0.010,
      color: heart ? "#ff9fc4" : (i % 3 ? color : second), size: 1.8 + Math.random() * 1.6
    });
  }
}

function fxLoop() {
  if (!fx.running) return;
  const c = fx.ctx;
  // fade the old frame so every spark leaves a soft trail
  c.globalCompositeOperation = "destination-out";
  c.fillStyle = "rgba(0,0,0,0.22)";
  c.fillRect(0, 0, fx.w, fx.h);
  c.globalCompositeOperation = "lighter";

  fx.rockets = fx.rockets.filter((r) => {
    r.y += r.vy;
    c.globalAlpha = 1; c.fillStyle = "#fff";
    c.beginPath(); c.arc(r.x, r.y, 2.2, 0, 7); c.fill();
    fx.parts.push({ x: r.x, y: r.y, vx: (Math.random() - .5) * .6, vy: Math.random() * .8, life: .6, decay: .05, color: r.color, size: 1.3 });
    if (r.y <= r.targetY) { explode(r.x, r.y, r.color); return false; }
    return true;
  });

  fx.parts = fx.parts.filter((p) => {
    p.vx *= 0.968; p.vy = p.vy * 0.968 + 0.035;
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    if (p.life <= 0) return false;
    c.globalAlpha = Math.max(p.life, 0);
    c.fillStyle = p.color;
    c.beginPath(); c.arc(p.x, p.y, p.size, 0, 7); c.fill();
    return true;
  });
  fx.raf = requestAnimationFrame(fxLoop);
}

function startFireworks() {
  if (reduceMotion) return;
  fxResize();
  fx.running = true;
  fx.raf = requestAnimationFrame(fxLoop);
  [0, 200, 650, 1000, 1350, 1750, 2150, 2500, 2850].forEach((t) => {
    fx.timers.push(setTimeout(() => { launchRocket(); if (Math.random() < .5) launchRocket(); }, t));
  });
}
function stopFireworks() {
  fx.running = false;
  cancelAnimationFrame(fx.raf);
  fx.timers.forEach(clearTimeout); fx.timers = [];
  fx.parts = []; fx.rockets = [];
  fx.ctx.clearRect(0, 0, fx.w, fx.h);
}

/* ---------- Petals ---------- */
function fallPetals(count = 36) {
  const cols = ["#ffd6e7", "#ffb3d1", "#cfe9ff", "#a9d9ff", "#ffffff", "#e8f3ff"];
  for (let i = 0; i < count; i++) {
    const wrap = document.createElement("span");
    wrap.className = "petal-fall";
    wrap.style.left = Math.random() * 100 + "vw";
    wrap.style.animationDuration = 5 + Math.random() * 4 + "s";
    wrap.style.animationDelay = Math.random() * 2.5 + "s";
    const p = document.createElement("span");
    p.className = "petal";
    const size = 10 + Math.random() * 10;
    p.style.width = size + "px"; p.style.height = size * 1.35 + "px";
    p.style.background = "linear-gradient(135deg," + cols[Math.floor(Math.random() * cols.length)] + ",#fff)";
    p.style.animationDuration = 2 + Math.random() * 2 + "s";
    wrap.appendChild(p);
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 12000);
  }
}

// Everything that happens on the "HELL YEAHHH" page
function celebrate() {
  startFireworks();
  fallPetals();
  floatHearts(26);
}

// Soft hearts floating upward
function floatHearts(count = 28) {
  const icons = ["💙", "🩷", "🤍", "💗", "✨", "💙"];
  for (let i = 0; i < count; i++) {
    const h = document.createElement("span");
    h.className = "rise";
    h.textContent = icons[Math.floor(Math.random() * icons.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 18 + Math.random() * 20 + "px";
    h.style.animationDuration = 4 + Math.random() * 3 + "s";
    h.style.animationDelay = Math.random() * 2 + "s";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 10000);
  }
}

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
  const holder = $("letterHolder");
  holder.classList.remove("decor");
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
      holder.classList.add("decor");      // stickers pop in around the letter
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
    celebrate();
  }, 350);

  setTimeout(stopFireworks, 4900);
  setTimeout(() => {
    cheer.classList.add("fade");
    scene.hidden = false;
    void scene.offsetWidth;
    scene.classList.add("show");
    setTimeout(() => $("mail").focus(), 1900);
  }, 3900);
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
