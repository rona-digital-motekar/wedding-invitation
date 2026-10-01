const FIREBASE_CONFIG = window.FIREBASE_CONFIG || {};
const ADMIN_CUTOFF = new Date('2026-11-04T23:59:59+07:00').getTime();
const $ = s => document.querySelector(s);
let rsvpRef = null;
let allRows = [];
let auth = null;

function configured(){
  return typeof firebase !== 'undefined' &&
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.databaseURL;
}

function accessOpen(){ return Date.now() < ADMIN_CUTOFF; }
function show(el, yes = true){ el?.classList.toggle('hidden', !yes); }

function setError(message){
  const error = $('#loginError');
  if(!error) return;
  error.textContent = message;
  show(error, Boolean(message));
}

function showExpired(){
  show($('#loginView'), true);
  show($('#dashboard'), false);
  setError('Akses admin sudah ditutup sejak 5 November 2026.');
  const btn = $('#googleLoginBtn');
  if(btn){ btn.disabled = true; btn.textContent = 'Akses admin ditutup'; }
}

function showDashboard(user){
  if(!accessOpen()){
    showExpired();
    if(auth && user) auth.signOut().catch(()=>{});
    return;
  }
  show($('#loginView'), false);
  show($('#dashboard'), true);
  if($('#adminUser')){
    $('#adminUser').textContent = user?.email || 'Akun Google';
  }
  if(!rsvpRef && typeof firebase !== 'undefined' && firebase.database){
    rsvpRef = firebase.database().ref('rsvps');
  }
  loadData();
}

function resetLoginButton(){
  const btn = $('#googleLoginBtn');
  if(btn){
    btn.disabled = false;
    btn.textContent = 'Masuk dengan Google';
  }
}

function friendlyAuthError(err){
  const code = err?.code || '';
  if(code === 'auth/unauthorized-domain'){
    return 'Domain belum diizinkan di Firebase Authentication. Tambahkan rona-digital-motekar.github.io di Authorized domains.';
  }
  if(code === 'auth/operation-not-allowed'){
    return 'Google Sign-In belum aktif di Firebase Authentication.';
  }
  if(code === 'auth/popup-blocked'){
    return 'Popup Google diblokir browser. Mengalihkan ke login Google...';
  }
  if(code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request'){
    return 'Login dibatalkan. Silakan tekan Masuk dengan Google lagi.';
  }
  if(code === 'auth/invalid-api-key' || code === 'auth/api-key-not-valid'){
    return 'Konfigurasi Firebase tidak valid. Periksa Web App config.';
  }
  return `Login Google gagal (${code || 'unknown error'}).`;
}

function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str ?? '';
  return d.innerHTML;
}

function formatDate(ts){
  const n = Number(ts);
  if(!n) return '-';
  return new Intl.DateTimeFormat('id-ID', {
    day:'2-digit', month:'2-digit', year:'numeric',
    hour:'2-digit', minute:'2-digit'
  }).format(new Date(n));
}

function filteredRows(){
  const q = ($('#searchInput')?.value || '').trim().toLowerCase();
  const filter = $('#filterSelect')?.value || 'Semua';
  return allRows.filter(r => {
    const name = String(r.name || '').toLowerCase();
    return (!q || name.includes(q)) && (filter === 'Semua' || r.attendance === filter);
  });
}

function render(){
  const rows = filteredRows();
  const body = $('#rsvpTable');
  if(!body) return;
  body.innerHTML = rows.map((r,i) => `
    <tr>
      <td>${i+1}</td>
      <td><strong>${escapeHtml(r.name)}</strong>${r.guest ? `<br><small>Tamu: ${escapeHtml(r.guest)}</small>` : ''}</td>
      <td><span class="badge">${escapeHtml(r.attendance || '-')}</span></td>
      <td>${Number(r.guests) || 1}</td>
      <td>${escapeHtml(r.note || '-')}</td>
      <td>${formatDate(r.time || r.updatedAt)}</td>
    </tr>
  `).join('');
  show($('#emptyState'), rows.length === 0);
  $('#totalCount').textContent = allRows.length;
  $('#attendCount').textContent = allRows.filter(r => r.attendance === 'Hadir').length;
  $('#absentCount').textContent = allRows.filter(r => r.attendance === 'Tidak Hadir').length;
  $('#guestCount').textContent = allRows.reduce((sum,r) => sum + (Number(r.guests) || 0), 0);
  $('#adminStatus').textContent = `${allRows.length} RSVP tersimpan · diperbarui ${formatDate(Date.now())}`;
}

async function loadData(){
  if(!accessOpen()){ showExpired(); return; }
  if(!rsvpRef) return;
  $('#adminStatus').textContent = 'Memuat data...';
  try{
    const snap = await rsvpRef.once('value');
    const data = snap.val() || {};
    allRows = Object.entries(data).map(([id,r]) => ({id,...r}))
      .sort((a,b) => (Number(b.time || b.updatedAt) || 0) - (Number(a.time || a.updatedAt) || 0));
    render();
  }catch(err){
    console.error('RSVP read error:', err);
    $('#adminStatus').textContent = 'Gagal membaca data RSVP.';
    setError('Login berhasil, tetapi data RSVP belum bisa dibaca. Periksa Realtime Database Rules.');
  }
}

