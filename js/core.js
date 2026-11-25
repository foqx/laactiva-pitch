/* ================= Laactiva deck — core ================= */
(function(){
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const stage=$('#stage');
window.DECK={scale:1,hooks:{}};

/* ---------- icons (24px line set) ---------- */
const IC={
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
 leaf:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/>',
 globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
 handshake:'<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/>',
 calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8"/><path d="M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18.5h.01M12 18.5h.01M16 18.5h.01"/>',
 building:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
 bars:'<path d="M3 3v18h18"/><path d="M8 17v-4"/><path d="M13 17V9"/><path d="M18 17V5"/>',
 trend:'<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/><path d="M14 9h5v5"/>',
 flask:'<path d="M9 3h6"/><path d="M10 3v6.5L4.6 18.2A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.7-2.8L14 9.5V3"/><path d="M7 15h10"/>',
 spray:'<path d="M9 8h6v3l2 2v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8l2-2z"/><path d="M10 8V5h5l2 2"/><path d="M20 4h.01M20 7h.01M22 5.5h.01"/><path d="M10 16h4"/>',
 jar:'<path d="M5 11h14v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3z"/><path d="M4 8a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3H4z"/><path d="M8 7c0-2 2-4 4-4s4 2 4 4"/>',
 box:'<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/><path d="m7.5 5.5 9 5"/>',
 sprout:'<path d="M7 20h10"/><path d="M12 20v-9"/><path d="M12 11c0-4-3-6-7-6 0 4 3 6 7 6z"/><path d="M12 13c0-4 3-7 8-7 0 5-3 7-8 7z"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
 tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
 doc:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h8M8 9h2"/>',
 contract:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h5"/><path d="M14 2v6h6v3"/><path d="M8 9h2M8 13h6"/><path d="m14 19 2 2 1.5-1.5M21 17l-2.5-2.5-2 .5-2 2"/>',
 sign:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h5M8 9h2"/><path d="m9 18 1.5-1.5 1.5 1 2.5-3"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
 cart:'<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
 tube:'<path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/>',
 trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/><path d="m12 5 .9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 7.1l2-.3z"/>',
 clip:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m8 11 1.5 1.5L12 10M8 16.5l1.5 1.5L12 15.5"/><path d="M14 11h2M14 16.5h2"/>',
 coins:'<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/><path d="m16.71 13.88.7.71-2.82 2.82"/>',
 scale:'<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
 cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
 mega:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
 umbrella:'<path d="M22 12a10.06 10.06 1 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/>',
 system:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><path d="M14 6.5h3.5a3 3 0 0 1 3 3V11"/><path d="m18.5 9 2 2 2-2"/><path d="M10 17.5H6.5a3 3 0 0 1-3-3V13"/><path d="m5.5 15-2-2-2 2"/>',
 dollar:'<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>',
 clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 recycle:'<path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"/><path d="m14 16-3 3 3 3"/><path d="M8.293 13.596 7.196 9.5 3.1 10.598"/><path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"/><path d="m13.378 9.633 4.096 1.098 1.097-4.096"/>'
};
$$('i[data-i]').forEach(el=>{
  const s=document.createElementNS('http://www.w3.org/2000/svg','svg');
  s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');
  s.innerHTML=IC[el.dataset.i]||'';el.replaceWith(s);
});

/* ---------- mini molecule logo on every slide ---------- */
const MOL='<svg viewBox="0 0 200 170" aria-hidden="true"><g fill="none" stroke-linecap="round" stroke-linejoin="round"><path class="ln" pathLength="1" stroke-dasharray="1" d="M8 64 L62 95 L62 132 M62 95 L122 60 L166 85 M117 56 V24 M127 56 V24" stroke="#0e4a2c" stroke-width="7"/><circle class="ring" cx="122" cy="12" r="11" stroke="#6fae25" stroke-width="5"/><circle class="ring" cx="176" cy="91" r="11" stroke="#6fae25" stroke-width="5"/><circle class="ring" cx="62" cy="145" r="11" stroke="#6fae25" stroke-width="5"/></g></svg>';
$$('.mol').forEach(m=>m.innerHTML=MOL);

/* ---------- cover hex network ---------- */
(function(){
  const R=56,h=Math.sqrt(3)*R/2;
  const hex=(cx,cy)=>{let d='';for(let i=0;i<6;i++){const a=Math.PI/3*i;d+=(i?'L':'M')+(cx+R*Math.cos(a)).toFixed(1)+' '+(cy+R*Math.sin(a)).toFixed(1)}return d+'Z'};
  const cells=[[560,40],[644,88],[476,88],[560,137],[644,185],[476,185],[560,234],[392,40]];
  const branches=[['M336 40 L290 12','290 12'],['M420 185 L372 214','372 214'],['M560 291 L560 352','560 352'],['M448 137 L400 110','400 110']];
  let out='';
  cells.forEach((c,i)=>out+=`<path class="hd" pathLength="1" style="animation-delay:${(i*.12).toFixed(2)}s" d="${hex(c[0],c[1])}"/>`);
  branches.forEach((b,i)=>{const [x,y]=b[1].split(' ');out+=`<path class="hd" pathLength="1" style="animation-delay:${(1+i*.15).toFixed(2)}s" d="${b[0]}"/><circle cx="${x}" cy="${y}" r="10"/>`});
  $('#hexTR').innerHTML=out;
  $('#hexBL').innerHTML=out;$('#hexBL').setAttribute('transform','rotate(180 320 240)');
  // cover word + tag timings
  $$('#s1 .word span').forEach((s,i)=>s.style.animationDelay=(0.9+i*0.06)+'s');
  $$('#s1 .tag>span').forEach((s,i)=>s.style.animationDelay=(1.6+i*0.18)+'s');
  $$('#s1 .hero-mol .hm').forEach((p,i)=>{p.style.strokeDasharray=1;p.style.strokeDashoffset=1;p.style.animation=`draw 1.3s var(--ease) ${(0.15+i*.25)}s both`});
  $$('#s1 .hero-mol .hr').forEach((c,i)=>{c.classList.add('ring');c.style.animation=`pop .8s cubic-bezier(.3,1.5,.5,1) ${(0.8+i*.15)}s both`});
})();

/* ---------- stage fit ---------- */
function fit(){
  const s=Math.min(innerWidth/1920,innerHeight/1080);
  DECK.scale=s;stage.style.transform=`translate(-50%,-50%) scale(${s})`;
  Object.values(DECK.hooks).forEach(h=>h.resize&&h.resize());
}
addEventListener('resize',fit);

/* ---------- counters ---------- */
function countUp(el){
  const end=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0),dur=1700,delay=+(el.dataset.d||0);
  const fmt=v=>dec?v.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec}):Math.round(v).toLocaleString('en-US');
  el.textContent=fmt(0);clearTimeout(el._t);cancelAnimationFrame(el._r);
  el._t=setTimeout(()=>{const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(2,-10*k);el.textContent=fmt(k>=1?end:end*e);if(k<1)el._r=requestAnimationFrame(f)};el._r=requestAnimationFrame(f)},delay);
}

