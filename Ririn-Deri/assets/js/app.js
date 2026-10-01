/* ============================================================
   RONA — WEDDING INVITATION CONFIG
   ============================================================ */
const CONFIG = {
  couple:{
    groom:'Deri Alan Wari',
    bride:'Ririn Riyanti',
    coverGroom:'Deri',
    coverBride:'Ririn',
    groomFull:'Deri Alan Wari',
    brideFull:'Ririn Riyanti',
    groomParents:'Putra dari Bapak Wawan Kosawara & Ibu Nia Kurnia',
    brideParents:'Putri dari Bapak Didin Maulana & Ibu Juju Hariyanti'
  },
  date:'2026-10-25T00:00:00+07:00',
  events:[
    {title:'Akad Nikah',date:'Kamis, 22 Oktober 2026',dateISO:'2026-10-22T08:00:00+07:00',time:'08.00 WIB',place:'Jl. Terusan Pasirkoja, Kota Bandung, Jawa Barat 40221 (Gg Air Mancur, Rt 04 Rw 03)',map:'https://www.google.com/maps/search/?api=1&query=-6.9304367564888%2C107.58203366208'},
    {title:'Resepsi',date:'Minggu, 25 Oktober 2026',dateISO:'2026-10-25T11:00:00+07:00',time:'11.00 – 14.00 WIB',place:'Jl. Kampung Bbk Sawah, Kota Bandung, Jawa Barat 40221 (Rt 07 Rw 03)',map:'https://www.google.com/maps/search/?api=1&query=-6.9304367564888%2C107.58203366208'}
  ],
  gallery:[
    {src:'./foto/gallery-01.webp',alt:'Foto Ririn dan Deri 1'},
    {src:'./foto/gallery-02.webp',alt:'Foto Ririn dan Deri 2'},
    {src:'./foto/gallery-03.webp',alt:'Foto Ririn dan Deri 3'},
    {src:'./foto/gallery-04.webp',alt:'Foto Ririn dan Deri 4'},
    {src:'./foto/gallery-05.webp',alt:'Foto Ririn dan Deri 5'}
  ],
  gifts:[{bank:'BCA',number:'8380326796',owner:'Deri Alanwari'}],
  audioSrc:'./music/wedding-nasyid.mp3'
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const guest = new URLSearchParams(location.search).get('to');

const STORAGE = {
  get(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}},
  set(key,val){try{localStorage.setItem(key,JSON.stringify(val));return true}catch{return false}}
};

function safe(str){const d=document.createElement('div');d.textContent=str??'';return d.innerHTML}
function toast(msg){const el=$('#toast');if(!el)return;el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1800)}
function ago(ts){
  const diff=Math.max(0,Date.now()-Number(ts||Date.now()));
  const mins=Math.floor(diff/60000);
  if(mins<1)return 'Baru saja';
  if(mins<60)return `${mins} menit lalu`;
  const hours=Math.floor(mins/60);
  if(hours<24)return `${hours} jam lalu`;
  const days=Math.floor(hours/24);
  if(days<7)return `${days} hari lalu`;
  return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'}).format(new Date(ts));
}

