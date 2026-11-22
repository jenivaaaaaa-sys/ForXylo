// ====== EDIT YOUR LETTER HERE ======
// Each item in "pages" is one page of the letter (the letter turns the page when it has more than one).
const LETTER = {
  to: "",      // leave empty if your message already starts with a greeting
  from: "",    // leave empty if your message already ends with a sign-off
  pages: [
`Hello, my baby!
Happy monthsarry!!! Baby, alam ko na ang dami nang nangyayari sa'tin these past few days, and I hope na malagpasan natin 'tooo kasi looking forward ako sa futureee. Future with youuuuuuu! Sana ma-fix natin ang mga upcoming problems and walang hiwalayan kasi I've been through so muchh pain, and nakaya ko siya because of youu and sa mga naturo mo sa'kin.

I'm so happy to have youu, and sana huwag ito matapos kasi naniniwala ako na makakaya natin 'tong lahat kasi strong na tayo. Hindi na tayo katulad ng datiii. I love you, baby kooooooo!
HAPPY MONTHSARRYYY!!! Hihi, date tau!!`,
`Thank you, thank youu sa mga pagsagot sa'kin sa pagkain at sa ibang bagayyy. So much appreciated, and babawi ako sa'yo, baby. Wait mo lang!! Alam mo 'yan, mahal na mahal kita at wala akong ipagdadamot sa'yo. Hihihiii! Love u so much talaga, ganda! 💗`
  ]
};
// ===================================
const ACCESS_CODE = "062326";   // the code needed to open the envelope
// ===================================

const $ = (id) => document.getElementById(id);
const env = $("env"), card = $("card"), stage = $("stage");
const yesBtn = $("yesBtn"), noBtn = $("noBtn");
let typingTimer = null;

$("letterTo").textContent = LETTER.to ? "Hey " + LETTER.to + "," : "";
$("letterSign").textContent = LETTER.from ? "- " + LETTER.from : "";

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
let glideDx = 0, glideDy = 0, glided = false;

function openEnvelope() {
  if (env.classList.contains("open")) return;
  // let the wobble settle smoothly instead of snapping to a stop
  const now = getComputedStyle(env).transform;
  env.style.animation = "none";
  env.style.transform = now;
  void env.offsetWidth;
  env.style.transition = "transform .6s cubic-bezier(.3,.7,.2,1), filter .6s ease";
  env.style.transform = "none";

  env.classList.add("open");
  $("hint").classList.add("hide");
  setTimeout(() => env.classList.add("rise"), 500);                        // card slides up out of the envelope
  setTimeout(() => { env.classList.add("out"); glideCard(true); }, 1350);  // then floats to the middle as the envelope drops away
}