/* ---------- navigation ---------- */
const slides=$$('.slide');let cur=0;
const cnt=$('#cnt'),prog=$('#prog');
function ui(){cnt.textContent=String(cur+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');prog.style.width=((cur+1)/slides.length*100)+'%'}
function enter(s){
  $$('[data-count]',s).forEach(countUp);
  const h=DECK.hooks[s.id];h&&h.enter&&h.enter();
}
function go(n){
  n=Math.max(0,Math.min(slides.length-1,n));if(n===cur)return;
  const a=slides[cur],b=slides[n];
  const ha=DECK.hooks[a.id];ha&&ha.leave&&ha.leave();
  a.classList.remove('active');a.classList.add('leaving');setTimeout(()=>a.classList.remove('leaving'),900);
  b.classList.add('active');cur=n;DECK.onChange&&DECK.onChange(a.id,b.id);enter(b);ui();
  try{history.replaceState(null,'','#'+(n+1))}catch(e){}
}
DECK.go=go;DECK.cur=()=>slides[cur].id;
const next=()=>go(cur+1),prev=()=>go(cur-1);
$('#bNext').onclick=next;$('#bPrev').onclick=prev;
function full(){const d=document;if(!d.fullscreenElement){(d.documentElement.requestFullscreen||d.documentElement.webkitRequestFullscreen||function(){}).call(d.documentElement)?.catch?.(()=>{})}else{d.exitFullscreen?.()}}
$('#bFull').onclick=full;

addEventListener('keydown',e=>{
  if(e.altKey||e.ctrlKey||e.metaKey)return;
  if(LB.open){if(e.key==='Escape')LB.close();else if(e.key==='ArrowRight'||e.key==='PageDown')LB.step(1);else if(e.key==='ArrowLeft'||e.key==='PageUp')LB.step(-1);e.preventDefault();return}
  if(ZM.open){if(['Escape','Enter',' '].includes(e.key)){ZM.close();e.preventDefault()}return}
  const h=DECK.hooks[slides[cur].id];if(h&&h.key&&h.key(e.key)){e.preventDefault();return}
  const k=e.key;
  if(['ArrowRight','ArrowDown','PageDown',' ','Enter','n','N'].includes(k)){if(k==='Enter'&&e.target.closest('button'))return;e.preventDefault();next()}
  else if(['ArrowLeft','ArrowUp','PageUp','Backspace','p','P'].includes(k)){e.preventDefault();prev()}
  else if(k==='Home')go(0);else if(k==='End')go(slides.length-1);
  else if(k==='f'||k==='F')full();
});
/* touch swipe (RTL: swipe right → next) */
let tx=null,ty=null;
stage.addEventListener('touchstart',e=>{if(e.target.closest('.gl,.hit,button,.fx'))return tx=null;tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
stage.addEventListener('touchend',e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy))dx>0?next():prev();tx=null});
/* idle chrome */
let it,nt;
function wake(e){document.body.classList.remove('idle');clearTimeout(it);it=setTimeout(()=>document.body.classList.add('idle'),2600);
  const near=e&&e.clientY!==undefined&&e.clientY>innerHeight-120;
  if(near||(e&&e.type==='touchstart')){document.body.classList.add('show-nav');clearTimeout(nt);nt=setTimeout(()=>document.body.classList.remove('show-nav'),e.type==='touchstart'?3000:1400)}
}
addEventListener('mousemove',wake);addEventListener('touchstart',wake,{passive:true});
$('#nav').addEventListener('mouseenter',()=>clearTimeout(nt));

/* ---------- B2B zoom ---------- */
const ZM={open:false,el:$('#zoomer'),
  show(card){const c=card.cloneNode(true);c.classList.remove('rv');c.style.cssText='';this.el.innerHTML='';this.el.appendChild(c);this.el.classList.add('open');$('#bmc').classList.add('dim');this.open=true},
  close(){this.el.classList.remove('open');$('#bmc').classList.remove('dim');this.open=false}};
$$('#bmc .bm').forEach(b=>b.addEventListener('click',()=>ZM.show(b)));
ZM.el.addEventListener('click',()=>ZM.close());

/* ---------- lightbox ---------- */
const LB={open:false,list:[],i:0,el:$('#lb'),
  show(list,i){this.list=list;this.i=i;this.render();this.el.classList.add('open');this.open=true;$('#lbP').hidden=$('#lbN').hidden=list.length<2},
  render(){const it=this.list[this.i];const im=$('#lbImg');im.src=it.src;im.alt=it.cap;$('#lbCap').textContent=it.cap},
  step(d){if(this.list.length<2)return;this.i=(this.i+d+this.list.length)%this.list.length;this.render()},
  close(){this.el.classList.remove('open');this.open=false}};
DECK.LB=LB;
$('#lbX').onclick=()=>LB.close();$('#lbP').onclick=e=>{e.stopPropagation();LB.step(-1)};$('#lbN').onclick=e=>{e.stopPropagation();LB.step(1)};
LB.el.addEventListener('click',e=>{if(e.target===LB.el)LB.close()});
const DOCS=[{src:'assets/doc-patent.jpg',cap:'وثيقة طلب إيداع براءة اختراع — OM/P/2026/000550'},{src:'assets/doc-env-1.jpg',cap:'هيئة البيئة — عدم ممانعة بيئية (1/2)'},{src:'assets/doc-env-2.jpg',cap:'هيئة البيئة — عدم ممانعة بيئية (2/2)'}];
$$('#s12 .doc').forEach(d=>d.addEventListener('click',()=>LB.show(DOCS,+d.dataset.doc)));

/* ---------- boot ---------- */
fit();ui();
const start=parseInt((location.hash||'').slice(1),10);
enter(slides[0]);
if(start>1&&start<=slides.length){slides[0].classList.remove('active');cur=start-1;slides[cur].classList.add('active');enter(slides[cur]);ui()}
DECK.ready=()=>{fit();const h=DECK.hooks[slides[cur].id];h&&h.enter&&h.enter()};
})();
