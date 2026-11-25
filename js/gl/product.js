/* Laactiva deck — product scenes: slide 4 (solution story) & slide 5 (features podium) */
import { THREE, RoundedBoxGeometry, FONT, ss, mkRenderer, studioEnv, canvasTex, makeCanvas, rr, radialTex, dragRotate, register } from './common.js';

const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

/* ---------------- label artwork (vector, 2K) ---------------- */
function drawMolecule(x, cx, cy, s) {
  x.save(); x.translate(cx, cy); x.scale(s, s); x.lineCap = 'round'; x.lineJoin = 'round';
  x.strokeStyle = '#0e4a2c'; x.lineWidth = 7; x.beginPath();
  x.moveTo(-92, -21); x.lineTo(-38, 10); x.lineTo(-38, 47); x.moveTo(-38, 10); x.lineTo(22, -25); x.lineTo(66, 0);
  x.moveTo(17, -29); x.lineTo(17, -61); x.moveTo(27, -29); x.lineTo(27, -61); x.stroke();
  x.strokeStyle = '#6fae25'; x.lineWidth = 5.5;[[22, -73], [76, 6], [-38, 60]].forEach(p => { x.beginPath(); x.arc(p[0], p[1], 11, 0, Math.PI * 2); x.stroke(); });
  x.restore();
}
function drawWordmark(x, cx, cy, hgt, col = '#0e4a2c') {
  // L Λ C T I V Λ — geometric wordmark as in the logo
  const letters = ['L', 'Λ', 'C', 'T', 'I', 'V', 'Λ'], w = hgt * .62, gap = hgt * .42;
  const total = letters.length * w + (letters.length - 1) * gap; let px = cx - total / 2;
  x.save(); x.strokeStyle = col; x.lineWidth = hgt * .085; x.lineCap = 'butt'; x.lineJoin = 'miter';
  const t = cy - hgt / 2, b = cy + hgt / 2;
  letters.forEach(L => {
    x.beginPath();
    if (L === 'L') { x.moveTo(px, t); x.lineTo(px, b); x.lineTo(px + w * .9, b); }
    if (L === 'Λ') { x.moveTo(px, b); x.lineTo(px + w / 2, t); x.lineTo(px + w, b); }
    if (L === 'C') { x.arc(px + w / 2 + hgt * .02, cy, hgt / 2, Math.PI * .27, Math.PI * 1.73, false); }
    if (L === 'T') { x.moveTo(px, t); x.lineTo(px + w, t); x.moveTo(px + w / 2, t); x.lineTo(px + w / 2, b); }
    if (L === 'I') { x.moveTo(px + w / 2, t); x.lineTo(px + w / 2, b); }
    if (L === 'V') { x.moveTo(px, t); x.lineTo(px + w / 2, b); x.lineTo(px + w, t); }
    x.stroke(); px += w + gap;
  });
  x.restore();
}
export function logoCanvas(w = 1024, h = 820, opts = {}) {
  return makeCanvas(w, h, (x) => { drawMolecule(x, w / 2, h * .36, w / 290); drawWordmark(x, w / 2, h * .86, h * .13, opts.col); });
}
function labelCanvas() {
  return makeCanvas(2048, 2384, (x, W, H) => {
    x.fillStyle = '#fbfcfa'; x.fillRect(0, 0, W, H);
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,40,20,.035)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#0f5a32'; x.lineWidth = 34; rr(x, 60, 60, W - 120, H - 120, 56); x.stroke();
    drawMolecule(x, W / 2, 440, 3.5);
    drawWordmark(x, W / 2, 820, 104);
    x.fillStyle = '#0f4d2c'; x.textAlign = 'center';
    x.font = `800 176px ${FONT}`; x.fillText('L(+) LACTIC ACID', W / 2, 1210);
    x.fillRect(W / 2 - 300, 1285, 600, 10);
    x.font = `500 112px ${FONT}`; x.fillStyle = '#28503c'; x.fillText('Net Weight:', W / 2, 1520);
    x.font = `800 190px ${FONT}`; x.fillStyle = '#0f4d2c'; x.fillText('On Request', W / 2, 1760);
    x.save(); x.translate(440, 2080); x.rotate(-.55); const lg = x.createLinearGradient(-90, 0, 90, 0); lg.addColorStop(0, '#2f8a2c'); lg.addColorStop(1, '#6fbf3a'); x.fillStyle = lg;
    x.beginPath(); x.moveTo(-95, 0); x.quadraticCurveTo(0, -70, 95, 0); x.quadraticCurveTo(0, 70, -95, 0); x.fill(); x.strokeStyle = '#eaf6de'; x.lineWidth = 7; x.beginPath(); x.moveTo(-80, 0); x.lineTo(80, 0); x.stroke(); x.restore();
    x.font = `700 104px ${FONT}`; x.fillStyle = '#28503c'; x.fillText('From Waste to the Worth', W / 2 + 90, 2118);
  });
}
function sideCanvas() {
  return makeCanvas(560, 2000, (x, W, H) => {
    x.fillStyle = '#f7f9f6'; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#0f5a32'; x.lineWidth = 22; rr(x, 30, 30, W - 60, H - 60, 50); x.stroke();
    x.lineWidth = 16; x.lineCap = 'round'; x.lineJoin = 'round';
    const box = i => { const y = 90 + i * 465; rr(x, 100, y, 360, 400, 34); x.stroke(); return y; };
    let y = box(0);[210, 350].forEach(cx => { x.beginPath(); x.moveTo(cx, y + 320); x.lineTo(cx, y + 90); x.moveTo(cx - 44, y + 140); x.lineTo(cx, y + 88); x.lineTo(cx + 44, y + 140); x.stroke(); });
    y = box(1); x.beginPath(); x.moveTo(205, y + 90); x.lineTo(355, y + 90); x.lineTo(338, y + 200); x.quadraticCurveTo(280, y + 250, 222, y + 200); x.closePath(); x.stroke(); x.beginPath(); x.moveTo(280, y + 225); x.lineTo(280, y + 310); x.moveTo(220, y + 316); x.lineTo(340, y + 316); x.stroke();
    y = box(2); x.beginPath(); x.moveTo(150, y + 210); x.quadraticCurveTo(280, y + 40, 410, y + 210); x.closePath(); x.stroke(); x.beginPath(); x.moveTo(280, y + 210); x.lineTo(280, y + 300); x.quadraticCurveTo(280, y + 336, 246, y + 326); x.stroke();
    y = box(3); for (let i = 0; i < 3; i++) { const a = i * 2.094 - 1.57; x.save(); x.translate(280 + Math.cos(a) * 80, y + 205 + Math.sin(a) * 80); x.rotate(a + 2.3); x.beginPath(); x.moveTo(-50, 0); x.lineTo(38, 0); x.moveTo(14, -22); x.lineTo(40, 0); x.lineTo(14, 22); x.stroke(); x.restore(); }
  });
}