// Move the card (with a transform only, no jumps) to the exact middle of the window
function glideCard(animate) {
  const er = env.getBoundingClientRect();
  const cx = er.left + card.offsetLeft + card.offsetWidth / 2;
  const cy = er.top + card.offsetTop + card.offsetHeight / 2;
  glideDx = window.innerWidth / 2 - cx;
  glideDy = window.innerHeight / 2 - cy;
  glided = true;
  card.style.transition = animate
    ? "transform 1.1s cubic-bezier(.3,.7,.2,1), opacity .4s ease"
    : "none";
  card.style.transform = "translate(" + glideDx + "px, " + glideDy + "px) scale(1.22)";
  if (!animate) { void card.offsetWidth; card.style.transition = "transform 1.1s cubic-bezier(.3,.7,.2,1), opacity .4s ease"; }
}
window.addEventListener("resize", () => { if (glided) glideCard(false); });
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
  [0, 200, 650, 1000, 1350, 1750, 2150, 2500, 2850, 3250, 3650].forEach((t) => {
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

// Types one page of the letter. Tap the paper while it types to show the whole page at once.
let pageIndex = 0;
function typeText(text, onDone) {
  const body = $("letterBody");
  clearInterval(typingTimer);
  body.textContent = "";
  body.classList.remove("done", "turning");
  let i = 0;
  const finish = () => {
    clearInterval(typingTimer);
    body.textContent = text;
    body.classList.add("done");
    body.onclick = null;
    onDone();
  };
  body.onclick = finish;
  typingTimer = setInterval(() => {
    i += 2;                                   // two characters per tick keeps long letters quick
    body.textContent = text.slice(0, i);
    if (i >= text.length) finish();
  }, 22);
}

function showPage(n) {
  pageIndex = n;
  const holder = $("letterHolder"), pageBtn = $("pageBtn"), nextBtn = $("nextBtn"), sign = $("letterSign");
  const last = n >= LETTER.pages.length - 1;
  pageBtn.hidden = true; pageBtn.classList.remove("visible");
  nextBtn.hidden = true; nextBtn.classList.remove("visible");
  sign.classList.remove("visible");
  if (n === 0) holder.classList.remove("decor");
  typeText(LETTER.pages[n], () => {
    holder.classList.add("decor");            // stickers and photos pop in around the letter
    if (last) {
      sign.classList.add("visible");
      nextBtn.hidden = false; void nextBtn.offsetWidth; nextBtn.classList.add("visible");
    } else {
      pageBtn.hidden = false; void pageBtn.offsetWidth; pageBtn.classList.add("visible");
    }
  });
}

$("pageBtn").addEventListener("click", () => {
  const body = $("letterBody");
  $("pageBtn").hidden = true;
  body.classList.add("turning");              // fade the old page, then write the next one
  setTimeout(() => showPage(pageIndex + 1), 320);
});

/* ---------- 3) Yes -> HELL YEAHHH -> blue bouquet + closed letter ---------- */
const scene = $("bouquetScene");
yesBtn.addEventListener("click", () => {
  yesBtn.disabled = true;
  card.style.transition = "transform .5s ease-in, opacity .4s ease";
  card.style.transform = "translate(" + glideDx + "px, " + glideDy + "px) scale(0) rotate(14deg)";
  card.classList.add("leave");
  const cheer = $("cheer");
  setTimeout(() => {
    stage.classList.add("done");
    cheer.classList.add("show");
    cheer.setAttribute("aria-hidden", "false");
    celebrate();
  }, 350);

  setTimeout(stopFireworks, 5900);
  setTimeout(() => {
    cheer.classList.add("fade");
    scene.hidden = false;
    void scene.offsetWidth;
    scene.classList.add("show");
    setTimeout(() => $("mail").focus(), 1900);
  }, 4900);
});

/* ---------- 4) Click the letter to open it ---------- */
$("mail").addEventListener("click", () => {
  scene.classList.add("leave");
  setTimeout(() => {
    scene.hidden = true;
    const wrap = $("letterWrap");
    wrap.classList.add("show");
    wrap.setAttribute("aria-hidden", "false");
    showPage(0);
  }, 500);
});

/* ---------- 5) Next -> Choose a date ---------- */
let chosenDate = "", chosenEmoji = "", chosenCard = null;
$("nextBtn").addEventListener("click", () => {
  clearInterval(typingTimer);
  const wrap = $("letterWrap");
  wrap.classList.remove("show");
  wrap.classList.add("leave");
  setTimeout(() => {
    wrap.style.display = "none";
    $("datePage").hidden = false;
    bgHearts($("datePage"), 16);
  }, 450);
});

const opts = document.querySelectorAll(".date-card");
opts.forEach((o) => {
  o.addEventListener("click", () => {
    opts.forEach((x) => x.setAttribute("aria-checked", "false"));
    o.setAttribute("aria-checked", "true");
    chosenDate = o.dataset.date;
    chosenEmoji = o.dataset.emoji;
    chosenCard = o;
    $("confirmBtn").disabled = false;
  });
});

// a few soft hearts drifting behind the cards
function bgHearts(page = $("datePage"), n = 16) {
  const icons = ["💙", "🩵", "🤍", "💗"];
  for (let i = 0; i < n; i++) {
    const h = document.createElement("span");
    h.className = "bgh";
    h.textContent = icons[Math.floor(Math.random() * icons.length)];
    h.style.left = Math.random() * 100 + "%";
    h.style.fontSize = 12 + Math.random() * 16 + "px";
    h.style.animationDuration = 9 + Math.random() * 8 + "s";
    h.style.animationDelay = -Math.random() * 12 + "s";
    page.appendChild(h);
  }
}

/* ---------- 6) Confirm -> Date confirmed ---------- */
$("confirmBtn").addEventListener("click", () => {
  if (!chosenDate || !chosenCard) return;
  // show the picture of the date they picked on the ticket
  let art = chosenCard.querySelector(".date-img").innerHTML;
  art = art.replace(/id="glass"/g, 'id="glass2"').replace(/#glass"/g, '#glass2"');   // avoid duplicate ids
  $("ticketImg").innerHTML = art;
  $("chosen").textContent = chosenCard.querySelector(".date-name").textContent;
  $("datePage").hidden = true;
  const page = $("confirmPage");
  page.hidden = false;
  $("saveStatus").textContent = "";
  bgHearts(page, 22);
  fallPetals(34);
  floatHearts(18);
  playChime();
});


/* ---------- Sweet little chime (made with Web Audio, no sound file needed) ---------- */
let soundOn = true, audioCtx = null, master = null;

function getAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function tone(freq, start, dur, vol, type) {
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = type || "sine";
  o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g); g.connect(master);
  o.start(start); o.stop(start + dur + 0.05);
}

function playChime() {
  if (!soundOn) return;
  const ctx = getAudio();
  if (!ctx) return;
  master = ctx.createGain();
  master.gain.value = 0.28;
  master.connect(ctx.destination);
  const t = ctx.currentTime + 0.02;
  // rising bell notes: C6 E6 G6 C7
  [[1046.5, 0], [1318.5, 0.11], [1568, 0.22], [2093, 0.33]].forEach(([f, d]) => {
    tone(f, t + d, 1.3, 0.5, "triangle");
    tone(f * 2, t + d, 0.5, 0.08, "sine");
  });
  // warm chord underneath
  [523.25, 659.25, 783.99].forEach((f) => tone(f, t + 0.05, 1.8, 0.18, "sine"));
  // little sparkles on top
  [2637, 3136, 3520].forEach((f, i) => tone(f, t + 0.55 + i * 0.12, 0.5, 0.07, "sine"));
}

$("soundBtn").addEventListener("click", () => {
  soundOn = !soundOn;
  $("soundBtn").innerHTML = soundOn ? "&#128266;" : "&#128263;";
  $("soundBtn").setAttribute("aria-label", soundOn ? "Sound on" : "Sound off");
  if (soundOn) playChime();
});

/* ---------- Save this date as a picture ---------- */
function heartPath(g, x, y, s) {            // heart with its top-centre at (x, y) and height s
  g.beginPath();
  g.moveTo(x, y + s * 0.35);
  g.bezierCurveTo(x, y - s * 0.1, x - s * 0.55, y - s * 0.1, x - s * 0.55, y + s * 0.28);
  g.bezierCurveTo(x - s * 0.55, y + s * 0.62, x, y + s * 0.8, x, y + s);
  g.bezierCurveTo(x, y + s * 0.8, x + s * 0.55, y + s * 0.62, x + s * 0.55, y + s * 0.28);
  g.bezierCurveTo(x + s * 0.55, y - s * 0.1, x, y - s * 0.1, x, y + s * 0.35);
  g.closePath();
}
function roundRectPath(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);         g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
function spacedText(g, text, cx, y, gap) {  // centred text with extra space between letters
  const widths = [...text].map((ch) => g.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + gap * (text.length - 1);
  let x = cx - total / 2;
  [...text].forEach((ch, i) => { g.fillText(ch, x, y); x += widths[i] + gap; });
}
function loadSvg(markup) {
  return new Promise((resolve, reject) => {
    const svg = markup.replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="570" ');
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}

async function buildDateImage() {
  const W = 1080, H = 1440;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d");
  try {
    await Promise.all([document.fonts.load('700 100px "Playfair Display"'), document.fonts.load('600 40px "Fredoka"')]);
  } catch (e) { /* fall back to system fonts */ }
  const serif = '"Playfair Display", Georgia, serif', sans = '"Fredoka", "Trebuchet MS", sans-serif';

  // soft sky
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#eaf3ff"); bg.addColorStop(0.55, "#d3e5ff"); bg.addColorStop(1, "#ffe3ee");
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W / 2, -100, 0, W / 2, -100, 900);
  glow.addColorStop(0, "rgba(255,255,255,.95)"); glow.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = glow; g.fillRect(0, 0, W, H);

  // little hearts scattered around
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 30; i++) {
    g.fillStyle = i % 3 === 0 ? "rgba(255,143,184,.28)" : "rgba(79,140,240,.2)";
    heartPath(g, rnd() * W, rnd() * H, 16 + rnd() * 30);
    g.fill();
  }

  // glowing heart badge
  const cx = W / 2, cy = 215;
  g.fillStyle = "rgba(79,140,240,.08)"; g.beginPath(); g.arc(cx, cy, 138, 0, 7); g.fill();
  g.fillStyle = "rgba(79,140,240,.16)"; g.beginPath(); g.arc(cx, cy, 118, 0, 7); g.fill();
  const bd = g.createLinearGradient(cx - 95, cy - 95, cx + 95, cy + 95);
  bd.addColorStop(0, "#9bc9ff"); bd.addColorStop(1, "#4f8cf0");
  g.save(); g.shadowColor = "rgba(63,120,224,.45)"; g.shadowBlur = 36; g.shadowOffsetY = 12;
  g.fillStyle = bd; g.beginPath(); g.arc(cx, cy, 96, 0, 7); g.fill(); g.restore();
  g.fillStyle = "#fff"; heartPath(g, cx, cy - 44, 88); g.fill();

  // words
  g.textBaseline = "alphabetic"; g.fillStyle = "#6b8cc8"; g.font = "600 34px " + sans;
  spacedText(g, "IT'S OFFICIAL", cx, 405, 9);

  let size = 124;
  g.font = "700 " + size + "px " + serif;
  while (g.measureText("Date Confirmed").width > 900 && size > 60) { size -= 4; g.font = "700 " + size + "px " + serif; }
  const tw = g.measureText("Date Confirmed").width;
  const tg = g.createLinearGradient(cx - tw / 2, 0, cx + tw / 2, 0);
  tg.addColorStop(0, "#2f5fd0"); tg.addColorStop(0.55, "#7a6cf0"); tg.addColorStop(1, "#ff8fb8");
  g.fillStyle = tg; g.textAlign = "center";
  g.fillText("Date Confirmed", cx, 540);

  // ticket with the picture of the chosen date
  const tx = (W - 760) / 2, ty = 640, tW = 760, imgH = Math.round(760 * 190 / 300), bodyH = 170, tH = imgH + bodyH;
  g.save();
  g.translate(cx, ty + tH / 2); g.rotate(-0.026); g.translate(-cx, -(ty + tH / 2));
  g.shadowColor = "rgba(60,110,200,.32)"; g.shadowBlur = 50; g.shadowOffsetY = 22;
  g.fillStyle = "#fff"; roundRectPath(g, tx, ty, tW, tH, 44); g.fill();
  g.shadowColor = "transparent";
  g.save(); roundRectPath(g, tx, ty, tW, tH, 44); g.clip();
  try { g.drawImage(await loadSvg($("ticketImg").innerHTML), tx, ty, tW, imgH); }
  catch (e) { g.fillStyle = "#cfe5ff"; g.fillRect(tx, ty, tW, imgH); }
  g.strokeStyle = "#bcd3f5"; g.lineWidth = 4; g.setLineDash([16, 12]);
  g.beginPath(); g.moveTo(tx + 20, ty + imgH + 2); g.lineTo(tx + tW - 20, ty + imgH + 2); g.stroke(); g.setLineDash([]);
  g.fillStyle = "#dbe9ff";
  g.beginPath(); g.arc(tx, ty + imgH + 2, 24, 0, 7); g.fill();
  g.beginPath(); g.arc(tx + tW, ty + imgH + 2, 24, 0, 7); g.fill();
  g.restore();
  g.textAlign = "left";
  g.fillStyle = "#7b90b8"; g.font = "600 26px " + sans;
  let lx = tx + 44; const label = "OUR DATE";
  for (const ch of label) { g.fillText(ch, lx, ty + imgH + 62); lx += g.measureText(ch).width + 6; }
  g.fillStyle = "#1b3a8a"; g.font = "700 58px " + serif;
  g.fillText($("chosen").textContent, tx + 44, ty + imgH + 128);
  g.restore();

  // sweet note and date
  g.textAlign = "center"; g.fillStyle = "#4a6fb5"; g.font = "600 46px " + sans;
  g.fillText("I can't wait, baby \u{1F499}", cx, 1370);
  g.fillStyle = "#8aa3d3"; g.font = "400 28px " + sans;
  g.fillText("Saved on " + new Date().toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }), cx, 1414);
  return cv;
}

$("saveBtn").addEventListener("click", async () => {
  const btn = $("saveBtn"), status = $("saveStatus");
  btn.disabled = true; status.textContent = "Making your picture...";
  try {
    const cv = await buildDateImage();
    const blob = await new Promise((res) => cv.toBlob(res, "image/png"));
    const file = new File([blob], "our-date.png", { type: "image/png" });
    // phones: open the share sheet so it can go straight to Photos / Messenger
    if (window.matchMedia("(pointer: coarse)").matches && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "Our date" }); status.textContent = "Saved! \u{1F499}"; return; }
      catch (err) { if (err && err.name === "AbortError") { status.textContent = ""; return; } }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "our-date.png";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    status.textContent = "Saved to your downloads \u{1F499}";
  } catch (err) {
    status.textContent = "Oops, I couldn't save it. Try taking a screenshot instead.";
  } finally {
    btn.disabled = false;
  }
});
