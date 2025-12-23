/* ===== Snow ===== */
const snowLayer = document.getElementById("snow-layer");
// const wishTitle = document.getElementById("wish-title");
// const wishText = document.getElementById("wish-text");
// wish-text = div/h1 chứa lời chúc

function createSnow() {
    const snow = document.createElement("div");
    snow.className = "snow";

    const size = Math.random() * 4 + 4;
    snow.style.width = size + "px";
    snow.style.height = size + "px";

    snow.style.left = Math.random() * window.innerWidth + "px";
    snow.style.animationDuration = Math.random() * 5 + 6 + "s";

    snowLayer.appendChild(snow);

    checkCollision(snow);
}

function checkCollision(snow) {
    const interval = setInterval(() => {
        const snowRect = snow.getBoundingClientRect();
    const threshold = 15; // px from bottom
    const hitBottom = snowRect.bottom >= (window.innerHeight - threshold);

    if (hitBottom) {
      // place sparkle slightly above the bottom for visibility
      createSparkle(
        snowRect.left + snowRect.width / 2,
        Math.min(window.innerHeight - 6, snowRect.bottom)
      );
      snow.remove();
      clearInterval(interval);
      return;
    }

    // fallback: if the snow has fully passed the viewport, clean up
    if (snowRect.top > window.innerHeight) {
      snow.remove();
      clearInterval(interval);
    }
    }, 60);
}

function createSparkle(x, y) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";
    snowLayer.appendChild(sparkle);

    setTimeout(() => sparkle.remove(), 1200);
}

// start snow AFTER open gift
function startSnow() {
    setInterval(createSnow, 100);
}
startSnow();

/* ===== Background lights ===== */
const bgLights = document.getElementById("bg-lights");

function createBgLight() {
    const light = document.createElement("div");
    light.className = "bg-light";

    const size = Math.random() * 80 + 40; // đèn to nhỏ khác nhau
    light.style.width = size + "px";
    light.style.height = size + "px";

    light.style.left = Math.random() * 100 + "vw";
    light.style.top = "110vh";

    const duration = Math.random() * 20 + 20; // bay chậm
    light.style.animationDuration = duration + "s";

    bgLights.appendChild(light);

    setTimeout(() => light.remove(), duration * 2000);
}

// tạo liên tục nhưng thưa
setInterval(createBgLight, 900);

/* ===== Personalize ===== */
const params = new URLSearchParams(window.location.search);
const to = params.get("to");
if (to) {
    document.getElementById(
        "title"
    ).textContent = `Merry Christmas, ${to} 🎄`;
}

/* ===== Fireworks ===== */
function launchFirework(x, y, isBackground = false) {
    const container = document.getElementById("fireworks");

    const colors = isBackground
        ? ["#ffd166aa", "#ffffff88"]
        : ["#c1121f", "#0b8457", "#ffd166", "#ffffff"];

    const PARTICLES = isBackground ? 40 : 70;
    const BASE_DISTANCE = isBackground ? 150 : 140;

    for (let i = 0; i < PARTICLES; i++) {
        const p = document.createElement("div");
        p.className = isBackground ? "firework bg" : "firework";

        const size = isBackground
            ? Math.random() * 5 + 5
            : Math.random() * 4 + 4;

        p.style.width = size + "px";
        p.style.height = size + "px";

        p.style.left = x + "px";
        p.style.top = y + "px";

        const angle = Math.random() * Math.PI * 2;
        const distance = BASE_DISTANCE + Math.random() * 60;

        p.style.setProperty("--x", Math.cos(angle) * distance + "px");
        p.style.setProperty("--y", Math.sin(angle) * distance + "px");
        p.style.background =
            colors[Math.floor(Math.random() * colors.length)];

        p.style.opacity = isBackground ? "0.6" : "1";

        container.appendChild(p);
        setTimeout(() => p.remove(), isBackground ? 1200 : 1100);
    }
}



/* ===== Open gift ===== */
let opened = false;
const giftBox = document.getElementById("giftBox");

const bgMusic = document.getElementById("bgMusic");

function playMusic() {
    bgMusic.volume = 0;
    bgMusic.play();

    let vol = 0;
    const fade = setInterval(() => {
        vol += 0.02;
        if (vol >= 0.3) {
            vol = 0.3;
            clearInterval(fade);
        }
        bgMusic.volume = vol;
    }, 120);
}

giftBox.addEventListener("click", (e) => {
    if (opened) return;
    opened = true;
    e.stopPropagation();
    playMusic();
    // santaAnimate();
    initSantaFrames('#santa', { path: 'assets/santa/', prefix: 'Asset ', start: 2, end: 24, fps: 12, autoStart: true });

    const rect = giftBox.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    giftBox.classList.add("open");

    launchFirework(cx, cy);
    setTimeout(() => launchFirework(cx, cy - 40), 300);

    setTimeout(() => {
        document.getElementById("hint").remove();
        const content = document.getElementById("content");
        content.classList.remove("hidden");
        content.classList.add("show");
    }, 700);
});

