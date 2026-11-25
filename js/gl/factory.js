/* Laactiva deck — slide 11: high-detail 3D factory */
import { THREE, RoundedBoxGeometry, FONT, ss, ease, mkRenderer, canvasTex, dataTex, makeCanvas, rr, register } from './common.js';
import { EffectComposer } from '../../vendor/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../../vendor/three/examples/jsm/postprocessing/RenderPass.js';
import { GTAOPass } from '../../vendor/three/examples/jsm/postprocessing/GTAOPass.js';
import { OutputPass } from '../../vendor/three/examples/jsm/postprocessing/OutputPass.js';
import { SimplexNoise } from '../../vendor/three/examples/jsm/math/SimplexNoise.js';
import { mergeGeometries } from '../../vendor/three/examples/jsm/utils/BufferGeometryUtils.js';
import { logoCanvas } from './product.js';

const $ = s => document.querySelector(s);
const W = 1700, H = 690;
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- procedural textures ---------- */
function noiseFill(x, w, h, base, amt, n) { x.fillStyle = base; x.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { const v = Math.random(); x.fillStyle = v > .5 ? `rgba(255,255,255,${amt * Math.random()})` : `rgba(0,0,0,${amt * Math.random()})`; const s = 1 + Math.random() * 2.5; x.fillRect(Math.random() * w, Math.random() * h, s, s); } }
const TX = {
  facade: () => makeCanvas(1024, 1024, (x, w, h) => { noiseFill(x, w, h, '#eef0ec', .035, 9000); x.fillStyle = 'rgba(120,130,125,.32)'; for (let i = 0; i <= 4; i++) x.fillRect(i * 256 - 1, 0, 3, h); for (let j = 0; j <= 8; j++) x.fillRect(0, j * 128 - 1, w, 2); }),
  clad: () => makeCanvas(1024, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, 32, 0); g.addColorStop(0, '#d7dcdd'); g.addColorStop(.25, '#f3f5f5'); g.addColorStop(.5, '#e3e7e8'); g.addColorStop(.75, '#c9cfd1'); g.addColorStop(1, '#d7dcdd'); x.fillStyle = g; x.fillRect(0, 0, w, h); }),
  cladBump: () => makeCanvas(1024, 64, (x, w, h) => { for (let i = 0; i < w; i += 32) { const g = x.createLinearGradient(i, 0, i + 32, 0); g.addColorStop(0, '#666'); g.addColorStop(.3, '#fff'); g.addColorStop(.6, '#fff'); g.addColorStop(.9, '#666'); x.fillStyle = g; x.fillRect(i, 0, 32, h); } }),
  roof: () => makeCanvas(512, 512, (x, w, h) => { noiseFill(x, w, h, '#d9dcdc', .03, 3000); x.fillStyle = 'rgba(90,95,95,.35)'; for (let i = 0; i < w; i += 32) x.fillRect(i, 0, 2, h); }),
  asphalt: () => makeCanvas(1024, 1024, (x, w, h) => { noiseFill(x, w, h, '#6c7175', .09, 60000); for (let i = 0; i < 18; i++) { x.fillStyle = `rgba(40,42,44,${Math.random() * .12})`; x.beginPath(); x.ellipse(Math.random() * w, Math.random() * h, 60 + Math.random() * 160, 30 + Math.random() * 90, Math.random() * 3, 0, 7); x.fill(); } }),
  road: () => makeCanvas(1024, 1024, (x, w, h) => noiseFill(x, w, h, '#4d5256', .08, 60000)),
  paving: () => makeCanvas(512, 512, (x, w, h) => { noiseFill(x, w, h, '#d3cdc0', .05, 6000); x.fillStyle = 'rgba(110,100,85,.25)'; for (let i = 0; i <= w; i += 64) { x.fillRect(i, 0, 2, h); x.fillRect(0, i, w, 2); } }),
  sand: () => makeCanvas(1024, 1024, (x, w, h) => { noiseFill(x, w, h, '#dfcaa2', .06, 70000); x.strokeStyle = 'rgba(160,125,80,.07)'; x.lineWidth = 3; for (let i = 0; i < 70; i++) { const y = Math.random() * h; x.beginPath(); x.moveTo(0, y); for (let k = 0; k <= w; k += 32) x.lineTo(k, y + Math.sin(k / 60 + i) * 8); x.stroke(); } }),
  gravel: () => makeCanvas(512, 512, (x, w, h) => { noiseFill(x, w, h, '#c9b58f', .0, 0); for (let i = 0; i < 9000; i++) { const c = 140 + Math.random() * 80 | 0; x.fillStyle = `rgb(${c},${c * .9 | 0},${c * .75 | 0})`; x.beginPath(); x.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 2.2, 0, 7); x.fill(); } }),
  steel: () => makeCanvas(1024, 1024, (x, w, h) => { const g = x.createLinearGradient(0, 0, w, 0); for (let i = 0; i <= 12; i++) g.addColorStop(i / 12, i % 2 ? '#f1f3f4' : '#e2e6e8'); x.fillStyle = g; x.fillRect(0, 0, w, h); x.fillStyle = 'rgba(0,0,0,.06)'; for (let i = 0; i < 3000; i++) x.fillRect(Math.random() * w, Math.random() * h, 40 + Math.random() * 80, 1); x.fillStyle = 'rgba(80,90,95,.22)'; for (let j = 0; j < h; j += 128) x.fillRect(0, j, w, 3); for (let i = 0; i < w; i += 170) x.fillRect(i, 0, 2, h); }),
  bark: () => makeCanvas(128, 512, (x, w, h) => { x.fillStyle = '#8b6c4a'; x.fillRect(0, 0, w, h); for (let j = 0; j < h; j += 18) { x.fillStyle = `rgba(60,40,25,${.35 + Math.random() * .2})`; x.fillRect(0, j, w, 6); x.fillStyle = 'rgba(200,170,130,.25)'; x.fillRect(0, j + 7, w, 3); } }),
  door: () => makeCanvas(256, 512, (x, w, h) => { x.fillStyle = '#9aa0a3'; x.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 24) { x.fillStyle = '#7d8386'; x.fillRect(0, y, w, 4); x.fillStyle = '#b3b8bb'; x.fillRect(0, y + 5, w, 2); } }),
  panel: () => makeCanvas(256, 256, (x, w, h) => { x.fillStyle = '#1c2c3c'; x.fillRect(0, 0, w, h); x.strokeStyle = '#5d7085'; x.lineWidth = 2; for (let i = 0; i <= w; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); } for (let j = 0; j <= h; j += 64) { x.beginPath(); x.moveTo(0, j); x.lineTo(w, j); x.stroke(); } x.strokeStyle = '#c9d2d8'; x.lineWidth = 6; x.strokeRect(0, 0, w, h); })
};

