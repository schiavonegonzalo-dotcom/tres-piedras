/* ============================================================
   TRES PIEDRAS — interacciones
   ============================================================ */

const WSP = '5492615000000';
const PRECIO_NOCHE = 80000;
const LIMPIEZA = 15000;
const fmt = n => '$' + n.toLocaleString('es-AR');

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

/* ── MOBILE NAV ── */
function toggleMenu(){
  const open = document.body.classList.toggle('menu-open');
  document.getElementById('mobileMenu').style.display = open ? 'flex' : 'none';
}
function closeMenu(){
  document.body.classList.remove('menu-open');
  document.getElementById('mobileMenu').style.display = 'none';
}

/* ── REVEAL ON SCROLL ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
});

/* ── CALENDARIO (multi-mes, selección de rango) ── */
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
// disponibilidad de ejemplo: fechas ocupadas por mes (clave AAAA-M)
const OCUPADO = {
  '2025-6': [4,5,6,12,13,20,21],      // Julio (mes 6 = índice)
  '2025-7': [1,2,9,10,16,17,23,24],   // Agosto
  '2025-8': [13,14,15,27,28],         // Septiembre
};
let calY = 2025, calM = 6;            // arranca en Julio 2025
let rangeStart = null, rangeEnd = null;

function keyOf(y,m){ return y+'-'+m; }
function sameDay(a,b){ return a && b && a.getTime() === b.getTime(); }

function buildCalendar(){
  const grid = document.getElementById('calGrid');
  grid.innerHTML = '';
  document.getElementById('calMonth').textContent = MESES[calM] + ' ' + calY;
  ['Lu','Ma','Mi','Ju','Vi','Sa','Do'].forEach(d => {
    const h = document.createElement('div'); h.className='cal-hdr'; h.textContent=d; grid.appendChild(h);
  });
  const first = new Date(calY, calM, 1);
  let lead = (first.getDay() + 6) % 7;            // lunes = 0
  const dim = new Date(calY, calM+1, 0).getDate();
  const occ = OCUPADO[keyOf(calY,calM)] || [];
  for(let i=0;i<lead;i++){ const b=document.createElement('div'); b.className='cal-day empty'; grid.appendChild(b); }
  for(let d=1; d<=dim; d++){
    const el = document.createElement('div');
    el.className='cal-day';
    el.textContent = d;
    const cur = new Date(calY, calM, d);
    if(occ.includes(d)){
      el.classList.add('occ');
    } else {
      el.classList.add('avail');
      // estado de rango
      if(sameDay(cur, rangeStart) || sameDay(cur, rangeEnd)){ el.classList.add('sel'); }
      else if(rangeStart && rangeEnd && cur > rangeStart && cur < rangeEnd){ el.classList.add('inrange'); }
      el.addEventListener('click', () => onPickDay(cur));
    }
    grid.appendChild(el);
  }
}

function onPickDay(d){
  if(!rangeStart || (rangeStart && rangeEnd)){
    rangeStart = d; rangeEnd = null;
  } else if(d > rangeStart){
    rangeEnd = d;
  } else {
    rangeStart = d; rangeEnd = null;
  }
  syncDateInputs();
  buildCalendar();
  updatePrice();
}

function pad(n){ return String(n).padStart(2,'0'); }
function toISO(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }

function syncDateInputs(){
  document.getElementById('fechaIn').value  = rangeStart ? toISO(rangeStart) : '';
  document.getElementById('fechaOut').value = rangeEnd ? toISO(rangeEnd) : '';
}

function nights(){
  if(rangeStart && rangeEnd){ return Math.round((rangeEnd - rangeStart) / 86400000); }
  return 0;
}

function updatePrice(){
  const n = nights();
  document.getElementById('pNights').textContent = fmt(PRECIO_NOCHE) + ' × ' + n + ' noche' + (n!==1?'s':'');
  document.getElementById('pBase').textContent = fmt(n*PRECIO_NOCHE);
  document.getElementById('pTotal').textContent = fmt(n*PRECIO_NOCHE + (n>0?LIMPIEZA:0));
}