function downloadCSV(){
  if(!accessOpen()){ showExpired(); return; }
  const rows = filteredRows();
  const header = ['Nama','Kehadiran','Jumlah Tamu','Catatan','Tamu Undangan','Waktu'];
  const csv = [header,...rows.map(r => [
    r.name || '', r.attendance || '', Number(r.guests) || 1, r.note || '', r.guest || '', formatDate(r.time || r.updatedAt)
  ])].map(row => row.map(v => {
    const s = String(v).replace(/"/g,'""');
    return `"${s}"`;
  }).join(',')).join('\r\n');
  const blob = new Blob(['\ufeff' + csv], {type:'text/csv;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rsvp-deri-ririn-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const INVITATION_BASE_URL = new URL('./index.html', window.location.href).href;
const shareRecipientInput = $('#shareRecipient');
const shareLinkPreview = $('#shareLinkPreview');

function getPersonalShareUrl(){
  const url = new URL(INVITATION_BASE_URL);
  const recipient = (shareRecipientInput?.value || '').trim();
  if(recipient) url.searchParams.set('to', recipient);
  return url.toString();
}

function updateSharePreview(){
  if(!shareLinkPreview) return;
  const recipient = (shareRecipientInput?.value || '').trim();
  shareLinkPreview.textContent = recipient
    ? `Link siap dibagikan untuk: ${recipient}`
    : 'Isi nama penerima untuk membuat link personal.';
}

async function sharePersonalInvitation(){
  const recipient = (shareRecipientInput?.value || '').trim();
  if(!recipient){
    shareRecipientInput?.focus();
    setError('');
    $('#adminStatus').textContent = 'Isi nama penerima terlebih dahulu untuk membuat link personal.';
    return;
  }
  const data = {
    title:'Deri & Ririn — Undangan Pernikahan',
    text:`Undangan pernikahan Deri & Ririn untuk ${recipient}`,
    url:getPersonalShareUrl()
  };
  try{
    if(navigator.share){
      await navigator.share(data);
      return;
    }
    await navigator.clipboard.writeText(data.url);
    $('#adminStatus').textContent = 'Link undangan personal berhasil disalin.';
  }catch(err){
    if(err?.name !== 'AbortError'){
      console.error('Share error:', err);
      $('#adminStatus').textContent = 'Belum bisa membagikan link. Gunakan Salin Link.';
    }
  }
}

shareRecipientInput?.addEventListener('input', updateSharePreview);
$('#sectionShareBtn')?.addEventListener('click', sharePersonalInvitation);
$('#copyShareBtn')?.addEventListener('click', async()=>{
  const recipient = (shareRecipientInput?.value || '').trim();
  if(!recipient){
    shareRecipientInput?.focus();
    $('#adminStatus').textContent = 'Isi nama penerima terlebih dahulu untuk membuat link personal.';
    return;
  }
  try{
    await navigator.clipboard.writeText(getPersonalShareUrl());
    $('#adminStatus').textContent = 'Link undangan personal berhasil disalin.';
  }catch(err){
    console.error('Copy error:', err);
    $('#adminStatus').textContent = 'Link belum bisa disalin dari browser ini.';
  }
});
updateSharePreview();

async function loginWithGoogle(){
  if(!accessOpen()){ showExpired(); return; }
  setError('');
  const btn = $('#googleLoginBtn');
  if(btn){
    btn.disabled = true;
    btn.textContent = 'Menghubungkan ke Google...';
  }
  try{
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({prompt:'select_account'});
    const result = await auth.signInWithPopup(provider);
    if(result?.user) showDashboard(result.user);
  }catch(err){
    console.error('Google sign-in error:', err);
    if(err?.code === 'auth/popup-blocked'){
      setError(friendlyAuthError(err));
      try{
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({prompt:'select_account'});
        await auth.signInWithRedirect(provider);
        return;
      }catch(redirectErr){
        console.error('Google redirect error:', redirectErr);
        setError(friendlyAuthError(redirectErr));
      }
    }else if(err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/cancelled-popup-request'){
      setError(friendlyAuthError(err));
    }else{
      setError(friendlyAuthError(err));
    }
    resetLoginButton();
  }
}

async function init(){
  if(!configured()){
    setError('Konfigurasi Firebase belum lengkap.');
    return;
  }
  if(!accessOpen()){
    showExpired();
    return;
  }

  try{
    if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    auth = firebase.auth();
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    auth.onAuthStateChanged(user => {
      if(!accessOpen()){
        if(user) auth.signOut().catch(()=>{});
        showExpired();
        return;
      }
      if(user) showDashboard(user);
      else{
        show($('#loginView'), true);
        show($('#dashboard'), false);
        resetLoginButton();
      }
    });

    try{
      const result = await auth.getRedirectResult();
      if(result?.user) showDashboard(result.user);
    }catch(err){
      console.error('Google redirect result error:', err);
      setError(friendlyAuthError(err));
      resetLoginButton();
    }

    if(auth.currentUser) showDashboard(auth.currentUser);
  }catch(err){
    console.error('Firebase admin init error:', err);
    setError(`Firebase admin gagal dimuat (${err?.code || 'unknown error'}).`);
    resetLoginButton();
  }
}

$('#googleLoginBtn')?.addEventListener('click', loginWithGoogle);
$('#logoutBtn')?.addEventListener('click', () => auth?.signOut());
$('#refreshBtn')?.addEventListener('click', loadData);
$('#searchInput')?.addEventListener('input', render);
$('#filterSelect')?.addEventListener('change', render);
$('#csvBtn')?.addEventListener('click', downloadCSV);
$('#printBtn')?.addEventListener('click', () => {
  if(accessOpen()) window.print();
  else showExpired();
});

init();