/* box whose UVs are scaled to world metres (tile = metres per texture repeat) */
function boxUV(w, h, d, tu, tv = tu) {
  const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv;
  const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) { const i = f * 4 + v; uv.setXY(i, uv.getX(i) * dims[f][0] / tu, uv.getY(i) * dims[f][1] / tv); }
  return g;
}

/* palm frond: real leaflet geometry (no alpha → clean AO & shadows) */
function frondGeometry(L = 4.4) {
  const pos = [], rib = t => V(0, 1.3 * t - 2.1 * t * t, t * L);
  const steps = 22;
  for (let i = 1; i < steps; i++) {
    const t0 = i / steps, t1 = (i + .8) / steps, p0 = rib(t0), p1 = rib(Math.min(1, t1));
    const len = .95 * Math.sin(Math.PI * Math.min(1, t0 * 1.05)) + .12;
    for (const s of [-1, 1]) { const tip = p0.clone().add(V(s * len, -.38 * len, .32 * len)); pos.push(p0.x, p0.y, p0.z, p1.x, p1.y, p1.z, tip.x, tip.y, tip.z); }
  }
  for (let i = 0; i < steps; i++) { const a = rib(i / steps), b = rib((i + 1) / steps); pos.push(a.x - .03, a.y, a.z, b.x - .03, b.y, b.z, a.x + .03, a.y, a.z); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
}
function canopyGeometry() {
  const parts = [[0, 0, 0, 2.1], [1.3, -.2, .4, 1.5], [-1.2, -.1, -.3, 1.6], [.2, .5, -1.1, 1.4], [-.3, .3, 1.1, 1.4]].map(([x, y, z, r]) => {
    const g = new THREE.IcosahedronGeometry(r, 2), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const k = 1 + (Math.sin(p.getX(i) * 3.1 + z) * Math.cos(p.getY(i) * 2.7 + x) * .1); p.setXYZ(i, p.getX(i) * k + x, p.getY(i) * k * .85 + y, p.getZ(i) * k + z); }
    return g;
  });
  const g = mergeGeometries(parts); g.computeVertexNormals(); return g;
}

