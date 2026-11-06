// Fondo de estrellas pixeladas
(() => {
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  const SCALE = 3; // tamaño de cada "píxel"
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];
  let w, h;

  function resize() {
    w = Math.ceil(window.innerWidth / SCALE);
    h = Math.ceil(window.innerHeight / SCALE);
    canvas.width = w;
    canvas.height = h;
    const count = Math.floor((w * h) / 900);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() < 0.15 ? 2 : 1,
      t: Math.random() * Math.PI * 2,
    }));
  }

  const colors = ['#ffffff', '#ffcc00', '#3ce0ff', '#ff5fa2'];

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.t += 0.05;
      if (!reduce) {
        s.y += 0.06 * s.z;
        if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      }
      const on = Math.sin(s.t) > -0.6;
      if (!on) continue;
      ctx.fillStyle = s.z === 2 ? colors[(s.x | 0) % colors.length] : '#8f86c9';
      ctx.fillRect(s.x | 0, s.y | 0, s.z, s.z);
    }
    if (!reduce) requestAnimationFrame(draw);
  }

  resize();
  draw();
  // En el móvil, ocultar la barra de direcciones cambia solo el alto: se ignora
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    resize();
    if (reduce) draw();
  });
})();

// Muestra el GIF animado al pasar el ratón (solo se carga cuando hace falta)
// Solo en equipos con ratón: en el móvil, el scroll táctil disparaba el hover
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (canHover) document.querySelectorAll('.screen[data-anim]').forEach((screen) => {
  const img = screen.querySelector('img');
  const still = img.src;
  const anim = screen.dataset.anim;
  const on = () => { img.src = anim; };
  const off = () => { img.src = still; };
  screen.addEventListener('mouseenter', on);
  screen.addEventListener('mouseleave', off);
  screen.addEventListener('focus', on);
  screen.addEventListener('blur', off);
});

// Contador de "puntos" del HUD que sube al hacer scroll
(() => {
  const score = document.getElementById('score');
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? window.scrollY / max : 0;
    score.textContent = String(Math.round(pct * 50000) * 10).padStart(6, '0');
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

document.getElementById('year').textContent = new Date().getFullYear();
