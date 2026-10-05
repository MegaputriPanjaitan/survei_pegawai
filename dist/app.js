const employees = [
  {id:1,name:'Siti Rahmayani',initials:'SR',role:'Analis Hukum Ahli Muda',unit:'Kurator Keperdataan',score:92.4,rated:true},
  {id:2,name:'Rizky Pratama',initials:'RP',role:'Pengelola Barang Milik Negara',unit:'Tata Usaha',score:91.8,rated:true},
  {id:3,name:'Dewi Kartika Sari',initials:'DK',role:'Analis Kepegawaian',unit:'Tata Usaha',score:89.6,rated:false},
  {id:4,name:'Muhammad Fadli',initials:'MF',role:'Kurator Keperdataan',unit:'Kurator Keperdataan',score:88.9,rated:true},
  {id:5,name:'Nur Aini',initials:'NA',role:'Penelaah Teknis Kebijakan',unit:'Perwalian & Pengampuan',score:88.2,rated:false},
  {id:6,name:'Andi Saputra',initials:'AS',role:'Pengolah Data dan Informasi',unit:'Tata Usaha',score:87.5,rated:false},
  {id:7,name:'Linda Wati',initials:'LW',role:'Analis Hukum Ahli Pertama',unit:'Perwalian & Pengampuan',score:86.9,rated:true},
  {id:8,name:'Budi Santoso',initials:'BS',role:'Pengadministrasi Perkantoran',unit:'Tata Usaha',score:85.8,rated:false},
  {id:9,name:'Fitri Handayani',initials:'FH',role:'Kurator Keperdataan',unit:'Kurator Keperdataan',score:84.9,rated:false},
  {id:10,name:'Rahmat Hidayat',initials:'RH',role:'Penata Layanan Operasional',unit:'Perwalian & Pengampuan',score:83.8,rated:false},
  {id:11,name:'Maya Sari',initials:'MS',role:'Arsiparis Terampil',unit:'Tata Usaha',score:82.7,rated:false},
  {id:12,name:'Dedi Irawan',initials:'DI',role:'Pengelola Perkara',unit:'Kurator Keperdataan',score:81.9,rated:false},
  {id:13,name:'Sri Wahyuni',initials:'SW',role:'Analis Anggaran',unit:'Tata Usaha',score:80.8,rated:false},
  {id:14,name:'Fajar Nugroho',initials:'FN',role:'Verifikator Keuangan',unit:'Tata Usaha',score:79.6,rated:false},
  {id:15,name:'Rina Melati',initials:'RM',role:'Pengadministrasi Umum',unit:'Perwalian & Pengampuan',score:78.4,rated:false},
  {id:16,name:'Agus Salim',initials:'AG',role:'Pramu Bakti',unit:'Tata Usaha',score:76.8,rated:false}
];
const criteria = [
  ['Integritas','Kejujuran dan konsistensi dalam melaksanakan tugas'],
  ['Kualitas kerja','Ketelitian dan mutu hasil pekerjaan'],
  ['Kedisiplinan','Kepatuhan terhadap waktu dan ketentuan'],
  ['Kerja sama','Kemampuan berkolaborasi dan berkomunikasi'],
  ['Pelayanan','Sikap dan kecepatan dalam memberikan layanan']
];
const baseHistory = [
  {rater:'Drs. Hasan Basri',employee:'Siti Rahmayani',date:'05 Okt 2026 · 10:24',score:94},
  {rater:'Maya Prameswari, S.H.',employee:'Rizky Pratama',date:'05 Okt 2026 · 09:48',score:91},
  {rater:'Ahmad Syahrial',employee:'Muhammad Fadli',date:'04 Okt 2026 · 15:32',score:88},
  {rater:'Rudi Hartono, S.H.',employee:'Linda Wati',date:'04 Okt 2026 · 14:06',score:90},
  {rater:'Dra. Nurhayati',employee:'Dewi Kartika Sari',date:'03 Okt 2026 · 11:15',score:87},
  {rater:'Drs. Hasan Basri',employee:'Nur Aini',date:'03 Okt 2026 · 09:41',score:86}
];
let extraHistory = JSON.parse(localStorage.getItem('bhpSurveyHistory') || '[]');
let currentEmployee = null;
let mode = 'officer';
const $ = (s,scope=document)=>scope.querySelector(s);
const $$ = (s,scope=document)=>[...scope.querySelectorAll(s)];
const iconCheck = '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>';

