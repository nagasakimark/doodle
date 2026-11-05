// Doodle Time! — draw the English word, DoodleNet (via ml5) tries to guess it.
// If it hasn't guessed within TIME_LIMIT seconds, the Japanese meaning is revealed.

const TIME_LIMIT = 20;      // seconds per word
const ROUNDS = 5;           // words per game
const TOP_K = 5;            // how many guesses to ask the model for
const WIN_TOP_N = 3;        // target counts if it is in the model's top N guesses...
const WIN_MIN_CONF = 0.10;  // ...with at least this confidence (top-1 always wins)
const CLASSIFY_EVERY_MS = 300;
const LINE_WIDTH = 16;

const $ = (id) => document.getElementById(id);
const screens = ['start', 'game', 'result', 'end'];
function show(name) { screens.forEach((s) => $(s).classList.toggle('hidden', s !== name)); }

const pad = $('pad');
const ctx = pad.getContext('2d', { willReadFrequently: true });
const small = document.createElement('canvas');   // 28x28 canvas fed to DoodleNet
small.width = small.height = 28;
const sctx = small.getContext('2d', { willReadFrequently: true });

let classifier = null;
let state = { round: 0, score: 0, word: null, t0: 0, drawing: false, strokes: 0, timer: null, loop: null, busy: false, done: false, log: [] };
let deck = [];

// ---------- model ----------
classifier = ml5.imageClassifier('DoodleNet', () => {
  $('startBtn').disabled = false;
  $('startBtn').textContent = 'Start!';
  $('loadMsg').textContent = '';
});

// ---------- drawing ----------
function clearPad() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, pad.width, pad.height);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = LINE_WIDTH;
  ctx.lineCap = ctx.lineJoin = 'round';
  state.strokes = 0;
  $('guess').textContent = 'I see…';
}
function pos(e) {
  const r = pad.getBoundingClientRect();
  return [(e.clientX - r.left) * pad.width / r.width, (e.clientY - r.top) * pad.height / r.height];
}
pad.addEventListener('pointerdown', (e) => {
  if (state.done) return;
  pad.setPointerCapture(e.pointerId);
  state.drawing = true; state.strokes++;
  const [x, y] = pos(e);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 0.01, y); ctx.stroke();
});
pad.addEventListener('pointermove', (e) => {
  if (!state.drawing) return;
  const [x, y] = pos(e);
  ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y);
});
['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => pad.addEventListener(ev, () => { state.drawing = false; }));
$('clearBtn').onclick = () => { if (!state.done) clearPad(); };

// Crop the drawing to its bounding box, centre it on a 28x28 canvas and threshold it,
// so thin or off-centre doodles look like the Quick Draw training images.
function prepareInput() {
  const { width: w, height: h } = pad;
  const d = ctx.getImageData(0, 0, w, h).data;
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
  sctx.drawImage(pad, minX, minY, bw, bh, (28 - dw) / 2, (28 - dh) / 2, dw, dh);
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

function startGame() {
  deck = shuffle(WORDS.slice()).slice(0, ROUNDS);
  state.round = 0; state.score = 0; state.log = [];
  $('score').textContent = '⭐ 0';
  nextRound();
}

function nextRound() {
  if (state.round >= ROUNDS) return endGame();
  state.word = deck[state.round];
  state.round++; state.done = false; state.t0 = performance.now();
  $('round').textContent = `${state.round} / ${ROUNDS}`;
  $('word').textContent = state.word.en;
  clearPad(); show('game');
  speak(state.word.en);
  tick();
  clearInterval(state.timer); clearInterval(state.loop);
  state.timer = setInterval(tick, 200);
  state.loop = setInterval(guessNow, CLASSIFY_EVERY_MS);
}

function tick() {
  if (state.done) return;
  const left = Math.max(0, TIME_LIMIT - (performance.now() - state.t0) / 1000);
  $('timer').textContent = Math.ceil(left);
  const f = $('timebarFill');
  f.style.width = (left / TIME_LIMIT * 100) + '%';
  f.style.background = left < 6 ? '#e03131' : left < 12 ? '#f59f00' : '#5ac46a';
  if (left <= 0) finishRound(false);
}

function guessNow() {
  if (state.done || state.busy || !state.strokes) return;
  const input = prepareInput();
  if (!input) return;
  state.busy = true;
  const target = state.word;
  classifier.classify(input, TOP_K, (err, results) => {
    state.busy = false;
    if (err || state.done || state.word !== target || !results || !results.length) return;
    const names = results.slice(0, 3).map((r) => `<b>${norm(r.label)}</b>`).join(', ');
    $('guess').innerHTML = `I see… ${names}`;
    const targetLabel = norm(target.cls);
    const hit = results.findIndex((r) => norm(r.label) === targetLabel);
    if (hit === 0 || (hit > 0 && hit < WIN_TOP_N && results[hit].confidence >= WIN_MIN_CONF)) finishRound(true);
  });
}

function finishRound(won) {
  if (state.done) return;
  state.done = true;
  clearInterval(state.timer); clearInterval(state.loop);
  const w = state.word;
  if (won) state.score++;
  state.log.push({ word: w, won });
  $('score').textContent = `⭐ ${state.score}`;
  const r = $('result');
  r.classList.toggle('miss', !won);
  $('resultEmoji').textContent = won ? '🎉' : '⏰';
  $('resultTitle').textContent = won ? 'I got it!' : "Time's up!";
  $('resultEn').textContent = won ? `It's ${/^[aeiou]/i.test(w.en) ? 'an' : 'a'} ${w.en}!` : `You were drawing: ${w.en}`;
  $('resultJa').textContent = w.ja;
  const rc = $('resultImg').getContext('2d');
  rc.fillStyle = '#fff'; rc.fillRect(0, 0, 160, 160);
  rc.drawImage(pad, 0, 0, 160, 160);
  $('nextBtn').textContent = state.round >= ROUNDS ? 'Finish ▶' : 'Next ▶';
  speak(w.en);
  show('result');
}

function endGame() {
  $('finalScore').textContent = `${state.score} / ${ROUNDS} ⭐`;
  $('summary').innerHTML = state.log.map((l) =>
    `<li><span>${l.won ? '✅' : '❌'} ${l.word.en}</span><span>${l.word.ja}</span></li>`).join('');
  show('end');
}

function speak(text) {
  try {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.85;
    speechSynthesis.speak(u);
  } catch (e) { /* speech is optional */ }
}

$('startBtn').onclick = startGame;
$('nextBtn').onclick = nextRound;
$('againBtn').onclick = startGame;
$('speak').onclick = () => speak(state.word.en);
clearPad();