function applyConfig(){
  if(guest) $('#guestName').textContent=guest;
  $('#eventList').innerHTML=CONFIG.events.map((e,i)=>`
    <div class="event-slot ${i===0?'slot-akad':'slot-resepsi'}">
      <a class="event-action" href="${e.map}" target="_blank" rel="noopener">Buka Maps</a>
      <button class="event-action add-event" type="button" data-date="${e.dateISO}">Tambah Pengingat</button>
    </div>`).join('');

  $('#galleryGrid').innerHTML=CONFIG.gallery.map(g=>`<button class="gallery-item" data-src="${g.src}" aria-label="Buka ${safe(g.alt)}"><img loading="lazy" src="${g.src}" alt="${safe(g.alt)}"></button>`).join('');

  $('#giftGrid').innerHTML=CONFIG.gifts.map((g,i)=>`
    <div class="gift-wrap">
      <button class="gift-flip" type="button" aria-label="Balik kartu ${safe(g.bank)}" aria-pressed="false" data-card-index="${i}">
        <span class="gift-flip-inner">
          <span class="gift-face"><img src="./assets/card/bca-front.png" alt="Tampilan depan kartu ${safe(g.bank)}"></span>
          <span class="gift-face gift-back"><img src="./assets/card/bca-back.png" alt="Tampilan belakang kartu ${safe(g.bank)}"></span>
        </span>
      </button>
      <div class="gift-note">
        <p class="gift-instruction">Ketuk kartu untuk membalik</p>
        <button class="copy" type="button" data-copy="${safe(g.number)}">Salin nomor rekening</button>
      </div>
    </div>`).join('');
  bindDynamic();
}
try{applyConfig()}catch(err){console.error('Core render error:',err)}

function initReveal(){
  const items=[...$$('.reveal-page'),...$$('.reveal-block')];
  if(!items.length)return;
  const show=el=>el.classList.add('in');
  if(!('IntersectionObserver' in window)){
    items.forEach(show);
    return;
  }
  const observer=new IntersectionObserver((entries,obs)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){show(entry.target);obs.unobserve(entry.target)}
    });
  },{threshold:.08,rootMargin:'0px 0px -35px 0px'});
  items.forEach(el=>observer.observe(el));
  requestAnimationFrame(()=>$('#home')?.classList.add('in'));
}
initReveal();

// Navigasi bawah: tetap di bawah viewport, scroll halus ke section tujuan.
const navLinks=$$('.section-dock a[data-nav-target]');
navLinks.forEach(link=>link.addEventListener('click',e=>{
  e.preventDefault();
  document.getElementById(link.dataset.navTarget)?.scrollIntoView({behavior:'smooth',block:'start'});
}));
if('IntersectionObserver' in window && navLinks.length){
  const navObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        navLinks.forEach(a=>a.classList.toggle('is-active',a.dataset.navTarget===entry.target.id));
      }
    });
  },{threshold:.2,rootMargin:'-10% 0px -55% 0px'});
  navLinks.forEach(a=>{const target=document.getElementById(a.dataset.navTarget);if(target)navObserver.observe(target)});
}

function openGate(){
  const gate=$('#gate');
  if(!gate)return;
  gate.classList.add('opening');
  document.body.classList.remove('locked');
  document.body.classList.add('is-open');
  setTimeout(()=>gate.remove(),2750);
}
$('#openBtn')?.addEventListener('click',openGate);

const shareBtn=$('#shareBtn');
shareBtn?.addEventListener('click',async()=>{
  const shareData={title:'Deri & Ririn — Undangan Pernikahan',text:'Undangan pernikahan Deri & Ririn',url:location.href};
  try{
    if(navigator.share){await navigator.share(shareData);return}
    await navigator.clipboard.writeText(location.href);
    toast('Link undangan tersalin');
  }catch{toast('Belum bisa membagikan link')}
});

const audio=$('#bgMusic');
if(audio){
  audio.src=CONFIG.audioSrc;
  audio.loop=true;
  audio.preload='auto';
  const startMusic=()=>audio.play().catch(()=>{});
  document.addEventListener('pointerdown',startMusic,{once:true});
  document.addEventListener('keydown',startMusic,{once:true});
  $('#openBtn')?.addEventListener('click',startMusic);
}

function countdown(){
  const diff=new Date(CONFIG.date).getTime()-Date.now();
  const ids=['dd','hh','mm','ss'];
  if(diff<=0){ids.forEach(id=>$('#'+id).textContent='00');return}
  $('#dd').textContent=String(Math.floor(diff/86400000)).padStart(2,'0');
  $('#hh').textContent=String(Math.floor(diff/3600000)%24).padStart(2,'0');
  $('#mm').textContent=String(Math.floor(diff/60000)%60).padStart(2,'0');
  $('#ss').textContent=String(Math.floor(diff/1000)%60).padStart(2,'0');
}
setInterval(countdown,1000);countdown();