function renderEmployees(){
  const query = $('#employeeSearch').value.toLowerCase();
  const unit = $('#unitFilter').value;
  const filtered = employees.filter(e=>(e.name.toLowerCase().includes(query)||e.role.toLowerCase().includes(query))&&(unit==='all'||e.unit===unit));
  $('#employeeGrid').innerHTML = filtered.length ? filtered.map(e=>`<article class="employee-card"><div class="employee-top"><div class="employee-avatar">${e.initials}</div><div class="employee-info"><h3>${e.name}</h3><p>${e.role}</p></div></div><span class="unit-chip">${e.unit}</span><button class="card-button ${e.rated?'done':''}" data-employee="${e.id}">${e.rated?iconCheck+' Sudah dinilai':'Beri penilaian'}</button></article>`).join('') : '<div class="empty-state"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><p>Pegawai tidak ditemukan.</p></div>';
  $$('[data-employee]').forEach(btn=>btn.addEventListener('click',()=>openSurvey(Number(btn.dataset.employee))));
}
function renderRatings(){
  $('#ratingList').innerHTML = criteria.map((c,i)=>`<div class="rating-row"><label><strong>${c[0]}</strong><span>${c[1]}</span></label><div class="rating-buttons" aria-label="Nilai ${c[0]} dari 1 sampai 5">${[1,2,3,4,5].map(n=>`<input type="radio" id="rating-${i}-${n}" name="rating-${i}" value="${n}" ${n===4?'checked':''}><label for="rating-${i}-${n}">${n}</label>`).join('')}</div></div>`).join('');
}
function openSurvey(id){
  currentEmployee=employees.find(e=>e.id===id);
  $('#selectedEmployee').innerHTML=`<div class="employee-avatar">${currentEmployee.initials}</div><div><strong>${currentEmployee.name}</strong><span>${currentEmployee.role} · ${currentEmployee.unit}</span></div>`;
  renderRatings(); $('#comment').value=''; $('#charCount').textContent='0';
  $('#overlay').classList.add('open'); $('#surveyModal').classList.add('open'); document.body.style.overflow='hidden';
  setTimeout(()=>$('#modalClose').focus(),50);
}
function closeSurvey(){ $('#overlay').classList.remove('open');$('#surveyModal').classList.remove('open');document.body.style.overflow='';currentEmployee=null; }
function updateProgress(){
  const done=employees.filter(e=>e.rated).length; const pct=Math.round(done/employees.length*100);
  $('#progressText').textContent=`${done} dari ${employees.length} selesai`; $('.progress-ring').style.setProperty('--progress',pct); $('.progress-ring span').textContent=`${pct}%`;
}
function submitSurvey(){
  const scores=criteria.map((_,i)=>Number($(`input[name="rating-${i}"]:checked`).value));
  const score=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length*20);
  currentEmployee.rated=true;
  const now=new Date(); const formatted=new Intl.DateTimeFormat('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(now).replace(' pukul ', ' · ');
  extraHistory.unshift({rater:'Ahmad Syahrial',employee:currentEmployee.name,date:formatted,score});
  localStorage.setItem('bhpSurveyHistory',JSON.stringify(extraHistory));
  closeSurvey(); renderEmployees(); updateProgress(); renderTables(); renderActivities();
  $('#submissionCount').textContent=String(64+extraHistory.length); $('#toast').classList.add('show'); setTimeout(()=>$('#toast').classList.remove('show'),3200);
  return {employee:currentEmployee?.name||'pegawai',score,status:'submitted'};
}
function personCell(name,subtitle=''){const initials=name.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();return `<div class="table-person"><div class="table-avatar">${initials}</div><div><strong>${name}</strong>${subtitle?`<span>${subtitle}</span>`:''}</div></div>`}
function renderTables(){
  const all=[...extraHistory,...baseHistory];
  const mine=all.filter(h=>h.rater==='Ahmad Syahrial');
  $('#myHistoryBody').innerHTML=mine.length?mine.map(h=>{const e=employees.find(x=>x.name===h.employee);return `<tr><td>${personCell(h.employee,e?.role)}</td><td>${e?.unit||'-'}</td><td>${h.date}</td><td><span class="score-pill">${h.score}/100</span></td><td><span class="status-pill">Terkirim</span></td></tr>`}).join(''):'<tr><td colspan="5">Belum ada penilaian yang dikirim.</td></tr>';
  const historyQuery=($('#adminHistorySearch')?.value||'').toLowerCase();
  $('#adminHistoryBody').innerHTML=all.filter(h=>(h.rater+h.employee).toLowerCase().includes(historyQuery)).map(h=>`<tr><td>${personCell(h.rater,'Pejabat penilai')}</td><td>${h.employee}</td><td>${h.date}</td><td><span class="score-pill">${h.score}</span></td><td><span class="status-pill">Terkirim</span></td></tr>`).join('');
  const resultQuery=($('#resultSearch')?.value||'').toLowerCase();
  $('#resultsBody').innerHTML=[...employees].sort((a,b)=>b.score-a.score).filter(e=>e.name.toLowerCase().includes(resultQuery)).map((e,i)=>{const cat=e.score>=90?['Sangat baik','great']:e.score>=80?['Baik','good']:['Perlu perhatian','fair'];return `<tr><td><span class="rank ${i<3?'top':''}">${i+1}</span></td><td>${personCell(e.name,e.role)}</td><td>${e.unit}</td><td>${5+(e.id%4)} pejabat</td><td><span class="score-pill">${e.score.toFixed(1).replace('.',',')}</span></td><td><span class="category ${cat[1]}">${cat[0]}</span></td></tr>`}).join('');
}
function renderActivities(){
  $('#activityList').innerHTML=[...extraHistory,...baseHistory].slice(0,3).map(h=>`<div class="activity-item"><div class="activity-avatar">${h.rater.split(' ').slice(0,2).map(x=>x[0]).join('')}</div><div><strong>${h.rater}</strong><span>menilai ${h.employee} · ${h.date.split(' · ')[0]}</span></div><span class="activity-score">${h.score}</span></div>`).join('');
}
function showView(name){
  const labels={survey:'Survei Pegawai',history:'Riwayat Saya',dashboard:'Dashboard',results:'Hasil Penilaian','admin-history':'Riwayat Penilai'};
  $$('.view').forEach(v=>v.classList.remove('active')); $(`#${name.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())}View`).classList.add('active');
  $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===name)); $('#pageCrumb').textContent=labels[name]; $('#sidebar').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
}
function switchMode(){
  mode=mode==='officer'?'admin':'officer'; $('#roleLabel').textContent=mode==='admin'?'Administrator':'Pejabat Penilai';
  document.body.classList.toggle('admin-mode',mode==='admin'); showView(mode==='admin'?'dashboard':'survey');
  $('#toast strong').textContent=mode==='admin'?'Mode admin aktif':'Mode pejabat aktif'; $('#toast span').textContent=mode==='admin'?'Seluruh hasil dan riwayat kini dapat diakses.':'Anda kembali ke halaman pengisian survei.'; $('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2500);
}
function registerWebMCP(){
  const context=document.modelContext;if(!context?.registerTool)return;
  try{
    context.registerTool({name:'open_employee_survey',title:'Buka survei pegawai',description:'Membuka formulir penilaian untuk pegawai BHP Medan berdasarkan ID pegawai.',inputSchema:{type:'object',properties:{employeeId:{type:'number',minimum:1,maximum:16}},required:['employeeId'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:({employeeId})=>{if(!Number.isInteger(employeeId)||!employees.some(e=>e.id===employeeId))throw new Error('ID pegawai tidak valid');showView('survey');openSurvey(employeeId);return {employeeId,employee:currentEmployee.name,status:'form_opened'}}});
    context.registerTool({name:'get_survey_progress',title:'Lihat progres survei',description:'Melihat jumlah pegawai yang sudah dan belum dinilai pada periode aktif.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:()=>{const done=employees.filter(e=>e.rated).length;return {period:'Semester II 2026',completed:done,total:employees.length,remaining:employees.length-done}}});
  }catch(e){console.warn('WebMCP tidak tersedia',e)}
}
$$('.nav-item').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.view)));
$$('[data-view-link]').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.viewLink)));
$('#employeeSearch').addEventListener('input',renderEmployees);$('#unitFilter').addEventListener('change',renderEmployees);
$('#resultSearch').addEventListener('input',renderTables);$('#adminHistorySearch').addEventListener('input',renderTables);
$('#roleSwitch').addEventListener('click',switchMode);$('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
$('#overlay').addEventListener('click',closeSurvey);$('#modalClose').addEventListener('click',closeSurvey);$('#cancelModal').addEventListener('click',closeSurvey);
$('#comment').addEventListener('input',e=>$('#charCount').textContent=e.target.value.length);
$('#surveyForm').addEventListener('submit',e=>{e.preventDefault();submitSurvey()});
$('#exportBtn').addEventListener('click',()=>{const rows=['Peringkat,Nama,Unit,Rata-rata',...[...employees].sort((a,b)=>b.score-a.score).map((e,i)=>`${i+1},${e.name},${e.unit},${e.score}`)];const blob=new Blob([rows.join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ringkasan-penilaian-bhp-medan.csv';a.click();URL.revokeObjectURL(a.href)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSurvey()});
renderEmployees();renderTables();renderActivities();updateProgress();registerWebMCP();