/* ---------------- geometry helpers ---------------- */
function rrShape(w, h, r) { const s = new THREE.Shape(), x = -w / 2, y = -h / 2; s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s; }
function ribbedCylinder(r, h, ribs, amp) {
  const g = new THREE.CylinderGeometry(r, r, h, ribs * 4, 1, false), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), rad = Math.hypot(x, z); if (rad < r * .9) continue; const a = Math.atan2(z, x); const c = Math.cos(a * ribs); const k = 1 + amp * (c > .3 ? 1 : c < -.3 ? -1 : 0); p.setX(i, x * k); p.setZ(i, z * k); }
  g.computeVertexNormals(); return g;
}
function lathe(pts, seg = 64) { const curve = new THREE.SplineCurve(pts.map(p => new THREE.Vector2(p[0], p[1]))); return new THREE.LatheGeometry(curve.getPoints(40), seg); }

/* ---------------- the LACTIVA jerrycan ---------------- */
export function makeCan(r) {
  const g = new THREE.Group();
  const hdpe = new THREE.MeshPhysicalMaterial({ color: 0xf4f6f3, roughness: .44, clearcoat: .35, clearcoatRoughness: .4, sheen: .6, sheenRoughness: .6, sheenColor: new THREE.Color(0xffffff) });
  const hdpe2 = hdpe.clone(); hdpe2.color.set(0xe6ebe7);
  const W = 1.5, H = 1.9, D = 1.0;
  const add = (geo, mat, x = 0, y = 0, z = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m; };
  add(new RoundedBoxGeometry(W, H, D, 10, .17), hdpe);
  add(new RoundedBoxGeometry(W - .08, .26, D - .08, 8, .11), hdpe, 0, H / 2 + .01, 0);
  add(new RoundedBoxGeometry(W - .04, .18, D - .04, 8, .08), hdpe2, 0, -H / 2 - .03, 0);
  // moulded label frame + label
  add(new RoundedBoxGeometry(1.22, 1.42, .06, 6, .025), hdpe, 0, -.06, D / 2 - .018);
  const lab = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.28), new THREE.MeshPhysicalMaterial({ map: canvasTex(labelCanvas(), r), roughness: .55, clearcoat: .15, clearcoatRoughness: .5 }));
  lab.position.set(0, -.06, D / 2 + .02); g.add(lab);
  // side icon panel (+x) and grip ribs (-x)
  add(new RoundedBoxGeometry(.06, 1.2, .46, 4, .02), hdpe, W / 2 - .018, -.05, 0);
  const side = new THREE.Mesh(new THREE.PlaneGeometry(.36, 1.14), new THREE.MeshPhysicalMaterial({ map: canvasTex(sideCanvas(), r), roughness: .55 }));
  side.position.set(W / 2 + .018, -.05, 0); side.rotation.y = Math.PI / 2; g.add(side);
  for (let i = -2; i <= 2; i++) add(new RoundedBoxGeometry(.05, .07, .62, 4, .025), hdpe, -W / 2 - .005, i * .2 - .05, 0);
  // handle
  const hs = rrShape(.96, .64, .27), hole = rrShape(.66, .3, .14);
  hs.holes.push(new THREE.Path(hole.getPoints(24).map(p => new THREE.Vector2(p.x, p.y - .06))));
  const hg = new THREE.ExtrudeGeometry(hs, { depth: .17, bevelEnabled: true, bevelThickness: .055, bevelSize: .05, bevelSegments: 10, curveSegments: 40 }); hg.translate(0, 0, -.085);
  add(hg, hdpe, .3, H / 2 + .33, -.03);
  // spout, threads, ribbed cap
  add(new THREE.CylinderGeometry(.17, .2, .18, 64), hdpe, -.47, H / 2 + .2, .12);
  const capMat = new THREE.MeshPhysicalMaterial({ color: 0x0f5a31, roughness: .38, clearcoat: .6, clearcoatRoughness: .3 });
  add(ribbedCylinder(.24, .3, 44, .045), capMat, -.47, H / 2 + .42, .12);
  const top = add(new THREE.SphereGeometry(.232, 64, 16, 0, Math.PI * 2, 0, .42), capMat, -.47, H / 2 + .47, .12); top.scale.y = .9;
  add(new THREE.TorusGeometry(.236, .014, 12, 96), capMat, -.47, H / 2 + .275, .12).rotation.x = Math.PI / 2;
  add(new THREE.CylinderGeometry(.07, .085, .09, 40), hdpe, .56, H / 2 + .17, -.36);
  // soft contact shadow
  const cs = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.5), new THREE.MeshBasicMaterial({ map: radialTex(), transparent: true, depthWrite: false, toneMapped: false }));
  cs.rotation.x = -Math.PI / 2; cs.position.y = -H / 2 - .125; cs.renderOrder = -1; g.add(cs); g.userData.shadow = cs;
  return g;
}

