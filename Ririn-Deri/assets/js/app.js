/* ============================================================
   IKAT CINTA — CLIENT CONFIG
   Change this object for each customer. Keep UI untouched.
   ============================================================ */
const CONFIG = {
  couple:{groom:'Deri', bride:'Ririn', groomFull:'Deri', brideFull:'Ririn', groomParents:'Putra dari Bapak Hendra Wijaya & Ibu Ratna Sari', brideParents:'Putri dari Bapak Sutrisno & Ibu Dewi Anggraini'},
  date:'2027-02-20T08:00:00+07:00',
  heroDate:'SABTU · 20 FEBRUARI 2027 · BANDUNG',
  quote:'“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri supaya kamu cenderung dan merasa tenteram kepadanya.”',
  events:[
    {title:'Akad Nikah',date:'Sabtu, 20 Februari 2027',time:'08.00 WIB',place:'Kediaman Mempelai Wanita, Bandung',map:'https://www.google.com/maps/search/?api=1&query=Bandung'},
    {title:'Resepsi',date:'Sabtu, 20 Februari 2027',time:'11.00 – 14.00 WIB',place:'Graha Kencana Ballroom, Bandung',map:'https://www.google.com/maps/search/?api=1&query=Bandung'}
  ],
  story:[
    {year:'2021',title:'Pertemuan',text:'Dipertemukan lewat teman kuliah yang sama. Obrolan singkat itu kemudian jadi awal dari banyak cerita.'},
    {year:'2022',title:'Pendekatan',text:'Dari sekadar teman diskusi, perlahan tumbuh rasa nyaman yang sulit dijelaskan dengan kata-kata.'},
    {year:'2025',title:'Lamaran',text:'Sebuah pertanyaan sederhana disampaikan di hadapan keluarga besar, dan jawabannya adalah iya.'},
    {year:'2027',title:'Hari Bahagia',text:'Dengan restu kedua orang tua, kami melangkah menuju babak baru yang telah lama dinantikan.'}
  ],
  gallery:[
    {src:'',alt:'Foto prewedding 1',label:'Prewedding 01',large:true},
    {src:'',alt:'Foto prewedding 2',label:'Prewedding 02'},
    {src:'',alt:'Foto prewedding 3',label:'Prewedding 03'},
    {src:'',alt:'Foto prewedding 4',label:'Prewedding 04'},
    {src:'',alt:'Foto prewedding 5',label:'Prewedding 05'}
  ],
  gifts:[{bank:'BCA',number:'8380326796',owner:'Deri Alanwari'}], audioSrc:''
};

