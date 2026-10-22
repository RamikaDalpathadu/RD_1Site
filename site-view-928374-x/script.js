/* ============ EDIT YOUR DETAILS HERE ============ */
const CONFIG = {
  herName: "Suduuu",            // her name / nickname
  yourName: "Ramiii",         // your name
  startDate: "2025-10-24",       // the day you fell in love
  // Put your mp3 files in the "songs" folder and list them here
  songs: [
    { title: "Ahasin Ehaa",   event: "Symposium '25",   file: "songs/song1.mp3" },
    
  ],
  reasons: [
    "Your voice is my favourite song",
    "Your smile fixes my worst days",
    "You make every stage feel like home",
    "You laugh at my silly jokes",
    "You are my best duet partner",
    "You make ordinary days magical"
  ],
  letter:
`Thuduuuuu,

A year ago I walked into a duet at Ruhuna with no idea that my life was about to change. Now every song I love has your voice in it.

Thank you for your patience, your laughter, and for singing next to me when I forgot the words.

I don't know what the next year holds, but I know I want to sing it with you.

Happy 1st Anniversary. I love you.`,
  finalText: "Here's to a lifetime of duets. I love you, forever. 💖"
};
/* ================================================= */

const $ = s => document.querySelector(s);
document.querySelectorAll(".her").forEach(e => e.textContent = CONFIG.herName);
$("#sign").textContent = "Forever yours, " + CONFIG.yourName;

/* ---------- falling hearts & sparkles background ---------- */
const cv = $("#sky"), cx = cv.getContext("2d");
let W, H, bits = [];
function size(){ W = cv.width = innerWidth; H = cv.height = innerHeight; }
addEventListener("resize", size); size();
const glyphs = ["♥","✦","❤","·"];
for (let i = 0; i < 42; i++) bits.push(mk(true));
function mk(r){ return { x: Math.random()*W, y: r ? Math.random()*H : H+20, s: 8+Math.random()*18,
  v: .3+Math.random()*.8, g: glyphs[Math.random()*glyphs.length|0], a: .15+Math.random()*.5, p: Math.random()*6 }; }
(function draw(t){
  cx.clearRect(0,0,W,H);
  bits.forEach((b,i) => {
    b.y -= b.v; b.x += Math.sin(t/1500 + b.p)*.4;
    cx.globalAlpha = b.a; cx.fillStyle = "#ff9db8"; cx.font = b.s+"px serif";
    cx.fillText(b.g, b.x, b.y);
    if (b.y < -30) bits[i] = mk(false);
  });
  requestAnimationFrame(draw);
})(0);

/* ---------- open the envelope ---------- */
function openIt(){
  $("#env").classList.add("open");
  setTimeout(() => {
    $("#intro").classList.add("gone");
    $("#site").classList.remove("hidden");
    setTimeout(() => $("#intro").remove(), 1000);
    burst(24);
    watch();
  }, 1100);
}
$("#env").addEventListener("click", openIt);
$("#env").addEventListener("keydown", e => (e.key === "Enter" || e.key === " ") && openIt());

/* ---------- days together counter ---------- */
function tick(){
  const d = Math.max(0, Date.now() - new Date(CONFIG.startDate + "T00:00:00"));
  const v = [[Math.floor(d/864e5),"days"],[Math.floor(d/36e5)%24,"hours"],[Math.floor(d/6e4)%60,"minutes"],[Math.floor(d/1e3)%60,"seconds"]];
  $("#counter").innerHTML = v.map(x => `<div><b>${x[0]}</b><span>${x[1]}</span></div>`).join("");
}
tick(); setInterval(tick, 1000);

/* ---------- photos (placeholder if image missing) ---------- */
document.querySelectorAll(".photo").forEach(p => {
  const img = new Image();
  img.alt = p.dataset.label;
  img.onload = () => p.appendChild(img);
  img.onerror = () => { p.classList.add("empty"); p.insertAdjacentText("beforeend", "Add photo: " + p.dataset.src); };
  img.src = p.dataset.src;
});

/* ---------- scroll reveal + typewriter ---------- */
let typed = false;
function watch(){
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.classList.contains("letter") && !typed){ typed = true; type(); }
    io.unobserve(e.target);
  }), { threshold: .25 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}
function type(){
  const el = $("#letter"); let i = 0;
  (function n(){ el.textContent = CONFIG.letter.slice(0, ++i); if (i < CONFIG.letter.length) setTimeout(n, 38); })();
}

/* ---------- reason cards ---------- */
$("#cards").innerHTML = CONFIG.reasons.map(r =>
  `<div class="rc"><div><span class="f">♥</span><span class="b">${r}</span></div></div>`).join("");
document.querySelectorAll(".rc").forEach(c => c.addEventListener("click", () => c.classList.toggle("flip")));

/* ---------- music player ---------- */
const au = $("#audio"), vin = $("#vinyl"), pb = $("#play");
let cur = 0;
$("#list").innerHTML = CONFIG.songs.map((s,i) => `<li data-i="${i}">${s.title}<small>${s.event}</small></li>`).join("");
const fmt = s => isFinite(s) ? Math.floor(s/60) + ":" + String(Math.floor(s%60)).padStart(2,"0") : "0:00";
function load(i, go){
  cur = (i + CONFIG.songs.length) % CONFIG.songs.length;
  const s = CONFIG.songs[cur];
  au.src = s.file; $("#ttl").textContent = s.title; $("#evt").textContent = s.event;
  document.querySelectorAll("#list li").forEach((l,k) => l.classList.toggle("on", k === cur));
  if (go) au.play().catch(() => {});
}
au.onplay = () => { vin.classList.add("spin"); pb.textContent = "❚❚"; };
au.onpause = () => { vin.classList.remove("spin"); pb.textContent = "▶"; };
au.onended = () => load(cur + 1, true);
au.ontimeupdate = () => { $("#bar").value = au.duration ? au.currentTime / au.duration * 100 : 0; $("#cur").textContent = fmt(au.currentTime); };
au.onloadedmetadata = () => $("#dur").textContent = fmt(au.duration);
$("#bar").oninput = e => au.duration && (au.currentTime = e.target.value / 100 * au.duration);
pb.onclick = () => au.paused ? au.play().catch(() => {}) : au.pause();
$("#prev").onclick = () => load(cur - 1, true);
$("#next").onclick = () => load(cur + 1, true);
$("#list").onclick = e => { const li = e.target.closest("li"); if (li) load(+li.dataset.i, true); };
load(0, false);

/* ---------- finale ---------- */
function burst(n){
  for (let i = 0; i < n; i++){
    const h = document.createElement("span");
    h.className = "burst"; h.textContent = ["💖","💕","✨","🌹","💗"][i%5];
    h.style.left = Math.random()*100 + "vw"; h.style.bottom = "-30px";
    h.style.setProperty("--x", (Math.random()*200-100) + "px");
    h.style.setProperty("--r", (Math.random()*80-40) + "deg");
    h.style.animationDelay = Math.random()*.8 + "s";
    document.body.appendChild(h); setTimeout(() => h.remove(), 3600);
  }
}
$("#surprise").onclick = () => {
  const f = $("#final"); f.textContent = CONFIG.finalText; f.classList.add("show");
  burst(60);
};
