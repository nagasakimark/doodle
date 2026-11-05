// Doodle Time! — draw the English word, DoodleNet (via ml5) tries to guess it.
// If it hasn't guessed within TIME_LIMIT seconds, the Japanese meaning is revealed.

const TIME_LIMIT = 20;      // seconds per word
const ROUNDS = 5;           // words per game
const TOP_K = 5;            // how many guesses to ask the model for
const WIN_TOP_N = 3;        // target counts if it is in the model's top N guesses...
const WIN_MIN_CONF = 0.10;  // ...with at least this confidence (top-1 always wins)
const CLASSIFY_EVERY_MS = 300;
const LINE_WIDTH = 8;          // pen width on screen (canvas is 560px internally)
// The model sees thicker copies of the drawing than the screen shows (a thin 28px thumbnail line vanishes).
// Thick pens merge close-together lines, thin pens lose strokes, so we ask at two pen widths and accept either.
const MODEL_LINE_WIDTHS = [24, 14];
const BASE_POINTS = 100, POINTS_PER_SECOND = 10;

const $ = (id) => document.getElementById(id);
const screens = ['start', 'game', 'result', 'end'];
// Japanese word with its reading above any kanji (students are in years 3-6)
const jaHTML = (w) => (w.fu ? `<ruby>${w.ja}<rt>${w.fu}</rt></ruby>` : w.ja);
function show(name) {
  screens.forEach((s) => $(s).classList.toggle('hidden', s !== name)); window.scrollTo(0, 0);
  $('help').classList.toggle('hidden', name === 'game' || name === 'result');   // don't open the tutorial mid-round
}
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- robot ----------
document.querySelectorAll('.robot-slot').forEach((slot) => slot.appendChild($('robotTpl').content.cloneNode(true)));
function mood(m) { document.querySelectorAll('.robot-slot').forEach((s) => { s.dataset.mood = m; }); }
function lookAt(clientX, clientY) {
  const slot = $('gameBot'); const r = slot.getBoundingClientRect();
  const dx = clientX - (r.left + r.width / 2), dy = clientY - (r.top + r.height / 2);
  const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 200) * 5;
  slot.querySelectorAll('.r-pupil').forEach((p) => { p.style.transform = `translate(${dx / d * k}px, ${dy / d * k}px)`; });
}
document.addEventListener('pointermove', (e) => { if (!$('game').classList.contains('hidden')) lookAt(e.clientX, e.clientY); });

// ---------- sound (WebAudio, no files) ----------
let audio = null, muted = false;
try { muted = localStorage.getItem('doodle-muted') === '1'; } catch (e) { /* storage optional */ }
$('mute').textContent = muted ? '🔇' : '🔊';
$('mute').onclick = () => {
  muted = !muted; $('mute').textContent = muted ? '🔇' : '🔊';
  try { localStorage.setItem('doodle-muted', muted ? '1' : '0'); } catch (e) { /* ignore */ }
  if (!muted) tone(660, 0.08, 'triangle');
};
function unlockAudio() {
  if (!audio) { try { audio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { /* no audio */ } }
  if (audio && audio.state === 'suspended') audio.resume();
}
function tone(freq, dur, type = 'square', delay = 0, vol = 0.12) {
  if (muted || !audio) return;
  const t = audio.currentTime + delay;
  const o = audio.createOscillator(), g = audio.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(audio.destination); o.start(t); o.stop(t + dur + 0.02);
}
const sfx = {
  tick: () => tone(880, 0.06, 'square', 0, 0.08),
  start: () => { tone(523, 0.1, 'triangle'); tone(784, 0.16, 'triangle', 0.1); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', i * 0.09, 0.16)),
  lose: () => [392, 330, 262].forEach((f, i) => tone(f, 0.22, 'sawtooth', i * 0.14, 0.09)),
  pop: () => tone(1200, 0.05, 'sine', 0, 0.08),
  fanfare: () => [523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', i * 0.1, 0.14)),
};
const buzz = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* ignore */ } };

// ---------- confetti ----------
const cv = $('confetti'), cx = cv.getContext('2d');
let bits = [], raf = 0;
function burst(n = 140) {
  if (reduceMotion) return;
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ['#ffd23f', '#ff4f8b', '#2f5bff', '#25c28f', '#ffffff'];
  for (let i = 0; i < n; i++) bits.push({
    x: cv.width / 2, y: cv.height * 0.45, vx: (Math.random() - 0.5) * 16, vy: -Math.random() * 15 - 4,
    s: 6 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, c: colors[i % colors.length], life: 90 + Math.random() * 40,
  });
  if (!raf) raf = requestAnimationFrame(stepConfetti);
}
function stepConfetti() {
  cx.clearRect(0, 0, cv.width, cv.height);
  bits = bits.filter((b) => b.life-- > 0 && b.y < cv.height + 20);
  bits.forEach((b) => {
    b.x += b.vx; b.y += b.vy; b.vy += 0.5; b.vx *= 0.99; b.r += b.vr;
    cx.save(); cx.translate(b.x, b.y); cx.rotate(b.r); cx.fillStyle = b.c; cx.strokeStyle = '#101a3a'; cx.lineWidth = 1.5;
    cx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); cx.strokeRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); cx.restore();
  });
  raf = bits.length ? requestAnimationFrame(stepConfetti) : 0;
  if (!raf) cx.clearRect(0, 0, cv.width, cv.height);
}

