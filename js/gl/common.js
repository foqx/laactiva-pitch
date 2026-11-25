/* Laactiva deck — shared 3D utilities (Three.js r165, vendored) */
import * as THREE from '../../vendor/three/build/three.module.min.js';
import { RoomEnvironment } from '../../vendor/three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from '../../vendor/three/examples/jsm/geometries/RoundedBoxGeometry.js';
export { THREE, RoundedBoxGeometry };

export const FONT = 'Tajawal, "Segoe UI", Tahoma, sans-serif';
export const scenes = {};
export const ss = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x); };
export const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export const lerp = (a, b, t) => a + (b - a) * t;

/* renderer sized in stage pixels, rendered at true screen resolution */
export function mkRenderer(canvas, w, h, o = {}) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: o.alpha !== false, powerPreference: 'high-performance', stencil: false });
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = o.tone ?? THREE.NeutralToneMapping;
  r.toneMappingExposure = o.exposure ?? 1;
  if (o.alpha !== false) r.setClearColor(0x000000, 0);
  if (o.shadows) { r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap; }
  const maxPixels = o.maxPixels || 8.5e6;
  const size = () => {
    const s = (window.DECK && DECK.scale) || 1;
    let pr = Math.min(window.devicePixelRatio || 1, o.maxDpr || 2);
    const pw = w * s, ph = h * s;
    if (pw * ph * pr * pr > maxPixels) pr = Math.sqrt(maxPixels / (pw * ph));
    r.setPixelRatio(pr);
    r.setSize(Math.max(2, Math.round(pw)), Math.max(2, Math.round(ph)), false);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    o.onSize && o.onSize(r);
  };
  size();
  return { r, size };
}

export function studioEnv(r) {
  const pm = new THREE.PMREMGenerator(r);
  const tex = pm.fromScene(new RoomEnvironment(r), 0.035).texture;
  pm.dispose(); return tex;
}

export function canvasTex(c, r, repeat) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = r ? r.capabilities.getMaxAnisotropy() : 8;
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
  return t;
}
export function dataTex(c, r) { const t = new THREE.CanvasTexture(c); t.anisotropy = r ? r.capabilities.getMaxAnisotropy() : 8; t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; }
export function makeCanvas(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h); return c; }
export function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
export function radialTex(inner = 'rgba(8,40,28,.5)', mid = 'rgba(8,40,28,.14)') {
  const c = makeCanvas(256, 256, (x) => { const g = x.createRadialGradient(128, 128, 0, 128, 128, 128); g.addColorStop(0, inner); g.addColorStop(.5, mid); g.addColorStop(1, 'rgba(8,40,28,0)'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); });
  return new THREE.CanvasTexture(c);
}
export const loadImg = src => new Promise(res => { const i = new Image(); i.decoding = 'async'; i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });

/* drag-to-rotate with inertia */
export function dragRotate(el, st) {
  let down = false, px = 0;
  el.addEventListener('pointerdown', e => { down = true; px = e.clientX; st.vel = 0; el.setPointerCapture?.(e.pointerId); el.style.cursor = 'grabbing'; st.touched = performance.now(); });
  el.addEventListener('pointermove', e => { if (!down) return; const dx = (e.clientX - px) / ((window.DECK && DECK.scale) || 1); px = e.clientX; st.rot += dx * .008; st.vel = dx * .008; st.touched = performance.now(); });
  const up = () => { down = false; el.style.cursor = ''; };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
}

/* single render loop — renders the active slide, plus the outgoing one while it fades */
let last = performance.now(), leaving = null, leaveUntil = 0;
window.DECK && (DECK.onChange = (from, to) => { leaving = from; leaveUntil = performance.now() + 1000; });
function loop(t) {
  requestAnimationFrame(loop);
  const raw = Math.max(0, (t - last) / 1000); last = t;
  const dt = Math.min(1 / 20, raw);
  const cur = window.DECK ? DECK.cur() : null;
  const s = scenes[cur];
  if (s && s.ready) s.tick(dt, t / 1000);
  if (leaving && leaving !== cur && t < leaveUntil && scenes[leaving]?.ready) scenes[leaving].tick(dt, t / 1000);
}
requestAnimationFrame(loop);
export function register(id, S) { scenes[id] = S; DECK.hooks[id] = S; }