/* ---------------- food waste models ---------------- */
const P = (o) => new THREE.MeshPhysicalMaterial(Object.assign({ roughness: .45, clearcoat: .25, clearcoatRoughness: .4 }, o));
function foodKit() {
  const leafMat = P({ color: 0x4f8f2f, roughness: .5 }), stemMat = P({ color: 0x6b4a2b, roughness: .7 });
  const leafGeo = (() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(.05, .05, 0, .13); s.quadraticCurveTo(-.05, .05, 0, 0); return new THREE.ExtrudeGeometry(s, { depth: .004, bevelEnabled: true, bevelThickness: .003, bevelSize: .003, bevelSegments: 2, curveSegments: 12 }); })();
  const appleGeo = lathe([[0, -.16], [.09, -.17], [.17, -.1], [.2, .01], [.18, .11], [.11, .16], [.04, .13], [0, .1]]);
  const tomatoGeo = lathe([[0, -.14], [.12, -.14], [.2, -.06], [.21, .02], [.17, .11], [.08, .14], [0, .12]]);
  const lemonGeo = lathe([[0, -.21], [.03, -.19], [.11, -.12], [.14, 0], [.11, .12], [.03, .19], [0, .21]]);
  const carrotGeo = lathe([[0, -.34], [.02, -.3], [.05, -.1], [.075, .12], [.07, .2], [0, .21]], 48);
  const breadShape = (() => { const s = new THREE.Shape(); s.moveTo(-.17, -.18); s.lineTo(.17, -.18); s.lineTo(.17, .06); s.bezierCurveTo(.26, .08, .26, .26, .1, .24); s.quadraticCurveTo(0, .3, -.1, .24); s.bezierCurveTo(-.26, .26, -.26, .08, -.17, .06); s.closePath(); return s; })();
  const breadGeo = new THREE.ExtrudeGeometry(breadShape, { depth: .05, bevelEnabled: true, bevelThickness: .014, bevelSize: .014, bevelSegments: 4, curveSegments: 24 }); breadGeo.center();
  const bananaCurve = new THREE.CatmullRomCurve3([V3(-.24, .06, 0), V3(-.12, -.04, 0), V3(0, -.07, 0), V3(.12, -.04, 0), V3(.24, .06, 0)]);
  const bananaGeo = new THREE.TubeGeometry(bananaCurve, 48, .052, 18, false);
  const make = {
    apple(c) { const g = new THREE.Group(); g.add(new THREE.Mesh(appleGeo, P({ color: c, roughness: .32, clearcoat: .8, clearcoatRoughness: .2 }))); const st = new THREE.Mesh(new THREE.CylinderGeometry(.008, .012, .1, 8), stemMat); st.position.y = .16; st.rotation.z = .25; g.add(st); const lf = new THREE.Mesh(leafGeo, leafMat); lf.position.set(.01, .17, 0); lf.rotation.set(.3, .2, -1.1); g.add(lf); return g; },
    tomato() { const g = new THREE.Group(); g.add(new THREE.Mesh(tomatoGeo, P({ color: 0xd8392b, roughness: .22, clearcoat: 1, clearcoatRoughness: .12 }))); for (let i = 0; i < 5; i++) { const l = new THREE.Mesh(leafGeo, leafMat); l.position.y = .13; l.rotation.set(-1.25, i * 1.2566, 0, 'YXZ'); l.scale.setScalar(.8); g.add(l); } return g; },
    orange() { return new THREE.Mesh(new THREE.SphereGeometry(.18, 64, 48), P({ color: 0xf08c24, roughness: .55, clearcoat: .3 })); },
    lemon() { const m = new THREE.Mesh(lemonGeo, P({ color: 0xf2cf4a, roughness: .5, clearcoat: .3 })); m.rotation.z = Math.PI / 2; return m; },
    bread() { return new THREE.Mesh(breadGeo, [P({ color: 0xf0d8a4, roughness: .9, clearcoat: 0 }), P({ color: 0xb46f33, roughness: .7, clearcoat: .1 })]); },
    banana() { const g = new THREE.Group(); g.add(new THREE.Mesh(bananaGeo, P({ color: 0xf3cf45, roughness: .45 }))); [-.24, .24].forEach(x => { const t = new THREE.Mesh(new THREE.SphereGeometry(.05, 16, 12), stemMat); t.position.set(x, .06, 0); g.add(t); }); return g; },
    carrot() { const g = new THREE.Group(); g.add(new THREE.Mesh(carrotGeo, P({ color: 0xea7a26, roughness: .5 }))); for (let i = 0; i < 3; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(.02, .2, 8), leafMat); l.position.y = .3; l.rotation.set(0, 0, (i - 1) * .35); g.add(l); } g.rotation.z = 1.1; return g; },
    broccoli() { const g = new THREE.Group(); const st = new THREE.Mesh(new THREE.CylinderGeometry(.045, .06, .18, 20), P({ color: 0x8dbb5a, roughness: .6 })); st.position.y = -.08; g.add(st); const fm = P({ color: 0x3f7f2f, roughness: .8, clearcoat: 0 }); [[0, .06, 0, .1], [.08, .03, .02, .075], [-.08, .03, .01, .075], [.02, .04, .08, .07], [-.02, .03, -.08, .07]].forEach(([x, y, z, r]) => { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 3), fm); b.position.set(x, y, z); g.add(b); }); return g; }
  };
  return make;
}