// ---------- canvas ----------
const pad = $('pad');
const ctx = pad.getContext('2d', { willReadFrequently: true });
const modelPad = document.createElement('canvas'); // hidden copy of the drawing with a thicker pen, for the model
modelPad.width = pad.width; modelPad.height = pad.height;
const mctx = modelPad.getContext('2d', { willReadFrequently: true });
const small = document.createElement('canvas');   // 28x28 canvas fed to DoodleNet
small.width = small.height = 28;
const sctx = small.getContext('2d', { willReadFrequently: true });

let classifier = null;
const state = { round: 0, score: 0, word: null, t0: 0, drawing: false, strokes: [], timer: null, loop: null, busy: false, done: false, running: false, log: [], lastGuess: '', lastSec: -1 };
let deck = [];

classifier = ml5.imageClassifier('DoodleNet', () => {
  $('startBtn').disabled = false;
  $('startBtn').textContent = "Let's play!";
});

function paintStrokes(c, width) {
  c.fillStyle = '#fff'; c.fillRect(0, 0, pad.width, pad.height);
  c.strokeStyle = '#000'; c.lineWidth = width; c.lineCap = c.lineJoin = 'round';
  state.strokes.forEach((s) => {
    c.beginPath(); c.moveTo(s[0][0], s[0][1]);
    if (s.length === 1) c.lineTo(s[0][0] + 0.01, s[0][1]);
    s.forEach((p) => c.lineTo(p[0], p[1]));
    c.stroke();
  });
}
function repaint() { paintStrokes(ctx, LINE_WIDTH); }
function setBubble(html, win = false) { const b = $('bubble'); b.innerHTML = `<span>${html}</span>`; b.classList.toggle('win', win); }
function resetBubble() { setBubble('Start drawing!'); mood('idle'); }
function pos(e) {
  const r = pad.getBoundingClientRect();
  return [(e.clientX - r.left) * pad.width / r.width, (e.clientY - r.top) * pad.height / r.height];
}
pad.addEventListener('pointerdown', (e) => {
  if (!state.running) return;
  pad.setPointerCapture(e.pointerId); state.drawing = true;
  state.strokes.push([pos(e)]); repaint(); mood('think');
});
pad.addEventListener('pointermove', (e) => {
  if (!state.drawing) return;
  const s = state.strokes[state.strokes.length - 1];
  ctx.strokeStyle = '#000'; ctx.lineWidth = LINE_WIDTH; ctx.lineCap = ctx.lineJoin = 'round';
  // coalesced events give every sampled point of a fast stroke, so lines stay smooth
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
  (evs.length ? evs : [e]).forEach((ev) => {
    const p = pos(ev), q = s[s.length - 1];
    s.push(p);
    ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
  });
});
['pointerup', 'pointercancel'].forEach((ev) => pad.addEventListener(ev, () => { state.drawing = false; }));
$('clearBtn').onclick = () => { if (state.running) { state.strokes = []; repaint(); resetBubble(); sfx.pop(); } };
$('undoBtn').onclick = () => {
  if (!state.running) return;
  state.strokes.pop(); repaint(); sfx.pop();
  if (!state.strokes.length) resetBubble();
};

// Crop the drawing to its bounding box, centre it on a 28x28 canvas and threshold it,
// so thin or off-centre doodles look like the Quick Draw training images.
function prepareInput(penWidth) {
  const { width: w, height: h } = pad;
  paintStrokes(mctx, penWidth);
  const d = mctx.getImageData(0, 0, w, h).data;
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (d[(y * w + x) * 4] < 128) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  if (maxX < 0) return null;                       // nothing drawn
  const bw = maxX - minX + 1, bh = maxY - minY + 1;
  const side = Math.max(bw, bh, 40);
  const scale = 20 / side;                         // leave a 4px margin in the 28px frame
  sctx.fillStyle = '#fff'; sctx.fillRect(0, 0, 28, 28);
  sctx.imageSmoothingEnabled = true; sctx.imageSmoothingQuality = 'high';
  const dw = bw * scale, dh = bh * scale;
  sctx.drawImage(modelPad, minX, minY, bw, bh, (28 - dw) / 2, (28 - dh) / 2, dw, dh);
  const img = sctx.getImageData(0, 0, 28, 28);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = img.data[i] < 215 ? 0 : 255;         // hard black/white (DoodleNet floors anything grey)
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  sctx.putImageData(img, 0, 0);
  return small;
}