const $ = s => document.querySelector(s); const $$ = s => [...document.querySelectorAll(s)];
const guest = new URLSearchParams(location.search).get('to');
const STORAGE = {
  get(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}},
  set(key,val){try{localStorage.setItem(key,JSON.stringify(val));return true}catch{return false}}
};
function safe(str){const d=document.createElement('div');d.textContent=str??'';return d.innerHTML}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1800)}
function formatDate(iso){return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric'}).format(new Date(iso))}

function applyConfig(){
  const c=CONFIG.couple; $('#gateNames').textContent=`${c.groom} & ${c.bride}`; $('#miniNames').textContent=`${c.groom} & ${c.bride}`; $('#footerNames').textContent=`${c.groom} & ${c.bride}`;
  $('#groomName').textContent=c.groom; $('#brideName').textContent=c.bride; $('#groomFull').textContent=c.groomFull; $('#brideFull').textContent=c.brideFull; $('#groomParents').textContent=c.groomParents; $('#brideParents').textContent=c.brideParents; $('#heroDate').textContent=CONFIG.heroDate; $('#quoteText').textContent=CONFIG.quote;
  if(guest) $('#guestName').textContent=guest;
  $('#eventList').innerHTML=CONFIG.events.map(e=>`<article class="event-card reveal"><h3 class="event-title">${safe(e.title)}</h3><div class="event-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg><span>${safe(e.date)} · ${safe(e.time)}</span></div><div class="event-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.4"/></svg><span>${safe(e.place)}</span></div><div class="event-actions"><a class="small-btn" href="${e.map}" target="_blank" rel="noopener">Buka Maps</a><button class="small-btn add-event" data-date="${CONFIG.date}">Tambahkan Pengingat</button></div></article>`).join('');
  $('#storyList').innerHTML=CONFIG.story.map(s=>`<article class="story reveal"><div class="story-dot"></div><div><p style="font-size:10px;letter-spacing:1.5px;color:var(--gold)">${safe(s.year)}</p><h4>${safe(s.title)}</h4><p>${safe(s.text)}</p></div></article>`).join('');
  $('#galleryGrid').innerHTML=CONFIG.gallery.map(g=>g.src?`<button class="gallery-item ${g.large?'large':''}" data-src="${g.src}" aria-label="Buka ${safe(g.alt)}"><img loading="lazy" src="${g.src}" alt="${safe(g.alt)}"><span class="gallery-label">${safe(g.label)}</span></button>`:`<button class="gallery-item gallery-ph ${g.large?'large':''}" aria-label="Placeholder ${safe(g.alt)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 5h-3.2L15 3H9L7.2 5H4a1 1 0 00-1 1v13a1 1 0 001 1h16a1 1 0 001-1V6a1 1 0 00-1-1z"/><circle cx="12" cy="13" r="3.5"/></svg><span class="gallery-label">${safe(g.label)}</span></button>`).join('');
  $('#giftGrid').innerHTML=CONFIG.gifts.map(g=>`<div class="gift"><div><p class="gift-bank">${safe(g.bank)}</p><p class="gift-num">${safe(g.number)} · a.n. ${safe(g.owner)}</p></div><button class="copy" data-copy="${safe(g.number)}">Salin</button></div>`).join('');
  bindDynamic();
}

function openGate(){ $('#gate').classList.add('hide'); document.body.classList.remove('locked'); setTimeout(()=>$('#gate').remove(),900); }
$('#openBtn').addEventListener('click',openGate);

function countdown(){const diff=new Date(CONFIG.date).getTime()-Date.now();if(diff<=0){['dd','hh','mm','ss'].forEach(id=>$('#'+id).textContent='00');return}$('#dd').textContent=String(Math.floor(diff/86400000)).padStart(2,'0');$('#hh').textContent=String(Math.floor(diff/3600000)%24).padStart(2,'0');$('#mm').textContent=String(Math.floor(diff/60000)%60).padStart(2,'0');$('#ss').textContent=String(Math.floor(diff/1000)%60).padStart(2,'0')}
setInterval(countdown,1000); countdown();

function bindDynamic(){
  $$('.add-event').forEach(btn=>btn.addEventListener('click',()=>downloadICS(new Date(btn.dataset.date))));
  $$('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{const text=btn.dataset.copy;try{await navigator.clipboard.writeText(text);btn.classList.add('copied');btn.textContent='Tersalin';toast('Nomor rekening tersalin');setTimeout(()=>{btn.textContent='Salin';btn.classList.remove('copied')},1400)}catch{toast('Gagal menyalin')}}));
  $$('.gallery-item[data-src]').forEach(btn=>btn.addEventListener('click',()=>{$('#lightboxImg').src=btn.dataset.src;$('#lightbox').style.display='grid'}));
}

function downloadICS(date){const start=date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const end=new Date(date.getTime()+60*60*1000).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:Pernikahan ${CONFIG.couple.groom} & ${CONFIG.couple.bride}\nDESCRIPTION:Undangan pernikahan\nEND:VEVENT\nEND:VCALENDAR`;const blob=new Blob([ics],{type:'text/calendar'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='undangan-pernikahan.ics';a.click();URL.revokeObjectURL(url);toast('Kalender berhasil dibuat')}
$('#calendarBtn').addEventListener('click',()=>downloadICS(new Date(CONFIG.date)));

// share/personalized URL
function buildLink(){const url=new URL(location.href);const name=$('#shareName').value.trim();name?url.searchParams.set('to',name):url.searchParams.delete('to');return url.toString()}
async function shareInvite(){const link=buildLink();const name=$('#shareName').value.trim()||'kamu';const text=`Assalamualaikum ${name}, kami mengundang kamu di pernikahan ${CONFIG.couple.groom} & ${CONFIG.couple.bride}.\n\n${link}`;if(navigator.share){try{await navigator.share({title:`Undangan ${CONFIG.couple.groom} & ${CONFIG.couple.bride}`,text,url:link})}catch{}}else{window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank')}}
$('#shareBtn').addEventListener('click',shareInvite); $('#shareTop').addEventListener('click',shareInvite); $('#copyLinkBtn').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(buildLink());toast('Link undangan tersalin')}catch{toast('Gagal menyalin link')}});

// RSVP
let attendance='Hadir'; $$('[data-value]').forEach(btn=>btn.addEventListener('click',()=>{$$('[data-value]').forEach(x=>x.classList.remove('active'));btn.classList.add('active');attendance=btn.dataset.value}));
function loadRSVP(){const x=STORAGE.get('ikat-rsvp');if(!x)return;$('#rsvpName').value=x.name||'';$('#rsvpGuests').value=x.guests||1;$('#rsvpNote').value=x.note||'';attendance=x.attendance||'Hadir';$$('[data-value]').forEach(b=>b.classList.toggle('active',b.dataset.value===attendance));$('#rsvpCard').classList.add('hidden');$('#rsvpSuccess').classList.remove('hidden')}
$('#rsvpForm').addEventListener('submit',e=>{e.preventDefault();const data={name:$('#rsvpName').value.trim(),attendance,guests:Math.max(1,Math.min(5,Number($('#rsvpGuests').value)||1)),note:$('#rsvpNote').value.trim(),updatedAt:Date.now()};STORAGE.set('ikat-rsvp',data);$('#rsvpCard').classList.add('hidden');$('#rsvpSuccess').classList.remove('hidden');toast('RSVP tersimpan')});$('#editRsvp').addEventListener('click',()=>{$('#rsvpCard').classList.remove('hidden');$('#rsvpSuccess').classList.add('hidden')});loadRSVP();

// wishes
const SEED_WISHES=[{name:'Sarah & Dimas',msg:'Barakallahu laka wa baraka alaika, semoga menjadi keluarga sakinah, mawaddah, warahmah!',time:Date.now()-172800000},{name:'Tante Wulan',msg:'Selamat menempuh hidup baru. Semoga selalu diberi keberkahan dan kebahagiaan.',time:Date.now()-86400000},{name:'Rizky',msg:'Akhirnya nikah juga wkwk. Selamat berbahagia untuk kalian berdua!',time:Date.now()-18000000}];
function ago(ts){const h=Math.floor((Date.now()-ts)/3600000);if(h<1)return'Baru saja';if(h<24)return`${h} jam lalu`;return`${Math.floor(h/24)} hari lalu`}
function renderWishes(){let arr=STORAGE.get('ikat-wishes');if(!Array.isArray(arr)||!arr.length)arr=SEED_WISHES;$('#wishList').innerHTML=arr.slice().reverse().map(w=>`<article class="wish"><div class="wish-top"><strong class="wish-name">${safe(w.name)}</strong><span class="wish-time">${ago(w.time)}</span></div><p class="wish-msg">${safe(w.msg)}</p></article>`).join('')}
$('#wishForm').addEventListener('submit',e=>{e.preventDefault();let arr=STORAGE.get('ikat-wishes');if(!Array.isArray(arr)||!arr.length)arr=SEED_WISHES;arr.push({name:$('#wishName').value.trim(),msg:$('#wishMsg').value.trim(),time:Date.now()});STORAGE.set('ikat-wishes',arr.slice(-100));e.target.reset();renderWishes();toast('Ucapan berhasil ditambahkan')});renderWishes();

// scroll effects + section spy
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.13});$$('.reveal').forEach(x=>observer.observe(x));
const sections=$$('main section[id]');const nav=$$('.nav-item');const spy=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){nav.forEach(n=>n.classList.toggle('active',n.dataset.target===e.target.id))}})},{rootMargin:'-45% 0px -45% 0px',threshold:0});sections.forEach(s=>spy.observe(s));
window.addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=(max>0?(scrollY/max)*100:0)+'%'});

// lightbox
$('#lightboxClose').addEventListener('click',()=>$('#lightbox').style.display='none');$('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')$('#lightbox').style.display='none'});document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#lightbox').style.display='none'});

// music adapter: real audio when configured, graceful fallback otherwise
let audio=null; if(CONFIG.audioSrc){audio=new Audio(CONFIG.audioSrc);audio.loop=true}$('#musicBtn').addEventListener('click',async()=>{if(!audio){toast('Pasang file musik di CONFIG.audioSrc');return}try{if(audio.paused){await audio.play();$('#musicBtn').style.background='var(--gold)';toast('Musik diputar')}else{audio.pause();$('#musicBtn').style.background='var(--surface)';toast('Musik dijeda')}}catch{toast('Browser memblokir autoplay')}});

applyConfig();

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
    navigator.clipboard?.writeText(number).then(() => {
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