/* ---------------- lactic acid molecule (brand: rings = oxygen) ---------------- */
function makeMolecule() {
  const g = new THREE.Group();
  const dark = new THREE.MeshPhysicalMaterial({ color: 0x0b4128, roughness: .28, metalness: .05, clearcoat: 1, clearcoatRoughness: .15 });
  const lime = new THREE.MeshPhysicalMaterial({ color: 0x7ab72c, roughness: .25, clearcoat: 1, clearcoatRoughness: .1, emissive: 0x2d5a08, emissiveIntensity: .35 });
  const A = V3(-1.25, .42, .1), B = V3(-.4, -.06, -.12), C = V3(.45, .42, .06), O1 = V3(.45, 1.36, 0), O2 = V3(1.28, -.02, -.08), O3 = V3(-.4, -.98, .12);
  const up = V3(0, 1, 0), pts = [];
  const bond = (a, b, rad = .058) => { const d = b.clone().sub(a), L = d.length(); const m = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, L, 40, 1), dark); m.position.copy(a).add(b).multiplyScalar(.5); m.quaternion.setFromUnitVectors(up, d.clone().normalize()); g.add(m); for (let i = 0; i < 16; i++) pts.push(a.clone().lerp(b, Math.random())); };
  const toRing = (a, o) => o.clone().sub(a).normalize().multiplyScalar(-.2).add(o);
  bond(A, B); bond(B, C); bond(B, toRing(B, O3)); bond(C, toRing(C, O2));
  const off = V3(.078, 0, 0); bond(C.clone().add(off), toRing(C, O1).add(off), .046); bond(C.clone().sub(off), toRing(C, O1).sub(off), .046);
  [A, B, C].forEach(p => { const s = new THREE.Mesh(new THREE.SphereGeometry(.105, 48, 32), dark); s.position.copy(p); g.add(s); });
  [toRing(B, O3), toRing(C, O2)].forEach(p => { const s = new THREE.Mesh(new THREE.SphereGeometry(.058, 32, 16), dark); s.position.copy(p); g.add(s); });
  const rings = [O1, O2, O3].map(p => { const m = new THREE.Mesh(new THREE.TorusGeometry(.19, .056, 40, 128), lime); m.position.copy(p); g.add(m); for (let i = 0; i < 24; i++) { const a = Math.random() * 6.283; pts.push(p.clone().add(V3(Math.cos(a) * .19, Math.sin(a) * .19, 0))); } return m; });
  g.userData.rings = rings; g.userData.pts = pts; return g;
}