// ---------- game flow ----------
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const norm = (s) => s.toLowerCase().replace(/_/g, ' ');
const article = (w) => (/^[aeiou]/i.test(w) ? 'an' : 'a');

// ---------- grade picker ----------
let grade = 0;   // 0 = every grade
try { grade = Number(localStorage.getItem('doodle-grade')) || 0; } catch (e) { /* storage optional */ }
function paintGrade() { document.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(Number(c.dataset.grade) === grade))); }
document.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => {
  grade = Number(c.dataset.grade); paintGrade(); sfx.pop();
  try { localStorage.setItem('doodle-grade', String(grade)); } catch (e) { /* ignore */ }
}));
paintGrade();

function startGame() {
  unlockAudio();
  let pool = WORDS.filter((w) => !grade || w.grades.includes(grade));
  if (pool.length < ROUNDS) pool = WORDS;
  deck = shuffle(pool.slice()).slice(0, ROUNDS);
  state.round = 0; state.score = 0; state.log = [];
  $('score').textContent = '0 pts';
  nextRound();
}

// shows the word card first; the clock starts when the student taps "Let's draw!"
function nextRound() {
  if (state.round >= ROUNDS) return endGame();
  state.word = deck[state.round]; state.round++;
  state.done = false; state.running = false; state.strokes = []; state.lastGuess = ''; state.lastSec = -1;
  clearInterval(state.timer); clearInterval(state.loop);
  $('round').textContent = `${state.round} / ${ROUNDS}`;
  $('word').textContent = state.word.en;
  $('introWord').textContent = state.word.en;
  $('sheet').classList.remove('shake');
  setRing(1);
  $('timer').textContent = TIME_LIMIT;
  repaint(); resetBubble(); show('game');
  $('intro').classList.remove('hidden');
  speak(state.word.en);
  setTimeout(() => $('introGo').focus(), 50);
}

function beginDrawing() {
  if (state.running || state.done) return;
  unlockAudio(); sfx.start();
  $('intro').classList.add('hidden');
  state.running = true; state.t0 = performance.now();
  tick();
  state.timer = setInterval(tick, 100);
  state.loop = setInterval(guessNow, CLASSIFY_EVERY_MS);
}

function setRing(frac) {
  const C = 119.4;
  $('ringFill').style.strokeDashoffset = String(C * (1 - frac));
}

function tick() {
  if (!state.running) return;
  const left = Math.max(0, TIME_LIMIT - (performance.now() - state.t0) / 1000);
  const sec = Math.ceil(left);
  $('timer').textContent = sec;
  setRing(left / TIME_LIMIT);
  $('ring').classList.toggle('warn', left <= 10 && left > 5);
  $('ring').classList.toggle('danger', left <= 5);
  $('sheet').classList.toggle('shake', left <= 3 && left > 0 && !reduceMotion);
  if (sec !== state.lastSec) { state.lastSec = sec; if (sec <= 5 && sec > 0) { sfx.tick(); buzz(15); } }
  if (left <= 0) finishRound(false);
}

const classifyAsync = (input) => new Promise((res) => classifier.classify(input, TOP_K, (err, r) => res(err ? null : r)));
const isWin = (results, targetLabel) => {
  const hit = results.findIndex((r) => norm(r.label) === targetLabel);
  return hit === 0 || (hit > 0 && hit < WIN_TOP_N && results[hit].confidence >= WIN_MIN_CONF);
};

async function guessNow() {
  if (!state.running || state.busy || !state.strokes.length) return;
  state.busy = true;
  const target = state.word;
  try {
    const all = [];
    for (const w of MODEL_LINE_WIDTHS) {
      const input = prepareInput(w);
      if (!input) return;
      const r = await classifyAsync(input);
      if (r && r.length) all.push(r);
    }
    if (!state.running || state.word !== target || !all.length) return;
    const names = all[0].slice(0, 3).map((r) => `<b>${norm(r.label)}</b>`);
    state.lastGuess = norm(all[0][0].label);
    setBubble(`I see ${names.join(', or ')}…`);
    if (all.some((r) => isWin(r, norm(target.cls)))) finishRound(true);
  } finally { state.busy = false; }
}

function thumbnail() {           // small copy of the drawing for the result card and gallery
  const t = document.createElement('canvas'); t.width = t.height = 240;
  const tc = t.getContext('2d'); tc.fillStyle = '#fff'; tc.fillRect(0, 0, 240, 240);
  tc.imageSmoothingQuality = 'high'; tc.drawImage(pad, 0, 0, 240, 240);
  return t.toDataURL('image/png');
}