function bindDynamic(){
  $$('.add-event').forEach(btn=>btn.addEventListener('click',()=>downloadICS(new Date(btn.dataset.date))));
  $$('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{
    const text=btn.dataset.copy;
    try{
      await navigator.clipboard.writeText(text);
      const old=btn.textContent;
      btn.textContent='Tersalin';
      setTimeout(()=>btn.textContent=old,1400);
      toast('Nomor rekening tersalin');
    }catch{toast('Gagal menyalin')}
  }));
  $$('.gallery-item[data-src]').forEach(btn=>btn.addEventListener('click',()=>{
    const lb=$('#lightbox');
    $('#lightboxImg').src=btn.dataset.src;
    lb.style.display='grid';
    lb.setAttribute('aria-hidden','false');
  }));
  $$('.gift-flip').forEach(card=>card.addEventListener('click',()=>{
    const flipped=card.classList.toggle('flipped');
    card.setAttribute('aria-pressed',String(flipped));
  }));
}

function downloadICS(date){
  const start=date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const end=new Date(date.getTime()+60*60*1000).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:Pernikahan ${CONFIG.couple.groom} & ${CONFIG.couple.bride}\nDESCRIPTION:Undangan pernikahan\nEND:VEVENT\nEND:VCALENDAR`;
  const blob=new Blob([ics],{type:'text/calendar'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='undangan-pernikahan.ics';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast('Kalender berhasil dibuat');
}

$('#lightboxClose')?.addEventListener('click',()=>{
  $('#lightbox').style.display='none';
  $('#lightbox').setAttribute('aria-hidden','true');
  $('#lightboxImg').src='';
});
$('#lightbox')?.addEventListener('click',e=>{if(e.target.id==='lightbox')$('#lightboxClose').click()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#lightbox')?.style.display==='grid')$('#lightboxClose').click()});

/* RSVP */
let attendance='Hadir';
let rsvpsRef=null;
let firebaseReady=false;
let currentRsvpId=STORAGE.get('rona-rsvp-id')||null;
let currentRsvpKey=STORAGE.get('rona-rsvp-key')||null;

$$('[data-value]').forEach(btn=>btn.addEventListener('click',()=>{
  $$('[data-value]').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  attendance=btn.dataset.value;
}));

function getRsvpClientKey(){
  if(currentRsvpKey)return currentRsvpKey;
  if(window.crypto?.getRandomValues){
    const bytes=new Uint8Array(24);
    window.crypto.getRandomValues(bytes);
    currentRsvpKey=[...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');
  }else{
    currentRsvpKey=Array.from({length:48},()=>Math.floor(Math.random()*16).toString(16)).join('');
  }
  STORAGE.set('rona-rsvp-key',currentRsvpKey);
  return currentRsvpKey;
}

function loadRSVP(){
  const x=STORAGE.get('rona-rsvp');
  if(!x)return;
  $('#rsvpName').value=x.name||'';
  $('#rsvpGuests').value=x.guests||1;
  $('#rsvpNote').value=x.note||'';
  attendance=x.attendance||'Hadir';
  $$('[data-value]').forEach(b=>b.classList.toggle('active',b.dataset.value===attendance));
  $('#rsvpCard').classList.add('hidden');
  $('#rsvpSuccess').classList.remove('hidden');
}

$('#rsvpForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const name=$('#rsvpName').value.trim();
  const note=$('#rsvpNote').value.trim();
  const guestName=(guest||'').trim().slice(0,120);
  const guests=Math.max(1,Math.min(5,Number($('#rsvpGuests').value)||1));
  if(!name)return;
  if(!firebaseReady||!rsvpsRef){
    toast('RSVP online belum siap. Coba lagi beberapa detik.');
    return;
  }

  const btn=e.target.querySelector('button[type="submit"]');
  if(btn)btn.disabled=true;
  const payload={
    name:name.slice(0,70),
    attendance,
    guests,
    note:note.slice(0,250),
    guest:guestName,
    clientKey:getRsvpClientKey(),
    time:firebase.database.ServerValue.TIMESTAMP
  };

  try{
    if(currentRsvpId){
      await rsvpsRef.child(currentRsvpId).update(payload);
    }else{
      const ref=rsvpsRef.push();
      await ref.set(payload);
      currentRsvpId=ref.key;
      STORAGE.set('rona-rsvp-id',currentRsvpId);
    }
    const localData={name:name.slice(0,70),attendance,guests,note:note.slice(0,250),guest:guestName,updatedAt:Date.now()};
    STORAGE.set('rona-rsvp',localData);
    $('#rsvpCard').classList.add('hidden');
    $('#rsvpSuccess').classList.remove('hidden');
    toast('RSVP berhasil tersimpan');
  }catch(err){
    console.error('RSVP Firebase write error:',err);
    toast('RSVP gagal tersimpan. Coba lagi.');
  }finally{
    if(btn)btn.disabled=false;
  }
});
$('#editRsvp')?.addEventListener('click',()=>{$('#rsvpCard').classList.remove('hidden');$('#rsvpSuccess').classList.add('hidden')});
loadRSVP();

/* Firebase wishes */
const FIREBASE_CONFIG=window.FIREBASE_CONFIG||{};
let wishesRef=null;
function firebaseConfigured(){
  return typeof firebase!=='undefined' && FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('PASTE_') && FIREBASE_CONFIG.projectId && !FIREBASE_CONFIG.projectId.startsWith('PASTE_') && FIREBASE_CONFIG.databaseURL && !FIREBASE_CONFIG.databaseURL.includes('PASTE_');
}
function formatWishData(obj){
  return Object.entries(obj||{}).map(([id,w])=>({id,...w})).filter(w=>w&&w.name&&w.msg).sort((a,b)=>(Number(b.time)||0)-(Number(a.time)||0)).slice(0,100);
}
function renderWishes(arr){
  if(!arr.length){
    $('#wishList').innerHTML='<div class="wish"><p class="wish-msg">Belum ada ucapan. Jadilah yang pertama mengirim doa untuk Ririn & Deri.</p></div>';
    return;
  }
  $('#wishList').innerHTML=arr.map(w=>`<article class="wish"><div class="wish-top"><strong class="wish-name">${safe(w.name)}</strong><span class="wish-time">${ago(Number(w.time)||Date.now())}</span></div><p class="wish-msg">${safe(w.msg)}</p></article>`).join('');
}
function initFirebaseWishes(){
  if(!firebaseConfigured()){
    renderWishes([]);
    return;
  }
  try{
    if(!firebase.apps.length)firebase.initializeApp(FIREBASE_CONFIG);
    wishesRef=firebase.database().ref('wishes');
    rsvpsRef=firebase.database().ref('rsvps');
    firebaseReady=true;
    wishesRef.limitToLast(100).on('value',snap=>renderWishes(formatWishData(snap.val())));
  }catch(err){
    console.error('Firebase init error:',err);
    renderWishes([]);
  }
}
$('#wishForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const name=$('#wishName').value.trim();
  const msg=$('#wishMsg').value.trim();
  if(!name||!msg)return;
  if(!firebaseReady||!wishesRef){toast('Ucapan online belum siap');return}
  const btn=e.target.querySelector('button[type="submit"]');
  btn.disabled=true;
  try{
    await wishesRef.push({name:name.slice(0,60),msg:msg.slice(0,300),time:firebase.database.ServerValue.TIMESTAMP});
    e.target.reset();
    toast('Ucapan berhasil dikirim');
  }catch(err){
    console.error('Firebase write error:',err);
    toast('Ucapan gagal dikirim');
  }finally{btn.disabled=false}
});
initFirebaseWishes();