/* fresnel glass orb (bioreactor) */
function orbMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: { uCol: { value: new THREE.Color(0x5fbf6a) }, uO: { value: 0 } },
    vertexShader: 'varying vec3 vN;varying vec3 vV;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
    fragmentShader: 'uniform vec3 uCol;uniform float uO;varying vec3 vN;varying vec3 vV;void main(){float f=pow(1.-abs(dot(vN,vV)),2.6);float spec=pow(max(dot(reflect(-vV,vN),normalize(vec3(-.4,.7,.6))),0.),40.);gl_FragColor=vec4(mix(uCol,vec3(1.),spec),(f*.75+.05+spec*.6)*uO);\n#include <colorspace_fragment>\n}'
  });
}

function lights(scene) {
  const k = new THREE.DirectionalLight(0xffffff, 1.9); k.position.set(3.5, 6, 5); scene.add(k);
  const rim = new THREE.DirectionalLight(0xe3fff0, 1.3); rim.position.set(-6, 3, -5); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, .35); fill.position.set(-4, 0, 6); scene.add(fill);
}

/* =====================================================================
   SLIDE 4 — waste → fermentation → molecule → product
   ===================================================================== */
function buildSolution() {
  const cv = $('#glSol'); const { r, size } = mkRenderer(cv, 1920, 1080, { exposure: 1.05 });
  const scene = new THREE.Scene(); scene.environment = studioEnv(r); scene.environmentIntensity = .9;
  const cam = new THREE.PerspectiveCamera(26, 1920 / 1080, 3, 40); cam.position.set(0, .9, 10.2); cam.lookAt(0, .35, 0);
  lights(scene);
  const root = new THREE.Group(); scene.add(root);

  // food waste
  const kit = foodKit();
  const recipe = ['apple', 'tomato', 'orange', 'bread', 'banana', 'lemon', 'carrot', 'broccoli', 'apple', 'tomato', 'orange', 'bread', 'banana', 'broccoli', 'apple', 'lemon', 'carrot', 'tomato', 'orange', 'bread', 'apple', 'banana', 'broccoli', 'tomato', 'lemon', 'carrot', 'orange', 'apple'];
  const food = recipe.map((k, i) => {
    const m = k === 'apple' ? kit.apple(i % 2 ? 0xc8372c : 0x8cbb3a) : kit[k]();
    const a = i / recipe.length * Math.PI * 2 + Math.random() * .3, rad = .75 + (i % 3) * .45 + Math.random() * .25;
    root.add(m);
    return { m, a, rad, y: ((i * 37) % 11 / 10 - .5) * 1.9, sp: V3(Math.random() - .5, Math.random() - .5, Math.random() - .5).multiplyScalar(.9), ph: Math.random() * 6.3, s: .95 + Math.random() * .35, r0: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6) };
  });
  food.forEach(f => f.m.rotation.copy(f.r0));
  // bioreactor orb + bacteria
  const orbM = orbMaterial(); const orb = new THREE.Mesh(new THREE.SphereGeometry(1.15, 96, 64), orbM); orb.position.y = .15; root.add(orb);
  const N = 170;
  const bac = new THREE.InstancedMesh(new THREE.CapsuleGeometry(.026, .08, 6, 14), new THREE.MeshPhysicalMaterial({ color: 0x4cae52, emissive: 0x1f7a2c, emissiveIntensity: .5, roughness: .3, clearcoat: .8 }), N);
  bac.instanceMatrix.setUsage(THREE.DynamicDrawUsage); root.add(bac);
  const bd = []; for (let i = 0; i < N; i++) { const u = Math.random() * 2 - 1, th = Math.random() * 6.283, rr_ = Math.cbrt(Math.random()) * .95; bd.push({ p: V3(Math.sqrt(1 - u * u) * Math.cos(th) * rr_, u * rr_, Math.sqrt(1 - u * u) * Math.sin(th) * rr_), sp: .5 + Math.random() * .9, ph: Math.random() * 6.3, q: new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6)) }); }
  // molecule
  const mol = makeMolecule(); const MS = .82; mol.position.set(0, .18, 0); root.add(mol);
  const targets = bd.map((_, i) => mol.userData.pts[(i * 7) % mol.userData.pts.length]);
  // product
  const can = makeCan(r); root.add(can); const BASE_Y = -.56;

  const st = { phase: 0, target: 0, rot: 0, vel: 0, touched: 0, timers: [], revealed: false };
  dragRotate(cv, st);
  const steps = $$('#solSteps .step'), slide = $('#s4');
  const setTarget = k => { st.target = k; steps.forEach((s, i) => { s.classList.toggle('on', i === k); s.classList.toggle('done', i < k); }); };
  const clear = () => { st.timers.forEach(clearTimeout); st.timers = []; };
  function play() { clear(); st.phase = 0; setTarget(0); slide.classList.remove('reveal'); st.revealed = false; st.rot = 0; st.vel = 0;[[1900, 1], [5000, 2], [8200, 3]].forEach(([t, k]) => st.timers.push(setTimeout(() => setTarget(k), t))); }
  steps.forEach((s, i) => s.addEventListener('click', () => { clear(); setTarget(i); }));
  $('#solReplay').addEventListener('click', play);

  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = V3(1, 1, 1), p = V3(), tv = V3(), anchor = new THREE.Matrix4();
  const S = {
    ready: true, st, resize: size,
    enter() { play(); S.tick(0, performance.now() / 1000); },
    leave() { clear(); },
    key(k) { if (k >= '1' && k <= '4') { clear(); setTarget(+k - 1); return true; } return false; },
    tick(dt, t) {
      const d = st.target - st.phase; const speed = .78; st.phase += Math.sign(d) * Math.min(Math.abs(d), dt * speed);
      const ph = st.phase;
      if (performance.now() - st.touched > 250) { st.vel *= .93; st.rot += st.vel; }
      root.rotation.y = st.rot + Math.sin(t * .4) * .1;
      // food: gentle float → spiral into the orb
      const s1 = ss(0, 1.1, ph), vis = 1 - ss(.55, 1.1, ph);
      for (const f of food) {
        const ang = f.a + t * .1 + s1 * 3.6, rad = f.rad * (1 - s1 * .95);
        f.m.position.set(Math.cos(ang) * rad * 1.06, f.y * (1 - s1) + Math.sin(t * .7 + f.ph) * .05 + .15, Math.sin(ang) * rad * .55);
        f.m.rotation.x = f.r0.x + t * f.sp.x * .6; f.m.rotation.y = f.r0.y + t * f.sp.y * .6;
        const s = vis * f.s; f.m.visible = s > .01; f.m.scale.setScalar(Math.max(s, .0001));
      }
      // orb
      const wo = ss(.35, .9, ph) * (1 - ss(1.75, 2.15, ph)); orbM.uniforms.uO.value = wo; orb.visible = wo > .01; orb.scale.setScalar(.9 + .1 * wo + Math.sin(t * 2) * .006);
      // bacteria: swirl inside the orb, then assemble the molecule
      const wb = ss(.45, 1.0, ph) * (1 - ss(1.9, 2.2, ph)), conv = ss(1.3, 1.95, ph);
      anchor.compose(mol.position, mol.quaternion, sc.set(MS, MS, MS));
      bac.visible = wb > .01;
      if (bac.visible) {
        for (let i = 0; i < N; i++) {
          const b = bd[i], a = t * b.sp + b.ph;
          p.set(b.p.x * Math.cos(a) - b.p.z * Math.sin(a), b.p.y + Math.sin(t * 1.4 + b.ph) * .05, b.p.x * Math.sin(a) + b.p.z * Math.cos(a)).multiplyScalar(1.05); p.y += .15;
          tv.copy(targets[i]).applyMatrix4(anchor); p.lerp(tv, conv);
          q.copy(b.q); const s = wb * (1 - conv * .5); m4.compose(p, q, sc.set(s, s, s)); bac.setMatrixAt(i, m4);
        }
        bac.instanceMatrix.needsUpdate = true;
      }
      // molecule
      const w2 = ss(1.72, 2.1, ph), into = ss(2.2, 2.8, ph);
      const pop = 1 + Math.sin(Math.min(1, w2) * Math.PI) * .08;
      const ms = MS * w2 * pop * (1 - into); mol.visible = ms > .004; mol.scale.setScalar(Math.max(ms, .0001));
      mol.rotation.y = Math.sin(t * .45) * .7; mol.rotation.x = Math.sin(t * .5) * .1;
      mol.position.set(0, .18 - into * .55, into * .6);
      if (mol.visible) { mol.updateMatrixWorld(); mol.userData.rings.forEach(rg => rg.lookAt(cam.position)); }
      // product
      const w3 = ss(2.35, 3, ph); can.visible = w3 > .002;
      can.position.y = BASE_Y - (1 - w3) * 2.2; can.rotation.y = -(1 - w3) * 2.4 + Math.sin(t * .55) * .06; can.scale.setScalar(.6 + .4 * w3);
      can.userData.shadow.material.opacity = w3;
      const rev = st.target === 3 && ph > 2.72; if (rev !== st.revealed) { st.revealed = rev; slide.classList.toggle('reveal', rev); }
      r.render(scene, cam);
    }
  };
  register('s4', S);
}