function calStep(dir){
  calM += dir;
  if(calM < 0){ calM = 11; calY--; }
  if(calM > 11){ calM = 0; calY++; }
  buildCalendar();
}

// inputs de fecha manuales
function onDateInput(){
  const i = document.getElementById('fechaIn').value;
  const o = document.getElementById('fechaOut').value;
  rangeStart = i ? new Date(i+'T00:00') : null;
  rangeEnd   = o ? new Date(o+'T00:00') : null;
  if(rangeStart){ calY = rangeStart.getFullYear(); calM = rangeStart.getMonth(); }
  buildCalendar();
  updatePrice();
}

/* ── GALERÍA / CARRUSEL ── */
const SLIDES = [
  {cat:'interior', cap:'Living con hogar a leña',  url:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80&auto=format&fit=crop'},
  {cat:'interior', cap:'Cocina equipada',          url:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format&fit=crop'},
  {cat:'interior', cap:'Dormitorio principal',     url:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80&auto=format&fit=crop'},
  {cat:'interior', cap:'Comedor diario',           url:'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=80&auto=format&fit=crop'},
  {cat:'exterior', cap:'La casa entre los cerros', url:'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=900&q=80&auto=format&fit=crop'},
  {cat:'exterior', cap:'Deck y galería',           url:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80&auto=format&fit=crop'},
  {cat:'exterior', cap:'Quincho y parrilla',       url:'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=900&q=80&auto=format&fit=crop'},
  {cat:'gente',    cap:'Sobremesa en familia',     url:'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=900&q=80&auto=format&fit=crop'},
  {cat:'gente',    cap:'Mate y montaña',           url:'https://images.unsplash.com/photo-1517495306984-f84210f9daa8?w=900&q=80&auto=format&fit=crop'},
  {cat:'gente',    cap:'Amigos en el deck',        url:'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=900&q=80&auto=format&fit=crop'},
  {cat:'entorno',  cap:'Dique Potrerillos',        url:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80&auto=format&fit=crop'},
  {cat:'entorno',  cap:'El Río Mendoza',           url:'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=900&q=80&auto=format&fit=crop'},
  {cat:'entorno',  cap:'Los Andes al atardecer',   url:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80&auto=format&fit=crop'},
];

let filtered = [...SLIDES];
let cur = 0, lbIdx = 0;
function visCount(){ return window.innerWidth <= 640 ? 1 : (window.innerWidth <= 1024 ? 2 : 3); }

function buildCar(s){
  const track = document.getElementById('carTrack');
  const dots  = document.getElementById('carDots');
  track.innerHTML=''; dots.innerHTML=''; cur=0;
  const VIS = visCount();
  const w = Math.floor((document.getElementById('carClip').offsetWidth - (VIS-1)*14) / VIS);
  s.forEach((sl,i) => {
    const d = document.createElement('div');
    d.className='car-slide'; d.style.width=w+'px';
    d.innerHTML = `<img src="${sl.url}" alt="${sl.cap}" loading="lazy">
      <div class="zoom-hint"><svg class="ico"><use href="#i-expand"/></svg></div>
      <div class="car-slide-cap">${sl.cap}</div>`;
    d.addEventListener('click', ()=>openLb(i));
    track.appendChild(d);
  });
  const nd = Math.max(1, Math.ceil(s.length/VIS));
  for(let i=0;i<nd;i++){
    const b=document.createElement('button');
    b.className='cdot'+(i===0?' active':'');
    b.addEventListener('click', ()=>goTo(i*VIS));
    dots.appendChild(b);
  }
  updateBtns();
}
function goTo(i){
  const sl=document.querySelectorAll('#carTrack .car-slide');
  const VIS = visCount();
  const max=Math.max(0,sl.length-VIS);
  cur=Math.min(Math.max(i,0),max);
  const w=sl[0].offsetWidth+14;
  document.getElementById('carTrack').style.transform=`translateX(-${cur*w}px)`;
  const di=Math.floor(cur/VIS);
  document.querySelectorAll('#carDots .cdot').forEach((d,j)=>d.classList.toggle('active',j===di));
  updateBtns();
}
function updateBtns(){
  const sl=document.querySelectorAll('#carTrack .car-slide');
  const VIS = visCount();
  document.getElementById('carPrev').style.opacity=cur===0?'.3':'1';
  document.getElementById('carNext').style.opacity=cur>=sl.length-VIS?'.3':'1';
}
function filterSlides(cat,btn){
  document.querySelectorAll('.gtab').forEach(t=>t.classList.remove('active'));
  btn.classList.add('active');
  filtered = cat==='todas' ? [...SLIDES] : SLIDES.filter(s=>s.cat===cat);
  buildCar(filtered);
}

/* ── LIGHTBOX ── */
function openLb(i){
  lbIdx=i;
  document.getElementById('lbImg').src=filtered[i].url.replace('w=900','w=1400');
  document.getElementById('lbImg').alt=filtered[i].cap;
  document.getElementById('lbCt').textContent=`${i+1} / ${filtered.length}  ·  ${filtered[i].cap}`;
  document.getElementById('lb').classList.add('open');
}
function closeLb(){ document.getElementById('lb').classList.remove('open'); }
function lbMove(d){ lbIdx=(lbIdx+d+filtered.length)%filtered.length; openLb(lbIdx); }

/* ── WHATSAPP ── */
function reservarWsp(){
  const casa = document.getElementById('selCasa').value;
  const pers = document.getElementById('selPers').value;
  const fi = document.getElementById('fechaIn').value;
  const fo = document.getElementById('fechaOut').value;
  const n = nights();
  const total = n*PRECIO_NOCHE + (n>0?LIMPIEZA:0);
  const msg = encodeURIComponent(
    `¡Hola Tres Piedras! Quiero reservar 🏔️\n` +
    `🏡 ${casa}\n` +
    `👥 ${pers}\n` +
    `📅 Entrada: ${fi||'(a confirmar)'}\n` +
    `📅 Salida: ${fo||'(a confirmar)'}\n` +
    (n>0 ? `🌙 ${n} noche${n!==1?'s':''} · Total estimado ${fmt(total)}\n` : '') +
    `¿Está disponible?`
  );
  window.open('https://wa.me/'+WSP+'?text='+msg,'_blank');
}
function wspGeneral(extra){
  const msg = encodeURIComponent('¡Hola! Consulto por Tres Piedras · Casa de Montaña en Potrerillos. ' + (extra||''));
  window.open('https://wa.me/'+WSP+'?text='+msg,'_blank');
}

function scrollTo(id){ document.querySelector(id).scrollIntoView({behavior:'smooth'}); closeMenu(); }

/* ── INIT ── */
function init(){
  buildCalendar();
  updatePrice();
  buildCar(filtered);
  document.getElementById('carPrev').addEventListener('click',()=>goTo(cur-visCount()));
  document.getElementById('carNext').addEventListener('click',()=>goTo(cur+visCount()));
  document.getElementById('fechaIn').addEventListener('change', onDateInput);
  document.getElementById('fechaOut').addEventListener('change', onDateInput);

  // swipe
  let ts=0;
  const track=document.getElementById('carTrack');
  track.addEventListener('touchstart',e=>{ts=e.touches[0].clientX;},{passive:true});
  track.addEventListener('touchend',e=>{
    const dx=ts-e.changedTouches[0].clientX;
    if(Math.abs(dx)>40){ dx>0 ? goTo(cur+1) : goTo(cur-1); }
  },{passive:true});

  // lightbox
  document.getElementById('lb').addEventListener('click',function(e){ if(e.target===this) closeLb(); });
  document.addEventListener('keydown',e=>{
    if(!document.getElementById('lb').classList.contains('open')) return;
    if(e.key==='Escape') closeLb();
    if(e.key==='ArrowRight') lbMove(1);
    if(e.key==='ArrowLeft') lbMove(-1);
  });

  let rt;
  window.addEventListener('resize', ()=>{ clearTimeout(rt); rt=setTimeout(()=>buildCar(filtered),180); });
}

if(document.readyState!=='loading') init();
else window.addEventListener('DOMContentLoaded', init);
