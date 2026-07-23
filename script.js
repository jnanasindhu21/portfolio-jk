// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});
document.getElementById('navLinks').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') nav.classList.remove('open');
});

// Terminal trace log typing effect
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const terminal = document.getElementById('terminal');

const traces = [
`$ trace GET /api/v1/documents/8842
  → auth.verify           12ms   200
  → documents.fetch        18ms   200
  → render.metadata          6ms   200
  ✓ 200 OK · 42ms total`,

`$ trace POST /api/v1/tasks/5521/status
  → auth.verify            9ms   200
  → tasks.update           21ms   200
  → notify.subscribers     14ms   200
  ✓ 200 OK · 47ms total`,

`$ span export → tempo
  service.name="rolodex-storage"
  span.kind=SERVER
  ✓ exported 3 spans`
];

function staticRender(){
  terminal.textContent = traces.join('\n\n');
}

async function typeLoop(){
  let i = 0;
  while (true) {
    const block = traces[i % traces.length];
    terminal.textContent = '';
    for (let c = 0; c < block.length; c++) {
      terminal.textContent += block[c];
      await sleep(block[c] === '\n' ? 60 : 14);
    }
    await sleep(1400);
    for (let c = block.length; c >= 0; c--) {
      terminal.textContent = block.slice(0, c);
      await sleep(4);
    }
    await sleep(300);
    i++;
  }
}

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

if (reduceMotion) {
  staticRender();
} else {
  typeLoop();
}