async function build() {
  const cv = $('#glFac');
  let composer = null, gtao = null;
  const { r, size } = mkRenderer(cv, W, H, {
    alpha: false, tone: THREE.ACESFilmicToneMapping, exposure: .95, shadows: true, maxDpr: 2, maxPixels: 5.2e6,
    onSize: (rr_) => { if (composer) { const v = rr_.getSize(new THREE.Vector2()); composer.setPixelRatio(rr_.getPixelRatio()); composer.setSize(v.x, v.y); } }
  });
  const scene = new THREE.Scene();
  const HAZE = 0xe3ddcd; scene.fog = new THREE.Fog(HAZE, 500, 2600);
  const cam = new THREE.PerspectiveCamera(33, W / H, .5, 6000);

  /* ---- sky dome + matching environment ---- */
  const sunDir = V(.52, .62, .58).normalize();
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { top: { value: new THREE.Color(0x5f9fd3) }, mid: { value: new THREE.Color(0xa9cbe3) }, hor: { value: new THREE.Color(0xeee6d4) }, sun: { value: sunDir } },
    vertexShader: 'varying vec3 vW;void main(){vW=normalize((modelMatrix*vec4(position,1.)).xyz);gl_Position=projectionMatrix*viewMatrix*modelMatrix*vec4(position,1.);gl_Position.z=gl_Position.w;}',
    fragmentShader: 'uniform vec3 top;uniform vec3 mid;uniform vec3 hor;uniform vec3 sun;varying vec3 vW;void main(){float h=max(vW.y,0.);vec3 c=mix(hor,mid,smoothstep(0.,.18,h));c=mix(c,top,smoothstep(.18,.75,h));float s=max(dot(vW,sun),0.);c+=vec3(1.,.93,.78)*(pow(s,600.)*3.+pow(s,12.)*.22);if(vW.y<0.)c=hor;gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(4000, 48, 24), skyMat); scene.add(sky);
  { const pm = new THREE.PMREMGenerator(r); const es = new THREE.Scene(); es.add(new THREE.Mesh(new THREE.SphereGeometry(100, 48, 24), skyMat.clone())); const gnd = new THREE.Mesh(new THREE.CircleGeometry(100, 32), new THREE.MeshBasicMaterial({ color: 0xcdb892 })); gnd.rotation.x = -Math.PI / 2; gnd.position.y = -1; es.add(gnd); scene.environment = pm.fromScene(es, .02).texture; scene.environmentIntensity = .75; pm.dispose(); }

  /* ---- lights ---- */
  scene.add(new THREE.HemisphereLight(0xcfe3f5, 0xc7b18a, .9));
  const sun = new THREE.DirectionalLight(0xfff0d8, 3.4); sun.position.copy(sunDir).multiplyScalar(260).add(V(5, 0, 0)); sun.target.position.set(5, 0, 0);
  sun.castShadow = true; sun.shadow.mapSize.set(4096, 4096); Object.assign(sun.shadow.camera, { left: -135, right: 135, top: 110, bottom: -110, near: 60, far: 520 }); sun.shadow.bias = -.00025; sun.shadow.normalBias = .035;
  scene.add(sun, sun.target);

  /* ---- materials ---- */
  const tex = (key, rep, colorSpace = true) => { const c = TX[key](); const t = colorSpace ? canvasTex(c, r, true) : dataTex(c, r); if (rep) t.repeat.set(rep[0], rep[1]); return t; };
  const M = o => new THREE.MeshStandardMaterial(o), MP = o => new THREE.MeshPhysicalMaterial(o);
  const mFacade = M({ map: tex('facade'), roughness: .82 });
  const mWhite = M({ color: 0xf4f5f2, roughness: .7 }), mTrim = M({ color: 0xdfe3e0, roughness: .75 });
  const cladT = tex('clad'), cladB = tex('cladBump', null, false);
  const mClad = M({ map: cladT, bumpMap: cladB, bumpScale: 2.2, roughness: .55, metalness: .35 });
  const mRoof = M({ map: tex('roof'), roughness: .7, metalness: .25 });
  const mGreen = MP({ color: 0x1d5a3b, roughness: .4, metalness: .3, clearcoat: .4 });
  const mGlass = MP({ color: 0x1d3940, roughness: .05, metalness: .35, envMapIntensity: 1.7, clearcoat: 1 });
  const mSteel = MP({ map: tex('steel'), color: 0xffffff, roughness: .32, metalness: .55, envMapIntensity: 1.1, clearcoat: .4, clearcoatRoughness: .3 });
  const mSteel2 = M({ color: 0xdfe4e7, roughness: .35, metalness: .55 });
  const mDark = M({ color: 0x34393c, roughness: .6, metalness: .4 }), mBlack = M({ color: 0x1b1d1f, roughness: .85 });
  const mRubber = M({ color: 0x202224, roughness: .95 }), mYellow = M({ color: 0xe8b52a, roughness: .5 });
  const mAsph = M({ map: tex('asphalt'), roughness: .95 }), mRoad = M({ map: tex('road'), roughness: .95 });
  const mPave = M({ map: tex('paving'), roughness: .9 }), mCurb = M({ color: 0xd9d5cb, roughness: .85 });
  const mGravel = M({ map: tex('gravel'), roughness: 1 }), mSand = M({ map: tex('sand'), roughness: 1, vertexColors: true });
  const mPaint = M({ color: 0xf6f6f2, roughness: .6 }), mPaintY = M({ color: 0xf0c330, roughness: .6 });
  const mWall = M({ map: tex('facade'), color: 0xece6da, roughness: .9 });
  const mBark = M({ map: tex('bark'), roughness: .95 }), mFrond = M({ color: 0x4f7d34, roughness: .75, side: THREE.DoubleSide });
  const mLeaf = M({ color: 0xffffff, roughness: .85, flatShading: false });
  const mSolar = MP({ map: tex('panel'), roughness: .15, metalness: .5, clearcoat: 1 });

  const root = new THREE.Group(); scene.add(root);
  const add = (geo, mat, x, y, z, p = root, cast = true) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; p.add(m); return m; };
  const box = (w, h, d, mat, x, y, z, p, cast, tile) => add(tile ? boxUV(w, h, d, tile) : new THREE.BoxGeometry(w, h, d), mat, x, y, z, p, cast);
  const cyl = (rt, rb, h, mat, x, y, z, seg = 32, p) => add(new THREE.CylinderGeometry(rt, rb, h, seg), mat, x, y, z, p);
  const inst = (geo, mat, list, cast = true) => { const m = new THREE.InstancedMesh(geo, mat, list.length); const o = new THREE.Object3D(); list.forEach((f, i) => { f(o); o.updateMatrix(); m.setMatrixAt(i, o.matrix); o.position.set(0, 0, 0); o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1); }); m.castShadow = cast; m.receiveShadow = true; root.add(m); return m; };
  const sign = (w, h, draw, x, y, z, ry = 0, p = root) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M({ map: canvasTex(makeCanvas(Math.round(w * 160), Math.round(h * 160), draw), r), roughness: .6, transparent: true })); m.position.set(x, y, z); m.rotation.y = ry; p.add(m); return m; };
  const arText = (txt, size, col = '#173f2c', bg = '#ffffff') => (x, w, h) => { if (bg) { x.fillStyle = bg; x.fillRect(0, 0, w, h); } x.fillStyle = col; x.font = `700 ${size}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.direction = 'rtl'; x.fillText(txt, w / 2, h / 2 + size * .06); };
  const LOGO = logoCanvas(1024, 820);

  /* ---- terrain: flat pad, dunes, mountain ring ---- */
  const noise = new SimplexNoise();
  { const g = new THREE.PlaneGeometry(3400, 3400, 220, 220); g.rotateX(-Math.PI / 2); const p = g.attributes.position, col = []; const uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i); const d = Math.hypot(x - 5, (z - 10) * 1.2); const m = ss(210, 520, d); const hgt = (noise.noise(x * .004, z * .004) * 9 + noise.noise(x * .012, z * .012) * 3 + Math.abs(noise.noise(x * .0022, z * .0035)) * 18) * m; p.setY(i, hgt - .05); const v = .93 + noise.noise(x * .01, z * .01) * .05 + hgt * .003; col.push(v, v * .985, v * .95); uv.setXY(i, uv.getX(i) * 110, uv.getY(i) * 110); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals();
    const ground = new THREE.Mesh(g, mSand); ground.receiveShadow = true; root.add(ground); }
  { const g = new THREE.RingGeometry(1300, 2300, 400, 20); g.rotateX(-Math.PI / 2); const p = g.attributes.position, col = [];
    for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), d = Math.hypot(x, z), a = Math.atan2(z, x); const prof = Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, (d - 1300) / 1000))), .8); const n1 = .5 + .5 * noise.noise(Math.cos(a) * 2.2, Math.sin(a) * 2.2), n2 = 1 - Math.abs(noise.noise(Math.cos(a) * 6, Math.sin(a) * 6 + d * .0015)); const h = (n1 * 150 + n2 * 55 + noise.noise(x * .004, z * .004) * 18) * prof * (z < 300 ? 1 : .45); p.setY(i, Math.max(0, h) - 2); const k = .62 + Math.min(.12, h / 1600) + noise.noise(x * .01, z * .01) * .03; col.push(k * 1.0, k * .84, k * .68); }
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals(); root.add(new THREE.Mesh(g, M({ vertexColors: true, roughness: 1 }))); }

  /* ---- site ground: asphalt pad, paving, curbs, beds ---- */
  box(152, .3, 102, mAsph, 5, .15, 0, root, false, 14);
  box(40, .34, 7, mPave, 0, .17, 22, root, false, 8); // entrance plaza
  box(20, .5, 12, mAsph, -12, .23, 56.5, root, false, 14); // gate driveway
  [[-46, 47.5, 44, 5], [41, 47.5, 76, 5], [-15, 20.2, 6, 1.4], [12.5, 20.2, 11, 1.4]].forEach(([x, z, w, d]) => { box(w, .45, d, mGravel, x, .22, z, root, false, 4); box(w + .4, .5, .4, mCurb, x, .25, z - d / 2, root, false); });
  // road, sidewalks, landscape strip, median
  box(3400, .2, 16, mRoad, 0, .1, 70, root, false, 16);
  box(3400, .45, 4, mPave, 0, .22, 59.5, root, false, 8); box(3400, .45, 4, mPave, 0, .22, 80, root, false, 8);
  box(3400, .5, .35, mCurb, 0, .25, 61.6, root, false); box(3400, .5, .35, mCurb, 0, .25, 77.9, root, false);
  box(3400, .3, 5.4, mGravel, 0, .16, 54.8, root, false, 4);
  const dash = []; for (let i = 0; i < 200; i++) dash.push(o => { o.position.set(-1600 + i * 16, .22, 70); });
  inst(new THREE.BoxGeometry(6, .03, .3), mPaint, dash, false);
  const edgeL = []; [62.4, 77.6].forEach(z => edgeL.push(o => { o.position.set(0, .215, z); }));
  inst(new THREE.BoxGeometry(3400, .02, .22), mPaint, edgeL, false);
  // parking bays + arrows
  const bays = []; for (let i = 0; i < 10; i++) bays.push(o => { o.position.set(-44 + i * 5, .31, 31); });
  inst(new THREE.BoxGeometry(.18, .02, 6), mPaint, bays, false);
  box(46, .02, .18, mPaint, -21.5, .31, 28, root, false);
  const cross = []; for (let i = 0; i < 7; i++) cross.push(o => { o.position.set(-12, .32, 44 + i * 1.1); });
  inst(new THREE.BoxGeometry(6, .02, .55), mPaint, cross, false);

  /* ---- perimeter: rear/side walls, front low wall + railing ---- */
  box(152, 2.8, .6, mWall, 5, 1.4, -51, root, true, 6); box(.6, 2.8, 102, mWall, -71, 1.4, 0, root, true, 6); box(.6, 2.8, 102, mWall, 81, 1.4, 0, root, true, 6);
  const piers = [];
  const frontSeg = (x0, x1) => { box(x1 - x0, 1.1, .6, mWall, (x0 + x1) / 2, .55, 51, root, true, 6); box(x1 - x0, .12, .1, mDark, (x0 + x1) / 2, 2.9, 51, root, false); for (let x = x0; x <= x1 + .01; x += 5) piers.push(o => o.position.set(x, 1.6, 51)); };
  frontSeg(-71, -22); frontSeg(-2, 81);
  inst(new RoundedBoxGeometry(.7, 3.2, .7, 2, .06), mWall, piers);
  const bars = []; [[-71, -22], [-2, 81]].forEach(([a, b]) => { for (let x = a; x < b; x += .25) bars.push(o => o.position.set(x, 2, 51)); });
  inst(new THREE.BoxGeometry(.05, 1.8, .05), mDark, bars, false);

  /* ---- office block ---- */
  const off = new THREE.Group(); root.add(off);
  box(36, 18, 20, mFacade, 0, 9.3, 8, off, true, 8);
  box(36.8, 1.1, 20.8, mTrim, 0, 18.85, 8, off);
  [4.5, 11].forEach(y => {
    [[-13.2, 9.6], [11.8, 11.4]].forEach(([x, w]) => { box(w, 3.4, .35, mGlass, x, y, 18.05, off, false); for (let i = 0; i <= Math.round(w / 1.2); i++) box(.14, 3.4, .5, mDark, x - w / 2 + i * w / Math.round(w / 1.2), y, 18.2, off, false); box(w + .4, .25, .9, mTrim, x, y - 1.82, 18.3, off); });
    box(.35, 3.4, 16, mGlass, -18.05, y, 8, off, false); box(.35, 3.4, 16, mGlass, 18.05, y, 5, off, false);
  });
  for (let i = 0; i < 9; i++) box(.3, 17, .9, mTrim, 6.8 + i * 1.3, 9, 18.5, off);
  // green portal + curtain wall + canopy + steps
  box(1.4, 12.2, 2.4, mGreen, -10.3, 6.1, 18.9, off); box(1.4, 12.2, 2.4, mGreen, 5.9, 6.1, 18.9, off); box(17.6, 1.5, 2.4, mGreen, -2.2, 11.95, 18.9, off);
  box(14.8, 11.2, .3, mGlass, -2.2, 5.6, 18.4, off, false);
  for (let i = 0; i <= 8; i++) box(.12, 11.2, .35, mDark, -9.6 + i * 1.85, 5.6, 18.6, off, false);
  for (let j = 0; j < 3; j++) box(14.8, .12, .35, mDark, -2.2, 3.2 + j * 3, 18.6, off, false);
  box(4.2, 3.2, .15, MP({ color: 0x0f2528, roughness: .1, metalness: .4 }), -2.2, 1.9, 18.7, off, false);
  box(18.4, .45, 5, mGreen, -2.2, 12.9, 21, off);
  [0, 1, 2].forEach(i => box(12 - i * .8, .22, 1.2, mPave, -2.2, .38 + i * .22, 22.4 - i * .7, off));
  sign(5.6, 4.48, (x, w, h) => { x.drawImage(LOGO, 0, 0, w, h); }, -2.2, 15.75, 18.06, 0, off);
  // rooftop plant
  [[-10, 4], [-4, 12], [8, 3]].forEach(([x, z]) => { const u = new THREE.Group(); u.position.set(x, 19.4, z); off.add(u); box(4.6, 1.8, 3, mSteel2, 0, .9, 0, u); for (const k of [-1, 1]) { cyl(.9, .9, .12, mDark, k * 1.2, 1.86, 0, 32, u); } });
  box(36, 1.1, .12, mTrim, 0, 19.95, -1.9, off); box(36, 1.1, .12, mTrim, 0, 19.95, 17.9, off);

  /* ---- production hall ---- */
  const hall = new THREE.Group(); root.add(hall);
  const HX = 42, HZ = -2, HW = 52, HD = 40, HH = 13;
  box(HW, HH, HD, mClad, HX, HH / 2 + .3, HZ, hall, true, 8);
  box(HW + .6, .8, HD + .6, mTrim, HX, HH + .7, HZ, hall);
  box(HW - 1, 1.2, .25, M({ color: 0xcfe0e6, roughness: .2, metalness: .1, transparent: true, opacity: .85 }), HX, HH - 1.3, HZ + HD / 2 + .05, hall, false);
  box(HW - 1, .3, HD - 1, mRoof, HX, HH + .45, HZ, hall, false, 8);
  for (let i = 0; i < 4; i++) box(1.6, .5, HD - 6, M({ color: 0xe8f1f3, roughness: .2, metalness: .1 }), HX - 18 + i * 12, HH + .85, HZ, hall);
  // solar array on hall roof
  const sol = []; for (let ix = 0; ix < 9; ix++) for (let iz = 0; iz < 6; iz++) if (ix % 3 !== 1 || iz % 2) sol.push(o => { o.position.set(HX - 21 + ix * 5.2, HH + 1.5, HZ - 15 + iz * 5.6); o.rotation.x = -.35; });
  inst(new THREE.BoxGeometry(4.6, .12, 2.4), mSolar, sol);
  // docks
  const dockTxt = ['التعبئة والتغليف', 'الإنتاج', 'استلام المواد الخام'];
  [30, 44, 58].forEach((x, i) => {
    box(8.4, 9, .9, mRubber, x, 4.8, 18.4, hall);
    box(6.8, 7.8, .3, M({ map: tex('door', [1, 2.2]), roughness: .6, metalness: .3 }), x, 4.3, 18.75, hall, false);
    box(7.4, .9, 3.2, mDark, x, 1, 19.6, hall);
    [-2.6, 2.6].forEach(dx => { box(.5, .7, .4, mRubber, x + dx, 1.3, 21.3, hall); box(.25, 1.1, .25, mYellow, x + dx * 1.7, .85, 22.5, hall); });
    sign(9, 1.6, arText(dockTxt[i], 150), x, 10.9, 18.5, 0, hall);
    const lamp = cyl(.18, .18, .3, M({ color: 0xffffff, emissive: 0xfff3d0, emissiveIntensity: .6 }), x, 9.8, 18.9, 16, hall); lamp.rotation.x = Math.PI / 2;
  });
  box(40, .45, 4, mTrim, 44, 9.6, 20.2, hall);
  for (let i = 0; i < 5; i++) box(.25, .25, 4, mDark, 26 + i * 9, 9.3, 20.2, hall);
  // downpipes & personnel door
  [17, 67].forEach(x => cyl(.18, .18, 13, mTrim, x, 6.8, 18.25, 12, hall));
  box(2, 3, .3, mGreen, 67.3, 1.8, 10, hall).rotation.y = Math.PI / 2;
  sign(12, 1.4, arText('خط إنتاج حمض اللاكتيك', 150, '#ffffff', '#1d5a3b'), HX, 11.35, HZ - HD / 2 - .06, Math.PI, hall);

  /* ---- branded silos with ladder cages & platform ---- */
  const siloArt = makeCanvas(1400, 1800, (x, w, h) => { x.clearRect(0, 0, w, h); x.drawImage(LOGO, w / 2 - 330, 60, 660, 528); x.fillStyle = '#1b4f35'; x.textAlign = 'center'; x.direction = 'rtl'; x.font = `800 118px ${FONT}`; x.fillText('من مخلفات الطعام...', w / 2, 860); x.fillText('إلى مستقبل مستدام', w / 2, 1030); });
  const siloTex = canvasTex(siloArt, r);
  [-34.5, -25].forEach((x, si) => {
    const Rs = 4.3, Hs = 24;
    const sGeo = new THREE.CylinderGeometry(Rs, Rs, Hs, 96, 1, true); const uv = sGeo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 3, uv.getY(i) * 3);
    add(sGeo, mSteel, x, Hs / 2 + 1, -4);
    add(new THREE.ConeGeometry(Rs + .05, 3, 96, 1, true), mSteel2, x, Hs + 2.5, -4);
    cyl(Rs + .35, Rs + .45, 1.2, mTrim, x, .6, -4, 96);
    for (let k = 0; k < 4; k++) { const t = add(new THREE.TorusGeometry(Rs + .03, .09, 10, 96), mSteel2, x, 4 + k * 5.6, -4); t.rotation.x = Math.PI / 2; }
    const dec = new THREE.Mesh(new THREE.CylinderGeometry(Rs + .02, Rs + .02, 9.5, 96, 1, true, -.66, 1.32), M({ map: siloTex, transparent: true, roughness: .5, polygonOffset: true, polygonOffsetFactor: -2 })); dec.position.set(x, 15.2, -4); root.add(dec);
    // top platform ring + railing
    const plat = add(new THREE.TorusGeometry(Rs - .6, .08, 8, 64), mDark, x, Hs + 3.6, -4); plat.rotation.x = Math.PI / 2;
    const posts = []; for (let a = 0; a < 16; a++) posts.push(o => { const ang = a / 16 * Math.PI * 2; o.position.set(x + Math.cos(ang) * (Rs - .6), Hs + 3.1, -4 + Math.sin(ang) * (Rs - .6)); });
    inst(new THREE.CylinderGeometry(.05, .05, 1.1, 6), mDark, posts, false);
    // caged ladder on the left side
    const lx = x - Rs - .55, rails = [];
    [-.35, .35].forEach(dz => rails.push(o => { o.position.set(lx, Hs / 2 + 2, -4 + dz); }));
    inst(new THREE.CylinderGeometry(.05, .05, Hs + 2, 6), mDark, rails, false);
    const hoops = []; for (let y = 3; y < Hs + 2; y += 1.2) hoops.push(o => { o.position.set(lx - .3, y, -4); o.rotation.x = Math.PI / 2; });
    inst(new THREE.TorusGeometry(.62, .035, 6, 20, Math.PI * 1.25), mDark, hoops, false);
  });
  box(10.6, .35, 1.8, mDark, -29.75, 27.5, -4); [-.85, .85].forEach(dz => box(10.6, .06, .06, mDark, -29.75, 28.6, -4 + dz, root, false));
  // pipes from silos to hall
  const pipeMat = MP({ color: 0xd4dadd, roughness: .25, metalness: .9 });
  const pipe = (pts, rad = .32) => add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', .05), 80, rad, 14, false), pipeMat, 0, 0, 0);
  pipe([V(-25, 26, -4), V(-25, 29, -4), V(-10, 29, -4), V(-10, 18.5, -4), V(16, 18.5, -4), V(19, 13.4, -4)], .3);

  /* ---- fermentation tanks on legs + catwalk + pipe rack ---- */
  [-46, -37, -28, -19].forEach(x => {
    const z = -33; add(new THREE.CylinderGeometry(3, 3, 11, 64), mSteel, x, 10.5, z);
    add(new THREE.SphereGeometry(3, 64, 16, 0, Math.PI * 2, 0, Math.PI / 2), mSteel2, x, 16, z).scale.y = .35;
    add(new THREE.ConeGeometry(3, 2.6, 64, 1, true), mSteel2, x, 3.7, z).rotation.x = Math.PI;
    [[2.1, 2.1], [-2.1, 2.1], [2.1, -2.1], [-2.1, -2.1]].forEach(([a, b]) => box(.3, 5, .3, mDark, x + a, 2.5, z + b));
    for (let k = 0; k < 2; k++) { const t = add(new THREE.TorusGeometry(3.03, .07, 8, 64), mSteel2, x, 7 + k * 6, z); t.rotation.x = Math.PI / 2; }
    pipe([V(x, 2.3, z), V(x, 1.4, z + 1.5), V(x, 1.4, z + 5), V(x + 2, 1.4, z + 6)], .18);
  });
  box(34, .3, 2.2, mDark, -32.5, 17, -28.6); for (let x = -49; x <= -16; x += 3) box(.06, 1.1, .06, mDark, x, 17.6, -27.6, root, false); box(34, .06, .06, mDark, -32.5, 18.1, -27.6, root, false);
  for (let x = -46; x <= 14; x += 8) { box(.4, 11, .4, mDark, x, 5.5, -24.5); box(.4, 11, .4, mDark, x, 5.5, -21.5); box(.4, .5, 3.4, mDark, x, 11, -23); }
  [[-23.4, 11.6, .38], [-22.6, 11.6, .3], [-23, 12.3, .22]].forEach(([z, y, rad]) => pipe([V(-46, y, z), V(15.5, y, z)], rad));
  // utility building, transformer, water tank
  box(12, 7, 12, mFacade, -56, 3.8, 8, root, true, 8); box(12.6, .7, 12.6, mTrim, -56, 7.6, 8); box(4, 3.2, .2, mGreen, -56, 1.9, 14.1);
  box(5, 3, 3, M({ color: 0x8c979b, roughness: .5, metalness: .6 }), -60, 1.8, -12); cyl(3, 3, 7, M({ color: 0x2f6d4f, roughness: .5, metalness: .3 }), -58, 3.8, -30, 48);

  /* ---- gatehouse, canopy, barrier, flags, brand wall ---- */
  box(6, 3.6, 5, mFacade, -26, 2.1, 45, root, true, 8); box(6.6, .45, 5.6, mGreen, -26, 4.15, 45); box(4.2, 1.6, .15, mGlass, -26, 2.6, 47.6, root, false); box(.15, 1.6, 3.2, mGlass, -22.95, 2.6, 45, root, false);
  box(22, .6, 12, mTrim, -12, 6.6, 51); box(22.2, .5, .5, mGreen, -12, 6.2, 57.1); [[-22, 46], [-2, 46], [-22, 56], [-2, 56]].forEach(([x, z]) => cyl(.25, .25, 6.3, mTrim, x, 3.2, z, 16));
  const bar = new THREE.Group(); bar.position.set(-21, 1.35, 51.8); root.add(bar);
  box(15, .3, .3, M({ map: canvasTex(makeCanvas(512, 16, (x, w, h) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#ffffff' : '#c8262f'; x.fillRect(i * 64, 0, 64, h); } }), r), roughness: .5 }), 7.5, 0, 0, bar);
  box(.9, 1.6, .9, mYellow, -21, .8, 51.8);
  const flagMat = M({ map: canvasTex(makeCanvas(960, 600, (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.fillStyle = '#1d5a3b'; x.fillRect(0, h - 70, w, 70); x.drawImage(LOGO, w / 2 - 250, 50, 500, 400); }), r), roughness: .8, side: THREE.DoubleSide });
  const flags = []; [-46, -41, -36].forEach(x => { cyl(.09, .12, 12, mSteel2, x, 6.3, 43, 12); const fg = new THREE.PlaneGeometry(3.6, 2.2, 24, 8); fg.translate(1.8, 0, 0); const f = new THREE.Mesh(fg, flagMat); f.position.set(x, 11, 43); f.castShadow = true; root.add(f); flags.push({ f, base: fg.attributes.position.array.slice(), ph: x }); });
  box(26, 4, 1, M({ color: 0xf1ede5, roughness: .9 }), 44, 2.3, 54.8); box(26.4, .35, 1.3, mGreen, 44, 4.45, 54.8);
  sign(25, 3.6, (x, w, h) => { x.fillStyle = '#f1ede5'; x.fillRect(0, 0, w, h); x.drawImage(LOGO, 70, 40, 400, 320); x.fillStyle = '#9fb4a8'; x.fillRect(560, 80, 6, 420); x.fillStyle = '#1b4f35'; x.textAlign = 'right'; x.direction = 'rtl'; x.font = `800 150px ${FONT}`; x.fillText('من مخلفات الطعام...', w - 140, 240); x.fillText('إلى مستقبل مستدام', w - 140, 440); }, 44, 2.3, 55.32);

  /* ---- vehicles ---- */
  const truckArt = canvasTex(makeCanvas(2048, 914, (x, w, h) => { x.fillStyle = '#f8f9f7'; x.fillRect(0, 0, w, h); x.fillStyle = '#1d5a3b'; x.fillRect(0, h - 150, w, 150); x.fillStyle = '#7ab72c'; x.fillRect(0, h - 184, w, 34); x.drawImage(LOGO, 1300, 110, 560, 448); x.fillStyle = '#1b4f35'; x.font = `700 120px ${FONT}`; x.textAlign = 'left'; x.fillText('From Waste', 150, 330); x.fillText('to the Worth', 150, 480); }), r);
  function truck() {
    const g = new THREE.Group(); const cab = MP({ color: 0xf2f4f3, roughness: .3, metalness: .3, clearcoat: 1 });
    add(new RoundedBoxGeometry(2.6, 3.3, 7.4, 3, .12), [M({ map: truckArt, roughness: .5 }), M({ map: truckArt, roughness: .5 }), mWhite, mWhite, mWhite, mWhite], 0, 2.75, -1.3, g).material[1].map = truckArt;
    add(new RoundedBoxGeometry(2.5, 2.7, 2.4, 4, .3), cab, 0, 2.25, 3.6, g);
    box(2.3, 1.1, .1, mGlass, 0, 2.95, 4.82, g, false); box(1.6, .7, .1, mBlack, 0, 1.4, 4.83, g, false);
    [-1.33, 1.33].forEach(sx => { box(.08, .9, 1.4, mGlass, sx, 2.9, 3.9, g, false); box(.12, .5, .12, mDark, sx * 1.12, 3.1, 4.6, g); });
    box(2.5, .5, 9.8, mDark, 0, .95, .1, g);
    const wg = new THREE.CylinderGeometry(.56, .56, .46, 28); wg.rotateZ(Math.PI / 2); const hub = new THREE.CylinderGeometry(.3, .3, .48, 16); hub.rotateZ(Math.PI / 2);
    [[-1.15, 3.4], [1.15, 3.4], [-1.15, -2.4], [1.15, -2.4], [-1.15, -3.6], [1.15, -3.6]].forEach(([x, z]) => { add(wg, mRubber, x, .56, z, g); add(hub, mSteel2, x, .56, z, g, false); });
    return g;
  }
  function car(color) {
    const g = new THREE.Group(); const paint = MP({ color, roughness: .25, metalness: .6, clearcoat: 1, clearcoatRoughness: .08 });
    add(new RoundedBoxGeometry(1.9, .85, 4.4, 4, .3), paint, 0, .75, 0, g); add(new RoundedBoxGeometry(1.7, .75, 2.3, 4, .3), mGlass, 0, 1.45, -.2, g);
    const wg = new THREE.CylinderGeometry(.36, .36, .3, 20); wg.rotateZ(Math.PI / 2); [[-.85, 1.35], [.85, 1.35], [-.85, -1.35], [.85, -1.35]].forEach(([x, z]) => add(wg, mRubber, x, .36, z, g));
    return g;
  }
  const t1 = truck(); t1.position.set(58, .3, 27.5); t1.rotation.y = Math.PI; root.add(t1);
  const t2 = truck(); t2.position.set(30, .3, 27.5); t2.rotation.y = Math.PI; root.add(t2);
  const movers = [{ o: truck(), z: 66, v: 13, d: 1, off: 0 }, { o: truck(), z: 74, v: 11, d: -1, off: 420 }, { o: car(0xf2f2f2), z: 74, v: 19, d: -1, off: 120 }, { o: car(0x2c3236), z: 66, v: 21, d: 1, off: 300 }, { o: car(0x8e9ba3), z: 66, v: 17, d: 1, off: 610 }];
  movers.forEach(m => { m.o.rotation.y = m.d > 0 ? Math.PI / 2 : -Math.PI / 2; root.add(m.o); });
  [0xf2f2f2, 0x9aa5ab, 0x2d3236, 0xb8342c, 0xf2f2f2, 0x5d6d78, 0x1f3f5b].forEach((c, i) => { const k = car(c); k.position.set(-41.5 + [0, 1, 2, 4, 5, 7, 8][i] * 5, .3, 31); k.rotation.y = i % 2 ? Math.PI : 0; root.add(k); });

  /* ---- street lamps ---- */
  const lamps = []; for (let x = -150; x <= 160; x += 32) if (x < -24 || x > 0) lamps.push([x, 57.6]); [[-45, 36], [-20, 36], [-60, 30], [72, 30], [72, 5]].forEach(p => lamps.push(p));
  inst(new THREE.CylinderGeometry(.1, .16, 9, 10), mDark, lamps.map(([x, z]) => o => o.position.set(x, 4.5, z)));
  inst(new THREE.BoxGeometry(.25, .18, 2.2), mDark, lamps.map(([x, z]) => o => o.position.set(x, 9, z - .9)));
  inst(new THREE.BoxGeometry(.5, .12, .9), M({ color: 0xffffff, emissive: 0xfff4dc, emissiveIntensity: .5 }), lamps.map(([x, z]) => o => o.position.set(x, 8.9, z - 1.9)), false);

  /* ---- vegetation (instanced) ---- */
  const palms = [];
  for (let x = -170; x <= 180; x += 19) if ((x < -30 || x > 6) && Math.abs(x - 44) > 15) palms.push([x + rnd(-1, 1), 54.8, rnd(.9, 1.1)]);
  for (let x = -220; x <= 230; x += 23) palms.push([x + rnd(-1, 1), 83.5, rnd(.85, 1.1)]);
  [[-16.5, 20.4], [-13.5, 20.4], [8.8, 20.4], [16, 20.4], [-68, 47.5], [-30, 47.5], [70, 47.5], [22, 47.5]].forEach(([x, z]) => palms.push([x, z, rnd(.8, .95)]));
  const trunkG = new THREE.CylinderGeometry(.24, .42, 8.5, 12, 6); trunkG.translate(0, 4.25, 0); { const p = trunkG.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) + Math.pow(y / 8.5, 2) * .5); } trunkG.computeVertexNormals(); const uv = trunkG.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * 4); }
  inst(trunkG, mBark, palms.map(([x, z, s]) => o => { o.position.set(x, .3, z); o.scale.setScalar(s); o.rotation.y = x; }));
  const frG = frondGeometry(); const fronds = [];
  palms.forEach(([x, z, s]) => { for (let i = 0; i < 13; i++) fronds.push(o => { o.position.set(x + .5 * s, .3 + 8.4 * s, z); o.rotation.set(rnd(-.25, .15), i / 13 * Math.PI * 2 + x, 0, 'YXZ'); o.scale.setScalar(s * rnd(.85, 1.1)); }); });
  const frM = inst(frG, mFrond, fronds);
  frM.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(fronds.length * 3).map((_, i) => [.85, 1, .8][i % 3] * rnd(.85, 1.1)), 3);
  const trees = [[-64, 22], [-64, -8], [-66, -40], [74, 36], [74, 22], [74, -24], [74, -44], [-40, -44], [-5, -44], [30, -44], [-50, 40], [60, 40]];
  inst(new THREE.CylinderGeometry(.22, .32, 3, 8), mBark, trees.map(([x, z]) => o => o.position.set(x, 1.8, z)));
  const cM = inst(canopyGeometry(), mLeaf, trees.map(([x, z]) => o => { o.position.set(x, 4.6, z); o.scale.setScalar(rnd(.8, 1.1)); o.rotation.y = x; }));
  cM.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(trees.length * 3).map((_, i) => [.27, .45, .2][i % 3] * rnd(.9, 1.12)), 3);
  const shrubs = []; for (let i = 0; i < 110; i++) { const side = i % 3; let x, z; if (side === 0) { x = rnd(-67, -25); z = rnd(45.8, 49.2); } else if (side === 1) { x = rnd(4, 78); z = rnd(45.8, 49.2); } else { x = Math.random() < .35 ? rnd(-17.6, -12.4) : rnd(7.4, 17.6); z = rnd(19.7, 20.7); } shrubs.push([x, z]); }
  for (let i = 0; i < 520; i++) { let x, z; do { x = rnd(-600, 600); z = rnd(-560, 520); } while (Math.abs(x - 5) < 92 && z > -62 && z < 92); shrubs.push([x, z, 1]); }
  const shG = new THREE.IcosahedronGeometry(.8, 1); { const p = shG.attributes.position; for (let i = 0; i < p.count; i++) { const k = 1 + Math.sin(p.getX(i) * 5) * Math.cos(p.getZ(i) * 4) * .15; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k * .7, p.getZ(i) * k); } shG.computeVertexNormals(); }
  const shM = inst(shG, mLeaf, shrubs.map(([x, z, far]) => o => { o.position.set(x, far ? .1 : .7, z); o.scale.set(rnd(.8, 1.6) * (far ? 1.3 : 1), rnd(.7, 1.2), rnd(.8, 1.6) * (far ? 1.3 : 1)); o.rotation.y = x * 3; }));
  shM.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(shrubs.length * 3).map((_, i) => { const far = shrubs[Math.floor(i / 3)][2]; return (far ? [.55, .55, .36] : [.36, .55, .25])[i % 3] * rnd(.85, 1.15); }), 3);

  /* ---- post-processing: MSAA + GTAO ---- */
  const v2 = r.getSize(new THREE.Vector2());
  composer = new EffectComposer(r, new THREE.WebGLRenderTarget(v2.x, v2.y, { type: THREE.HalfFloatType, samples: 4 }));
  composer.setPixelRatio(r.getPixelRatio()); composer.setSize(v2.x, v2.y);
  composer.addPass(new RenderPass(scene, cam));
  gtao = new GTAOPass(scene, cam, v2.x, v2.y);
  gtao.updateGtaoMaterial({ radius: 3.2, distanceExponent: 1.6, thickness: 3, scale: 1.15, samples: 16, distanceFallOff: 1, screenSpaceRadius: false });
  gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 5, radiusExponent: 1, rings: 2, samples: 16 });
  gtao.blendIntensity = .9;
  composer.addPass(gtao); composer.addPass(new OutputPass());

  /* ---- camera presets ---- */
  const VIEWS = {
    aerial: { p: V(-82, 80, 128), t: V(10, 3, 2) },
    front: { p: V(-6, 8, 112), t: V(8, 8.5, 8) },
    silos: { p: V(-96, 25, 56), t: V(-30, 13, -6) },
    docks: { p: V(98, 13, 76), t: V(40, 6, 14) },
    top: { p: V(6, 250, 36), t: V(6, 0, 2) }
  };
  const ORDER = ['aerial', 'front', 'silos', 'docks', 'top'];
  const tgt = VIEWS.aerial.t.clone(); cam.position.copy(VIEWS.aerial.p); cam.lookAt(tgt);
  const HS = [
    { n: 'المبنى الإداري', p: V(-2, 22, 12), v: 'aerial front top' },
    { n: 'صوامع الإنتاج', p: V(-29.7, 30.5, -4), v: 'aerial silos top' },
    { n: 'خط الإنتاج والتحميل', p: V(44, 16.5, 4), v: 'aerial front docks top' },
    { n: 'خزانات التخمير', p: V(-32, 19.5, -33), v: 'silos top' },
    { n: 'الطاقة الشمسية', p: V(52, 17, -8), v: 'docks top' },
    { n: 'البوابة الرئيسية', p: V(-12, 8.5, 50), v: 'front top' }
  ];
  const tagsEl = $('#facTags'); HS.forEach(h => { const d = document.createElement('div'); d.className = 'tagp'; d.innerHTML = `<span>${h.n}</span><i></i><b></b>`; tagsEl.appendChild(d); h.el = d; });
  const st = { from: null, to: null, t0: 0, dur: 2.2, moving: false, view: 'aerial', tour: false, arrived: 0, frames: 0, ftime: 0, low: false };
  const seg = $('#facSeg'), ind = seg.querySelector('.ind'), btns = [...seg.querySelectorAll('button')];
  const placeInd = () => { const b = btns.find(b => b.dataset.v === st.view); if (b) { ind.style.left = b.offsetLeft + 'px'; ind.style.width = b.offsetWidth + 'px'; } };
  function goView(k, user) {
    if (!VIEWS[k]) return; st.view = k; btns.forEach(b => b.classList.toggle('on', b.dataset.v === k)); placeInd();
    st.from = { p: cam.position.clone(), t: tgt.clone() }; st.to = VIEWS[k]; st.t0 = performance.now() / 1000; st.moving = true;
    st.dur = Math.min(3.2, 1.8 + st.from.p.distanceTo(st.to.p) / 200);
    if (user && st.tour) { st.tour = false; $('#facTour').classList.remove('on'); }
  }
  btns.forEach(b => b.addEventListener('click', () => goView(b.dataset.v, true)));
  $('#facTour').addEventListener('click', () => { st.tour = !st.tour; $('#facTour').classList.toggle('on', st.tour); if (st.tour) goView(ORDER[(ORDER.indexOf(st.view) + 1) % ORDER.length]); });
  const FAC = [{ src: 'assets/factory-front.jpg', cap: 'الواجهة الرئيسية للمصنع — صورة توقعية' }, { src: 'assets/factory-aerial.jpg', cap: 'منظر جوي للمصنع — صورة توقعية' }, { src: 'assets/factory-interior.jpg', cap: 'خط الإنتاج الداخلي — صورة توقعية' }];
  $('#facGal').addEventListener('click', () => DECK.LB.show(FAC, 0));

  const pv = V(0, 0, 0), off3 = V(0, 0, 0), Y = V(0, 1, 0);
  let shown = false;
  const S = {
    ready: true, goView, st,
    resize() { size(); placeInd(); },
    enter() { placeInd(); setTimeout(placeInd, 700); st.view = 'aerial'; cam.position.set(-150, 150, 230); tgt.copy(VIEWS.aerial.t); goView('aerial'); st.frames = 0; st.ftime = 0; },
    leave() { st.tour = false; $('#facTour').classList.remove('on'); },
    key(k) { const i = '12345'.indexOf(k); if (i >= 0) { goView(ORDER[i], true); return true; } if (k === 't' || k === 'T') { $('#facTour').click(); return true; } if (k === 'g' || k === 'G') { $('#facGal').click(); return true; } return false; },
    tick(dt, t) {
      const now = performance.now() / 1000;
      if (st.moving) {
        const k = Math.min(1, (now - st.t0) / st.dur), e = ease(k);
        cam.position.lerpVectors(st.from.p, st.to.p, e); cam.position.y += Math.sin(e * Math.PI) * Math.min(55, st.from.p.distanceTo(st.to.p) * .16);
        tgt.lerpVectors(st.from.t, st.to.t, e); if (k >= 1) { st.moving = false; st.arrived = now; }
      } else {
        const b = VIEWS[st.view]; off3.copy(b.p).sub(b.t).applyAxisAngle(Y, Math.sin((now - st.arrived) * .15) * .06 * (st.view === 'top' ? .4 : 1));
        cam.position.copy(b.t).add(off3); tgt.copy(b.t);
      }
      cam.lookAt(tgt);
      if (st.tour && !st.moving && now - st.arrived > 4.5) goView(ORDER[(ORDER.indexOf(st.view) + 1) % ORDER.length]);
      // life: traffic, barrier, flags
      const L = 1000; movers.forEach(m => { const x = ((t * m.v + m.off) % L) - L / 2; m.o.position.set(x * m.d, .3, m.z); });
      const g = t % 12; bar.rotation.z = g < 3 ? ss(0, 1.3, g) * 1.35 : g < 6 ? 1.35 : 1.35 * (1 - ss(6, 7.3, g));
      flags.forEach(f => { const pa = f.f.geometry.attributes.position; for (let i = 0; i < pa.count; i++) { const bx = f.base[i * 3]; pa.setZ(i, Math.sin(bx * 1.6 - t * 3.2 + f.ph) * .18 * (bx / 3.6)); } pa.needsUpdate = true; f.f.geometry.computeVertexNormals(); });
      // hotspot labels
      HS.forEach(h => { pv.copy(h.p).project(cam); const vis = !st.moving && h.v.includes(st.view) && pv.z < 1 && Math.abs(pv.x) < .92 && pv.y < .88 && pv.y > -.85; h.el.classList.toggle('show', vis); if (vis) { h.el.style.left = ((pv.x + 1) / 2 * W) + 'px'; h.el.style.top = ((1 - pv.y) / 2 * H) + 'px'; } });
      const t0 = performance.now();
      if (st.low) r.render(scene, cam); else composer.render(dt);
      // adaptive quality: drop AO on slow GPUs
      if (!st.low && st.frames < 120) { st.frames++; if (st.frames > 30) st.ftime += dt; if (st.frames === 120 && st.ftime / 90 > 1 / 26) { st.low = true; } }
      if (!shown) { shown = true; const l = $('#facLoad'); l.style.opacity = 0; setTimeout(() => l.hidden = true, 700); }
    }
  };
  register('s11', S);
  if (DECK.cur() === 's11') S.enter();
}

export async function initFactory() { await build(); }
