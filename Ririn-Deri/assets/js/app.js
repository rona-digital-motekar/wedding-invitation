/* ============================================================
   IKAT CINTA — CLIENT CONFIG
   Change this object for each customer. Keep UI untouched.
   ============================================================ */
const CONFIG = {
  couple:{groom:'Deri Alan Wari', bride:'Ririn Riyanti', groomFull:'Deri Alan Wari', brideFull:'Ririn Riyanti', groomParents:'Putra dari Bapak Wawan Kosawara & Ibu Nia Kurnia', brideParents:'Putri dari Bapak Didin Maulana & Ibu Juju Hariyanti'},
  date:'2026-10-25T00:00:00+07:00',
  heroDate:'MINGGU · 25 OKTOBER 2026 · BANDUNG',
  quote:'“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri supaya kamu cenderung dan merasa tenteram kepadanya.”',
  events:[
    {title:'Akad Nikah',date:'Kamis, 22 Oktober 2026',dateISO:'2026-10-22T08:00:00+07:00',time:'08.00 WIB',place:'Kediaman Mempelai Wanita, Bandung',map:'https://www.google.com/maps/search/?api=1&query=Bandung'},
    {title:'Resepsi',date:'Minggu, 25 Oktober 2026',dateISO:'2026-10-25T11:00:00+07:00',time:'11.00 – 14.00 WIB',place:'Graha Kencana Ballroom, Bandung',map:'https://www.google.com/maps/search/?api=1&query=Bandung'}
  ],
  gallery:[
    {src:'./foto/gallery-01.webp',alt:'Foto Ririn dan Deri 1',label:'Momen 01',large:true},
    {src:'./foto/gallery-02.webp',alt:'Foto Ririn dan Deri 2',label:'Momen 02'},
    {src:'./foto/gallery-03.webp',alt:'Foto Ririn dan Deri 3',label:'Momen 03'},
    {src:'./foto/gallery-04.webp',alt:'Foto Ririn dan Deri 4',label:'Momen 04'},
    {src:'./foto/gallery-05.webp',alt:'Foto Ririn dan Deri 5',label:'Momen 05'}
  ],
  groomPhoto:'./foto/mempelai-pria.webp', bridePhoto:'./foto/mempelai-wanita.webp',
  gifts:[{bank:'BCA',number:'8380326796',owner:'Deri Alanwari'}], audioSrc:'./music/wedding-nasyid.mp3'
};