/* =====================================================================
   SLIDE 5 — product on a clean podium, feature-driven light & particles
   ===================================================================== */
function buildFeatures() {
  const cv = $('#glFeat'); const { r, size } = mkRenderer(cv, 1920, 1080, { exposure: 1.05 });
  const scene = new THREE.Scene(); scene.environment = studioEnv(r); scene.environmentIntensity = .9;
  const cam = new THREE.PerspectiveCamera(26, 1920 / 1080, 3, 40); cam.position.set(0, 1.35, 11.3); cam.lookAt(0, .1, 0);
  lights(scene);
  const root = new THREE.Group(); scene.add(root);
  const TOP = -1.2, PR = 1.36, PH = .56;
  // podium: crisp cylinder, rounded top edge, soft base plinth, light strip
  const matte = new THREE.MeshPhysicalMaterial({ color: 0xf8faf7, roughness: .62, sheen: .4, sheenRoughness: .8, sheenColor: new THREE.Color(0xffffff) });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(PR, PR, PH, 192, 1), matte); body.position.y = TOP - PH / 2; root.add(body);
  const edge = new THREE.Mesh(new THREE.TorusGeometry(PR - .03, .03, 24, 192), matte); edge.rotation.x = Math.PI / 2; edge.position.y = TOP - .03; root.add(edge);
  const topCap = new THREE.Mesh(new THREE.CircleGeometry(PR - .03, 192), matte); topCap.rotation.x = -Math.PI / 2; topCap.position.y = TOP; root.add(topCap);
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(PR + .26, PR + .3, .08, 192, 1), new THREE.MeshPhysicalMaterial({ color: 0xe4ece6, roughness: .5, clearcoat: .3 })); plinth.position.y = TOP - PH - .04; root.add(plinth);
  const stripMat = new THREE.MeshBasicMaterial({ color: 0x7ab72c, toneMapped: false });
  const strip = new THREE.Mesh(new THREE.TorusGeometry(PR + .012, .014, 12, 192), stripMat); strip.rotation.x = Math.PI / 2; strip.position.y = TOP - PH + .03; root.add(strip);
  const glow = new THREE.Mesh(new THREE.RingGeometry(PR + .02, PR + .3, 192, 1), new THREE.MeshBasicMaterial({ color: 0x7ab72c, transparent: true, opacity: .28, depthWrite: false, toneMapped: false }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = TOP - PH + .002; root.add(glow);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 3.4), new THREE.MeshBasicMaterial({ map: radialTex('rgba(8,40,28,.32)', 'rgba(8,40,28,.1)'), transparent: true, depthWrite: false, toneMapped: false }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = TOP - PH - .085; root.add(floor);
  // product
  const can = makeCan(r); const SC = .84; can.scale.setScalar(SC); can.position.y = TOP + (1.9 / 2 + .12) * SC; root.add(can);
  // feature particles (depth-correct instanced spheres)
  const N = 130;
  const pm = new THREE.MeshStandardMaterial({ color: 0x7ab72c, emissive: 0x7ab72c, emissiveIntensity: .55, roughness: .35 });
  const parts = new THREE.InstancedMesh(new THREE.SphereGeometry(.03, 16, 12), pm, N); parts.instanceMatrix.setUsage(THREE.DynamicDrawUsage); root.add(parts);
  const pd = []; for (let i = 0; i < N; i++) pd.push({ u: i / N, a: Math.random() * 6.283, r: .3 + Math.random() * .5, ph: Math.random(), k: Math.random() });
  const cols = [0x7ab72c, 0x3fa7c9, 0xd9a431, 0x2f9a5a, 0x49b36b];
  const R0 = PR + .32;
  const MODE = [
    (q, t) => { const a = q.u * 6.283 + t * .3; return [Math.cos(a) * R0, TOP + .12 + Math.sin(a * 3 + t) * .04, Math.sin(a) * R0, 1]; },
    (q, t) => { const f = (t * .22 + q.ph) % 1; return [Math.cos(q.a) * (R0 + q.r * .4), TOP + .1 + f * 2.5, Math.sin(q.a) * (R0 + q.r * .4) * .8, Math.sin(f * Math.PI)]; },
    (q, t) => { const f = (t * .18 + q.ph) % 1, a = q.a + f * 4; const rr_ = R0 + .35 - f * .3; return [Math.cos(a) * rr_, TOP + 2.5 - f * 2.4, Math.sin(a) * rr_, Math.sin(f * Math.PI)]; },
    (q, t) => { const lane = q.k < .33 ? 0 : q.k < .66 ? 1 : 2, a = q.u * 6.283 * 3 + t * (2.2 + lane * .5), rr_ = R0 + lane * .16; return [Math.cos(a) * rr_, TOP + .3 + lane * .7, Math.sin(a) * rr_ * .9, .55 + .45 * ((q.u * 3) % 1)]; },
    (q, t) => { const a = q.u * 6.283 + t * .6, x = Math.cos(a) * 1.85, y = Math.sin(a) * 1.3; return [x * .95, TOP + 1.25 + y, x * .35 - .2, 1]; }
  ];
  const st = { rot: 0, vel: 0, touched: 0, mode: -1, prev: 0, mix: 1, auto: true, resume: 0, last: 0 };
  dragRotate($('#featHit'), st);
  const cards = $$('#feats .feat'), wrap = $('#feats');
  const colNow = new THREE.Color(0x7ab72c), colTo = new THREE.Color(0x7ab72c);
  function setMode(k, user) { if (k === st.mode) return; st.prev = Math.max(0, st.mode); st.mode = k; st.mix = 0; wrap.classList.add('has-on'); cards.forEach((c, i) => c.classList.toggle('on', i === k)); colTo.set(cols[k]); if (user) { st.auto = false; st.resume = performance.now() + 15000; } st.last = performance.now(); }
  cards.forEach((c, i) => c.addEventListener('click', () => setMode(i, true)));
  let enterT = 0; const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = V3(), sc = V3();
  const S = {
    ready: true, st, setMode, resize: size,
    enter() { st.auto = true; enterT = performance.now(); wrap.classList.remove('has-on'); cards.forEach(c => c.classList.remove('on')); st.mode = -1; st.last = 0; S.tick(0, performance.now() / 1000); },
    leave() { },
    key(k) { if (k >= '1' && k <= '5') { setMode(+k - 1, true); return true; } return false; },
    tick(dt, t) {
      const now = performance.now();
      if (!st.auto && now > st.resume) st.auto = true;
      if (st.auto && now - enterT > 1500 && (st.mode < 0 || now - st.last > 4200)) setMode((st.mode + 1) % 5, false);
      if (now - st.touched > 250) { st.vel *= .93; st.rot += st.vel; }
      can.rotation.y = st.rot + Math.sin(t * .45) * .36;
      st.mix = Math.min(1, st.mix + dt * 1.1); const e = st.mix * st.mix * (3 - 2 * st.mix);
      colNow.lerp(colTo, Math.min(1, dt * 3)); pm.color.copy(colNow); pm.emissive.copy(colNow); stripMat.color.copy(colNow); glow.material.color.copy(colNow);
      glow.material.opacity = .22 + .08 * Math.sin(t * 2);
      const A = MODE[st.prev], B = MODE[Math.max(0, st.mode)], on = st.mode < 0 ? 0 : 1;
      for (let i = 0; i < N; i++) { const a = A(pd[i], t), b = B(pd[i], t); p.set(a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e); const s = (a[3] + (b[3] - a[3]) * e) * on; m4.compose(p, q, sc.set(s, s, s)); parts.setMatrixAt(i, m4); }
      parts.instanceMatrix.needsUpdate = true;
      r.render(scene, cam);
    }
  };
  register('s5', S);
}

export async function initProduct() {
  try { await Promise.race([Promise.all(['500', '700', '800'].map(w => document.fonts.load(`${w} 100px Tajawal`))), new Promise(r => setTimeout(r, 3000))]); } catch (e) { }
  buildSolution(); buildFeatures();
}
