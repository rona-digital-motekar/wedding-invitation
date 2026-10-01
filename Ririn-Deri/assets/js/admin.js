const FIREBASE_CONFIG=window.FIREBASE_CONFIG||{};
const ADMIN_CUTOFF=new Date('2026-11-04T14:00:00+07:00').getTime();
const $=s=>document.querySelector(s);
let rsvpRef=null;
let allRows=[];

function configured(){
  return typeof firebase!=='undefined' &&
    FIREBASE_CONFIG.apiKey &&
    FIREBASE_CONFIG.projectId &&
    FIREBASE_CONFIG.databaseURL;
}
function accessOpen(){return Date.now()<ADMIN_CUTOFF}
function show(el,yes=true){el?.classList.toggle('hidden',!yes)}
function setError(message){
  const error=$('#loginError');
  if(!error)return;
  error.textContent=message;
  show(error,Boolean(message));
}
function showExpired(){
  show($('#loginView'),true);
  show($('#dashboard'),false);
  setError('Akses admin sudah ditutup sejak 4 November 2026.');
  const btn=$('#googleLoginBtn');
  if(btn){btn.disabled=true;btn.textContent='Akses admin ditutup';}
}
function escapeHtml(str){
  const d=document.createElement('div');
  d.textContent=str??'';
  return d.innerHTML;
}
function formatDate(ts){
  const n=Number(ts);
  if(!n)return '-';
  return new Intl.DateTimeFormat('id-ID',{
    day:'2-digit',month:'2-digit',year:'numeric',
    hour:'2-digit',minute:'2-digit'
  }).format(new Date(n));
}
function filteredRows(){
  const q=($('#searchInput')?.value||'').trim().toLowerCase();
  const filter=$('#filterSelect')?.value||'Semua';
  return allRows.filter(r=>{
    const name=String(r.name||'').toLowerCase();
    return (!q||name.includes(q)) && (filter==='Semua'||r.attendance===filter);
  });
}
function render(){
  const rows=filteredRows();
  const body=$('#rsvpTable');
  if(!body)return;
  body.innerHTML=rows.map((r,i)=>`
    <tr>
      <td>${i+1}</td>
      <td><strong>${escapeHtml(r.name)}</strong>${r.guest?`<br><small>Tamu: ${escapeHtml(r.guest)}</small>`:''}</td>
      <td><span class="badge">${escapeHtml(r.attendance||'-')}</span></td>
      <td>${Number(r.guests)||1}</td>
      <td>${escapeHtml(r.note||'-')}</td>
      <td>${formatDate(r.time||r.updatedAt)}</td>
    </tr>
  `).join('');
  show($('#emptyState'),rows.length===0);
  $('#totalCount').textContent=allRows.length;
  $('#attendCount').textContent=allRows.filter(r=>r.attendance==='Hadir').length;
  $('#absentCount').textContent=allRows.filter(r=>r.attendance==='Tidak Hadir').length;
  $('#guestCount').textContent=allRows.reduce((sum,r)=>sum+(Number(r.guests)||0),0);
  $('#adminStatus').textContent=`${allRows.length} RSVP tersimpan · diperbarui ${formatDate(Date.now())}`;
}
async function loadData(){
  if(!accessOpen()){showExpired();return}
  if(!rsvpRef)return;
  $('#adminStatus').textContent='Memuat data...';
  try{
    const snap=await rsvpRef.once('value');
    const data=snap.val()||{};
    allRows=Object.entries(data).map(([id,r])=>({id,...r}))
      .sort((a,b)=>(Number(b.time||b.updatedAt)||0)-(Number(a.time||a.updatedAt)||0));
    render();
  }catch(err){
    console.error(err);
    $('#adminStatus').textContent='Gagal membaca data RSVP.';
  }
}
function downloadCSV(){
  if(!accessOpen()){showExpired();return}
  const rows=filteredRows();
  const header=['Nama','Kehadiran','Jumlah Tamu','Catatan','Tamu Undangan','Waktu'];
  const csv=[header,...rows.map(r=>[
    r.name||'',r.attendance||'',Number(r.guests)||1,r.note||'',r.guest||'',formatDate(r.time||r.updatedAt)
  ])].map(row=>row.map(v=>{
    const s=String(v).replace(/"/g,'""');
    return `"${s}"`;
  }).join(',')).join('\r\n');
  const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=`rsvp-deri-ririn-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function loginWithGoogle(){
  if(!accessOpen()){showExpired();return}
  setError('');
  const btn=$('#googleLoginBtn');
  if(btn){btn.disabled=true;btn.dataset.originalText=btn.textContent;btn.textContent='Menghubungkan ke Google...'}
  try{
    const provider=new firebase.auth.GoogleAuthProvider();
    await firebase.auth().signInWithRedirect(provider);
  }catch(err){
    console.error(err);
    setError('Login Google gagal. Coba lagi.');
    if(btn){btn.disabled=false;btn.textContent=btn.dataset.originalText||'Masuk dengan Google'}
  }
}
function init(){
  if(!configured()){
    setError('Konfigurasi Firebase belum lengkap.');
    return;
  }
  if(!accessOpen()){
    showExpired();
    return;
  }
  firebase.initializeApp(FIREBASE_CONFIG);
  const auth=firebase.auth();
  auth.getRedirectResult().catch(err=>{
    console.error(err);
    setError('Login Google gagal. Coba lagi.');
  });
  auth.onAuthStateChanged(async user=>{
    if(!accessOpen()){
      if(user)await auth.signOut();
      showExpired();
      return;
    }
    if(user){
      show($('#loginView'),false);
      show($('#dashboard'),true);
      rsvpRef=firebase.database().ref('rsvps');
      await loadData();
    }else{
      show($('#loginView'),true);
      show($('#dashboard'),false);
      const btn=$('#googleLoginBtn');
      if(btn){btn.disabled=false;btn.textContent='Masuk dengan Google'}
    }
  });
}
$('#googleLoginBtn')?.addEventListener('click',loginWithGoogle);
$('#logoutBtn')?.addEventListener('click',()=>firebase.auth().signOut());
$('#refreshBtn')?.addEventListener('click',loadData);
$('#searchInput')?.addEventListener('input',render);
$('#filterSelect')?.addEventListener('change',render);
$('#csvBtn')?.addEventListener('click',downloadCSV);
$('#printBtn')?.addEventListener('click',()=>{if(accessOpen())window.print();else showExpired()});
init();