const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];
const guest = new URLSearchParams(location.search).get('to');
const APP_VERSION = '2026-09-29-1745';
const STORAGE = {
  get(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}},
  set(key,val){try{localStorage.setItem(key,JSON.stringify(val));return true}catch{return false}}
};
function safe(str){const d=document.createElement('div');d.textContent=str??'';return d.innerHTML}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1800)}
function formatDate(iso){return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric'}).format(new Date(iso))}

function ago(ts){
  const diff=Math.max(0,Date.now()-Number(ts||Date.now()));
  const mins=Math.floor(diff/60000);
  if(mins<1) return 'Baru saja';
  if(mins<60) return `${mins} menit lalu`;
  const hours=Math.floor(mins/60);
  if(hours<24) return `${hours} jam lalu`;
  const days=Math.floor(hours/24);
  if(days<7) return `${days} hari lalu`;
  return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'}).format(new Date(ts));
}

function applyConfig(){
  const c=CONFIG.couple; $('#gateNames').textContent=`${c.groom} & ${c.bride}`; $('#miniNames').textContent=`${c.groom} & ${c.bride}`; $('#footerNames').textContent=`${c.groom} & ${c.bride}`;
  $('#groomName').textContent=c.groom; $('#brideName').textContent=c.bride; $('#groomFull').textContent=c.groomFull; $('#brideFull').textContent=c.brideFull; $('#groomParents').textContent=c.groomParents; $('#brideParents').textContent=c.brideParents; $('#heroDate').textContent=CONFIG.heroDate; $('#quoteText').textContent=CONFIG.quote;
  $('#groomPhoto').innerHTML=`<img src="${CONFIG.groomPhoto}" alt="${safe(c.groomFull)}" loading="eager" onerror="this.style.display='none'">`;
  $('#bridePhoto').innerHTML=`<img src="${CONFIG.bridePhoto}" alt="${safe(c.brideFull)}" loading="eager" onerror="this.style.display='none'">`;
  if(guest) $('#guestName').textContent=guest;
  $('#eventList').innerHTML=CONFIG.events.map(e=>`<article class="event-card reveal"><h3 class="event-title">${safe(e.title)}</h3><div class="event-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg><span>${safe(e.date)} · ${safe(e.time)}</span></div><div class="event-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.4"/></svg><span>${safe(e.place)}</span></div><div class="event-actions"><a class="small-btn" href="${e.map}" target="_blank" rel="noopener">Buka Maps</a><button class="small-btn add-event" data-date="${e.dateISO || CONFIG.date}">Tambahkan Pengingat</button></div></article>`).join('');
  $('#galleryGrid').innerHTML=CONFIG.gallery.map(g=>g.src?`<button class="gallery-item ${g.large?'large':''}" data-src="${g.src}" aria-label="Buka ${safe(g.alt)}"><img loading="lazy" src="${g.src}" alt="${safe(g.alt)}"><span class="gallery-label">${safe(g.label)}</span></button>`:`<button class="gallery-item gallery-ph ${g.large?'large':''}" aria-label="Placeholder ${safe(g.alt)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 5h-3.2L15 3H9L7.2 5H4a1 1 0 00-1 1v13a1 1 0 001 1h16a1 1 0 001-1V6a1 1 0 00-1-1z"/><circle cx="12" cy="13" r="3.5"/></svg><span class="gallery-label">${safe(g.label)}</span></button>`).join('');
  $('#giftGrid').innerHTML=CONFIG.gifts.map(g=>`<div class="gift"><div><p class="gift-bank">${safe(g.bank)}</p><p class="gift-num">${safe(g.number)} · a.n. ${safe(g.owner)}</p></div><button class="copy" data-copy="${safe(g.number)}">Salin</button></div>`).join('');
  bindDynamic();
}

// Core render first: optional integrations must never blank the invitation.
try { applyConfig(); } catch (err) { console.error('Core render error:', err); }

function initReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  // Fallback for browsers without IntersectionObserver.
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

initReveal();

function openGate(){
  const gate = $('#gate');
  const leaves = $('#windLeaves');
  if (leaves) leaves.classList.add('active');
  if (gate) gate.classList.add('hide');
  document.body.classList.remove('locked');

  setTimeout(() => {
    if (gate) gate.remove();
    if (leaves) leaves.classList.remove('active');
  }, 1700);
}
$('#openBtn').addEventListener('click',openGate);
// Background music: autoplay when allowed; otherwise the first user gesture
// (including "Buka Undangan") starts it. There is intentionally no music button.
const audio = $('#bgMusic');
if (audio) {
  audio.src = CONFIG.audioSrc;
  audio.loop = true;
  audio.preload = 'auto';
  const startMusic = () => audio.play().catch(() => {});
  startMusic();
  document.addEventListener('pointerdown', startMusic, { once: true });
  document.addEventListener('keydown', startMusic, { once: true });
  if ($('#openBtn')) $('#openBtn').addEventListener('click', startMusic);
}



function countdown(){const diff=new Date(CONFIG.date).getTime()-Date.now();if(diff<=0){['dd','hh','mm','ss'].forEach(id=>$('#'+id).textContent='00');return}$('#dd').textContent=String(Math.floor(diff/86400000)).padStart(2,'0');$('#hh').textContent=String(Math.floor(diff/3600000)%24).padStart(2,'0');$('#mm').textContent=String(Math.floor(diff/60000)%60).padStart(2,'0');$('#ss').textContent=String(Math.floor(diff/1000)%60).padStart(2,'0')}
setInterval(countdown,1000); countdown();

function bindDynamic(){
  $$('.add-event').forEach(btn=>btn.addEventListener('click',()=>downloadICS(new Date(btn.dataset.date))));
  $$('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const text=btn.dataset.copy;try{await navigator.clipboard.writeText(text);btn.classList.add('copied');btn.textContent='Tersalin';toast('Nomor rekening tersalin');setTimeout(()=>{btn.textContent='Salin';btn.classList.remove('copied')},1400)}catch{toast('Gagal menyalin')}}));
  $$('.gallery-item[data-src]').forEach(btn=>btn.addEventListener('click',()=>{$('#lightboxImg').src=btn.dataset.src;$('#lightbox').style.display='grid'}));
}

function downloadICS(date){const start=date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const end=new Date(date.getTime()+60*60*1000).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:Pernikahan ${CONFIG.couple.groom} & ${CONFIG.couple.bride}\nDESCRIPTION:Undangan pernikahan\nEND:VEVENT\nEND:VCALENDAR`;const blob=new Blob([ics],{type:'text/calendar'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='undangan-pernikahan.ics';a.click();URL.revokeObjectURL(url);toast('Kalender berhasil dibuat')}
if ($('#calendarBtn')) $('#calendarBtn').addEventListener('click',()=>downloadICS(new Date(CONFIG.date)));

// share/personalized URL
function buildLink(){const url=new URL(location.href);const name=$('#shareName').value.trim();name?url.searchParams.set('to',name):url.searchParams.delete('to');return url.toString()}
async function shareInvite(){
  const link=buildLink();
  const name=$('#shareName').value.trim()||'kamu';
  const text=`Assalamualaikum ${name}, kami mengundang kamu di pernikahan ${CONFIG.couple.groom} & ${CONFIG.couple.bride}.`;
  if(navigator.share){
    try{
      await navigator.share({title:`Undangan ${CONFIG.couple.groom} & ${CONFIG.couple.bride}`,text,url:link});
    }catch{}
  }else{
    window.open('https://wa.me/?text='+encodeURIComponent(text+'\n\n'+link),'_blank');
  }
}
if ($('#shareBtn')) $('#shareBtn').addEventListener('click',shareInvite); if ($('#shareTop')) $('#shareTop').addEventListener('click',shareInvite); if ($('#copyLinkBtn')) $('#copyLinkBtn').addEventListener('click',async()=>{
  try{
    const link=buildLink();
    await navigator.clipboard.writeText(link);
    toast('Link undangan tersalin');
  }catch{toast('Gagal menyalin link')}
});

// RSVP
let attendance='Hadir'; $$('[data-value]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-value]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');attendance=btn.dataset.value}));
function loadRSVP(){const x=STORAGE.get('ikat-rsvp');if(!x)return;$('#rsvpName').value=x.name||'';$('#rsvpGuests').value=x.guests||1;$('#rsvpNote').value=x.note||'';attendance=x.attendance||'Hadir';$$('[data-value]').forEach(b=>b.classList.toggle('active',b.dataset.value===attendance));$('#rsvpCard').classList.add('hidden');$('#rsvpSuccess').classList.remove('hidden')}
if ($('#rsvpForm')) $('#rsvpForm').addEventListener('submit',e=>{e.preventDefault();const data={name:$('#rsvpName').value.trim(),attendance,guests:Math.max(1,Math.min(5,Number($('#rsvpGuests').value)||1)),note:$('#rsvpNote').value.trim(),updatedAt:Date.now()};STORAGE.set('ikat-rsvp',data);$('#rsvpCard').classList.add('hidden');$('#rsvpSuccess').classList.remove('hidden');toast('RSVP tersimpan')});if ($('#editRsvp')) $('#editRsvp').addEventListener('click',()=>{$('#rsvpCard').classList.remove('hidden');$('#rsvpSuccess').classList.add('hidden')});loadRSVP();

// wishes — Firebase Realtime Database
// Paste your Firebase web config below after creating the Realtime Database.
const FIREBASE_CONFIG = window.FIREBASE_CONFIG || {};
let wishesRef = null;
let firebaseReady = false;
function firebaseConfigured(){
  return typeof firebase !== 'undefined' &&
    FIREBASE_CONFIG.apiKey && !FIREBASE_CONFIG.apiKey.startsWith('PASTE_') &&
    FIREBASE_CONFIG.projectId && !FIREBASE_CONFIG.projectId.startsWith('PASTE_') &&
    FIREBASE_CONFIG.databaseURL && !FIREBASE_CONFIG.databaseURL.includes('PASTE_');
}
function formatWishData(obj){
  return Object.entries(obj || {}).map(([id,w])=>({id,...w})).filter(w=>w && w.name && w.msg).sort((a,b)=>(Number(b.time)||0)-(Number(a.time)||0)).slice(0,100);
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
    toast('Firebase belum dikonfigurasi');
    return;
  }
  try{
    if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    wishesRef=firebase.database().ref('wishes');
    firebaseReady=true;
    wishesRef.limitToLast(100).on('value', snap=>renderWishes(formatWishData(snap.val())));
  }catch(err){
    console.error('Firebase init error:',err);
    renderWishes([]);
    toast('Ucapan online gagal terhubung');
  }
}
if ($('#wishForm')) $('#wishForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const name=$('#wishName').value.trim();
  const msg=$('#wishMsg').value.trim();
  if(!name || !msg)return;
  if(!firebaseReady || !wishesRef){ toast('Ucapan online belum siap'); return; }
  const btn=e.target.querySelector('button[type="submit"]');
  btn.disabled=true;
  try{
    await wishesRef.push({name:name.slice(0,60),msg:msg.slice(0,300),time:firebase.database.ServerValue.TIMESTAMP});
    e.target.reset();
    toast('Ucapan berhasil dikirim');
  }catch(err){
    console.error('Firebase write error:',err);
    toast('Ucapan gagal dikirim');
  }finally{btn.disabled=false;}
});
initFirebaseWishes();


/* ===== Digital Envelope / Bank Card ===== */
function renderBankGift(gift) {
  const number = gift.number || '';
  const owner = gift.owner || '';
  const bank = gift.bank || '';
  return `
    <div class="gift-card-wrap">
      <div class="gift-card" data-gift-card tabindex="0" role="button" aria-label="Balik kartu untuk melihat detail rekening">
        <div class="gift-card-face gift-card-front">
          <div>
            <div class="gift-card-brand">${bank}</div>
            <div class="gift-card-chip" aria-hidden="true"></div>
          </div>
          <div>
            <div class="gift-card-number">${number}</div>
            <div class="gift-card-owner">${owner}</div>
          </div>
          <div class="gift-card-hint">Tap kartu untuk membalik</div>
        </div>
        <div class="gift-card-face gift-card-back">
          <div>
            <div class="gift-card-brand">Digital Envelope</div>
            <div class="gift-card-owner" style="margin-top:18px">${owner}</div>
            <div class="gift-card-number">${number}</div>
          </div>
          <button type="button" class="gift-copy-btn" data-copy-account="${number}">
            Salin Nomor Rekening
          </button>
        </div>
      </div>
    </div>`;
}

document.addEventListener('click', function(e) {
  const card = e.target.closest('[data-gift-card]');
  if (card && !e.target.closest('[data-copy-account]')) {
    card.classList.toggle('is-flipped');
  }

  const copyBtn = e.target.closest('[data-copy-account]');
  if (copyBtn) {
    const number = copyBtn.getAttribute('data-copy-account') || '';
    if (navigator.clipboard) navigator.clipboard.writeText(number).then(() => {
      const old = copyBtn.textContent;
      copyBtn.textContent = 'Tersalin ✓';
      setTimeout(() => copyBtn.textContent = old, 1400);
    }).catch(() => {
      window.prompt('Salin nomor rekening berikut:', number);
    });
  }
});

document.addEventListener('keydown', function(e) {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-gift-card]')) {
    e.preventDefault();
    e.target.classList.toggle('is-flipped');
  }
});