/* ===== Tree click ===== */
// document.getElementById("tree").addEventListener("click", () => {
//     const x = window.innerWidth / 2;
//     const y = window.innerHeight / 2 - 100;
//     launchFirework(x, y);
// });

/* ===== Mouse interaction ===== */
let mouseEnabled = true;

const CHRISTMAS_COLORS = ["#c1121f", "#0b8457", "#ffd166"];

function mouseSpark(x, y, big = false) {
    if (!mouseEnabled) return;

    const spark = document.createElement("div");
    spark.className = "mouse-spark";
    spark.style.left = x + "px";
    spark.style.top = y + "px";

    const color =
        CHRISTMAS_COLORS[Math.floor(Math.random() * CHRISTMAS_COLORS.length)];

    spark.style.background = `radial-gradient(
    circle,
    ${color},
    rgba(255,255,255,0.15)
  )`;

    if (big) {
        spark.style.width = "18px";
        spark.style.height = "18px";
    }

    document.body.appendChild(spark);
    setTimeout(() => spark.remove(), 700);
}


// trail khi rê chuột
window.addEventListener("mousemove", (e) => {
    if (Math.random() < 0.5) {
        mouseSpark(e.clientX, e.clientY);
    }
});

// click tạo spark mạnh hơn
window.addEventListener("mousedown", (e) => {
    mouseSpark(e.clientX, e.clientY, true);
});

/* ===== Background fireworks ===== */
let bgFireworkEnabled = true;

function randomBackgroundFirework() {
    if (!bgFireworkEnabled) return;

    const count = Math.random() < 0.5 ? 1 : Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < count; i++) {
        const x =
            Math.random() * window.innerWidth * 0.9 +
            window.innerWidth * 0.05;

        const y =
            Math.random() * window.innerHeight * 0.5 +
            window.innerHeight * 0.05;

        const delay = i * (200 + Math.random() * 200);

        setTimeout(() => {
            launchFirework(x, y, true);
        }, delay);
    }
}

// chạy pháo nền mỗi 2.5–4s (random)
function scheduleBgFirework() {
    const delay = Math.random() * 1000 + 1000;
    setTimeout(() => {
        randomBackgroundFirework();
        scheduleBgFirework();
    }, delay);
}

scheduleBgFirework();

/**
 * initSantaFrames(selector, options)
 * selector: DOM selector for <img> or element (img recommended)
 * options:
 *  - path: 'assets/santa/' (default)
 *  - prefix: 'Asset ' (default)
 *  - start: 29 (default)
 *  - end: 52 (default)
 *  - ext: '.png' (default)
 *  - fps: 12 (default)
 *  - autoStart: true/false
 */
function initSantaFrames(selector, options = {}) {
  const cfg = Object.assign({
    path: 'assets/santa/',
    prefix: '',
    start: 1,
    end: 24,
    ext: '.png',
    fps: 12,
    autoStart: true,
  }, options);

  const el = document.querySelector(selector);
  if (!el) throw new Error('Element not found: ' + selector);

  // build filenames
  const frames = [];
  for (let i = cfg.start; i <= cfg.end; i++) {
    const name = i + cfg.ext;
    // encode filename to handle spaces
    const url = cfg.path + encodeURIComponent(name);
    frames.push(url);
  }

  let images = new Array(frames.length);
  let loaded = 0;
  let intervalId = null;
  let current = 0;
  let fps = cfg.fps;
  const delay = () => 1000 / fps;

  // preload
  frames.forEach((src, idx) => {
    const img = new Image();
    img.onload = () => {
      images[idx] = img;
      loaded++;
      // set first frame when ready
      if (loaded === 1) {
        if (el.tagName.toLowerCase() === 'img') el.src = images[0].src;
        else el.style.backgroundImage = `url("${images[0].src}")`;
      }
    };
    img.onerror = () => {
      console.warn('Failed loading', src);
      loaded++;
    };
    img.src = src;
  });

  function renderFrame(i) {
    const img = images[i];
    if (!img) return;
    if (el.tagName.toLowerCase() === 'img') el.src = img.src;
    else el.style.backgroundImage = `url("${img.src}")`;
  }

  function step() {
    current = (current + 1) % images.length;
    renderFrame(current);
  }

  function start() {
    if (intervalId) return;
    // if not all loaded, wait until at least one loaded (already handled)
    intervalId = setInterval(step, delay());
    el.classList.remove('paused');
  }

  function stop() {
    if (!intervalId) return;
    clearInterval(intervalId);
    intervalId = null;
    el.classList.add('paused');
  }

  function setFPS(newFps) {
    fps = newFps;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = setInterval(step, delay());
    }
  }

  function gotoFrame(n) {
    current = ((n % images.length) + images.length) % images.length;
    renderFrame(current);
  }

  // autoStart when at least one frame loaded
  if (cfg.autoStart) {
    // if images loaded already -> start, else wait for first load
    const tryStart = setInterval(() => {
      if (loaded > 0) {
        start();
        clearInterval(tryStart);
      }
    }, 200);
  }

  const api = { start, stop, setFPS, gotoFrame, images, frames };
  // expose for debugging / global usage
  window.santaFrames = api;
  return api;
}