function finishRound(won) {
  if (!state.running) return;
  state.running = false; state.done = true; state.drawing = false;
  clearInterval(state.timer); clearInterval(state.loop);
  $('ring').classList.remove('warn', 'danger'); $('sheet').classList.remove('shake');
  const w = state.word;
  const left = Math.max(0, TIME_LIMIT - (performance.now() - state.t0) / 1000);
  const pts = won ? BASE_POINTS + Math.round(left) * POINTS_PER_SECOND : 0;
  state.score += pts;
  const img = thumbnail();
  state.log.push({ word: w, won, pts, img });

  // a short beat on the game screen so the robot can react, then the result card
  if (won) { setBubble(`Oh, I know! It's ${article(w.en)} <b>${w.en}</b>!`, true); mood('happy'); sfx.win(); burst(); buzz(80); }
  else { setBubble("I give up!"); mood('sad'); sfx.lose(); }
  setTimeout(() => showResult(won, w, pts, img), won ? 1100 : 900);
}

function showResult(won, w, pts, img) {
  const card = $('resultCard');
  card.classList.toggle('miss', !won); card.classList.toggle('win', won);
  $('stamp').textContent = won ? ['Got it!', 'Nice!', 'Wow!', 'Yes!'][state.round % 4] : "Time's up!";
  $('resultImg').src = img;
  $('resultEn').textContent = won ? `It's ${article(w.en)} ${w.en}!` : `You were drawing: ${w.en}`;
  $('resultJa').innerHTML = jaHTML(w);
  $('thought').textContent = won ? '' : (state.lastGuess ? `I thought it was ${article(state.lastGuess)} ${state.lastGuess}.` : "I couldn't see anything.");
  $('points').innerHTML = won ? `<b>+${pts}</b> points` : '';
  $('score').textContent = `${state.score} pts`;
  $('nextBtn').textContent = state.round >= ROUNDS ? 'See results' : 'Next word';
  show('result');
  setTimeout(() => $('nextBtn').focus(), 50);
  if (won) burst(60);
  speak(w.en);
}

function endGame() {
  const wins = state.log.filter((l) => l.won).length;
  $('finalPts').textContent = state.score;
  $('finalLine').textContent = wins === ROUNDS ? 'Perfect! The robot guessed every one!' : `The robot guessed ${wins} of ${ROUNDS}.`;
  $('gallery').innerHTML = state.log.map((l) =>
    `<li class="${l.won ? 'won' : 'lost'}"><span class="badge">${l.won ? '✓' : '✗'}</span><img src="${l.img}" alt=""><div class="en">${l.word.en}</div><div class="ja">${jaHTML(l.word)}</div></li>`).join('');
  show('end');
  if (wins >= 3) { sfx.fanfare(); burst(200); }
  setTimeout(() => $('againBtn').focus(), 50);
}

function speak(text) {
  try {
    if (muted || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.85;
    speechSynthesis.speak(u);
  } catch (e) { /* speech is optional */ }
}

// ---------- tutorial modal ----------
const tutorial = $('tutorial');
function openTutorial() { tutorial.classList.remove('hidden'); $('tutOk').focus(); }
function closeTutorial() {
  tutorial.classList.add('hidden');
  try { localStorage.setItem('doodle-tutorial-seen', '1'); } catch (e) { /* ignore */ }
}
$('help').onclick = () => { unlockAudio(); sfx.pop(); openTutorial(); };
$('tutOk').onclick = () => { unlockAudio(); sfx.start(); closeTutorial(); };
tutorial.addEventListener('click', (e) => { if (e.target === tutorial) closeTutorial(); });
let seen = false;
try { seen = localStorage.getItem('doodle-tutorial-seen') === '1'; } catch (e) { /* ignore */ }
if (!seen) openTutorial();   // first visit: show how to play

$('startBtn').onclick = startGame;
$('introGo').onclick = beginDrawing;
$('introSpeak').onclick = () => speak(state.word.en);
$('speak').onclick = () => speak(state.word.en);
$('nextBtn').onclick = () => { unlockAudio(); nextRound(); };
$('againBtn').onclick = startGame;
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !tutorial.classList.contains('hidden')) { closeTutorial(); return; }
  if (!tutorial.classList.contains('hidden')) return;   // keys belong to the modal while it is open
  if (e.key === 'z' && (e.ctrlKey || e.metaKey)) { $('undoBtn').click(); return; }
  if (e.key !== ' ' && e.key !== 'Enter') return;
  if (!$('intro').classList.contains('hidden') && !$('game').classList.contains('hidden')) { e.preventDefault(); beginDrawing(); }
});
repaint();
