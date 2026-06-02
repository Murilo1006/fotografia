
// ── CURSOR ──
document.addEventListener('mousemove', e => {
  const c = document.getElementById('cursor');
  const r = document.getElementById('cursorRing');
  if(c){ c.style.left=e.clientX+'px'; c.style.top=e.clientY+'px'; }
  if(r){ r.style.left=e.clientX+'px'; r.style.top=e.clientY+'px'; }
});

// ── MOBILE MENU ──
function toggleMenu() {
  const m=document.getElementById('mobileMenu'),b=document.getElementById('hamburger');
  const o=m.classList.contains('open');
  m.classList.toggle('open',!o);
  b.classList.toggle('open',!o);
}
function mobileGoTo(page){
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
  
  goTo(page);
}

// ── LOGIN ──
function doLogin(){
  const v=document.getElementById('loginInput').value;
  if(v==='1234'){
    const lp=document.getElementById('loginPage');
    lp.classList.add('hiding');
    setTimeout(()=>{ lp.style.display='none'; initSite(); },800);
  } else {
    const e=document.getElementById('loginErr');
    e.style.display='block';
    setTimeout(()=>e.style.display='none',2500);
  }
}
document.getElementById('loginInput').addEventListener('keypress',e=>{if(e.key==='Enter')doLogin();});

// ── NAVIGATION ──
let currentPage='hero', heroShown=true;
const pagesWithFooter=['sobre'];

function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}

function goTo(page){
  if(page==='hero'&&!heroShown) page='sobre';
  if(page===currentPage){
    const cur=document.getElementById('page'+cap(currentPage));
    if(cur) cur.scrollTo({top:0,behavior:'smooth'});
    return;
  }
  // Se saindo da galeria, reseta o estado dela
  if(currentPage==='galeria') resetGaleria();

  const cur=document.getElementById('page'+cap(currentPage));
  if(cur) cur.classList.remove('active');
  if(currentPage==='hero'){heroShown=false;if(cur)cur.style.display='none';}
  const nw=document.getElementById('page'+cap(page));
  if(nw){nw.style.display='';nw.classList.add('active');nw.scrollTop=0;}
  currentPage=page;
  updateNav(page);
  document.getElementById('navbar').classList.add('scrolled');
}

function resetGaleria(){
  document.getElementById('galGrid').classList.remove('visible');
  document.getElementById('galShareRow').style.display='none';
  document.getElementById('galDownload').style.display='none';
  document.getElementById('galErr').style.display='none';
  document.getElementById('galPass').value='';
}
function updateNav(page){
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active'));
  const m={sobre:'nl-sobre',portfolio:'nl-portfolio',pacotes:'nl-pacotes',depoimentos:'nl-depoimentos',galeria:'nl-galeria'};
  if(m[page]) document.getElementById(m[page]).classList.add('active');
}

function initSite(){
  initCalendar();
  document.getElementById('siteWrapper').style.display = 'block';
  // attach scroll listener to each page
  document.querySelectorAll('.page').forEach(pg => {
    pg.addEventListener('scroll', () => {
      document.getElementById('navbar').classList.toggle('scrolled', pg.scrollTop > 60);
    });
  });
  document.getElementById('navbar').classList.add('scrolled');
}

// ── PORTFOLIO FILTER ──
function filterPort(cat,btn){
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const grid=document.getElementById('portGrid');
  const items=Array.from(grid.querySelectorAll('.port-item'));

  // Mostra todos primeiro, depois esconde os que não são da categoria
  items.forEach(i=>{
    i.style.display='';
    i.style.gridColumn='';
    i.style.gridRow='';
    i.style.height='';
  });

  if(cat!=='todos'){
    // Pega só os visíveis e recria o grid assimétrico com eles
    const visible=items.filter(i=>i.dataset.cat===cat);
    const hidden=items.filter(i=>i.dataset.cat!==cat);

    // Esconde os que não são da categoria
    hidden.forEach(i=>{ i.style.display='none'; });

    // Reaplica o layout assimétrico bonito nos visíveis
    const layouts=[
      {col:'1/6', row:'1/2'},
      {col:'6/9', row:'1/2'},
      {col:'9/13',row:'1/3'},
      {col:'1/4', row:'2/3'},
      {col:'4/6', row:'2/3'},
      {col:'6/9', row:'2/3'},
    ];
    visible.forEach((item,idx)=>{
      const l=layouts[idx % layouts.length];
      item.style.gridColumn=l.col;
      item.style.gridRow=l.row;
    });

    // Ajusta a altura do grid de acordo com quantas linhas vão existir
    const maxRow=visible.length<=3?1:visible.length<=6?2:3;
    const rowStr=['290px','290px 290px','290px 290px 290px'][maxRow-1];
    grid.style.gridTemplateRows=rowStr;
    grid.style.gridTemplateColumns='repeat(12,1fr)';
  } else {
    // Todos: restaura o grid original
    grid.style.gridTemplateColumns='';
    grid.style.gridTemplateRows='';
  }
}

// ── GALLERY DATA ──
const eventGalleries={
  'ana-pedro':{name:'Ana & Pedro',cat:'Casamentos',photos:['https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1400&q=85','https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1400&q=85','https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1400&q=85','https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=85','https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=85','https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400&q=85']},
  'noivado':{name:'Ensaio de Noivado',cat:'Ensaios',photos:['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=85','https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=1400&q=85','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=85','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1400&q=85','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1400&q=85']},
  'julia-marcos':{name:'Julia & Marcos',cat:'Casamentos',photos:['https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1400&q=85','https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1400&q=85','https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=85','https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400&q=85','https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=85','https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1400&q=85']},
  'gala':{name:'Gala Corporativa',cat:'Eventos',photos:['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=85','https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=85','https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=85','https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&q=85','https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1400&q=85']},
  'familia':{name:'Família Rodrigues',cat:'Ensaios',photos:['https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=1400&q=85','https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=85','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=85','https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1400&q=85','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1400&q=85']},
  'cerimonia':{name:'Cerimônia ao Ar Livre',cat:'Casamentos',photos:['https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1400&q=85','https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1400&q=85','https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&q=85','https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1400&q=85','https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1400&q=85','https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1400&q=85']},
  'conf-empresa':{name:'Conferência Empresarial',cat:'Eventos',photos:['https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&q=85','https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=85','https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=85','https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=85','https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1400&q=85']},
  'festa-social':{name:'Festa Social',cat:'Eventos',photos:['https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1400&q=85','https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&q=85','https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1400&q=85','https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1400&q=85']},
  'casal-urbano':{name:'Ensaio Urbano',cat:'Ensaios',photos:['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1400&q=85','https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=1400&q=85','https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1400&q=85','https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=1400&q=85','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1400&q=85']}
};
const galeriaFotos=['https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1800&q=90','https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=90','https://images.unsplash.com/photo-1606800052052-a08af7148866?w=1800&q=90','https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1800&q=90','https://images.unsplash.com/photo-1529636444744-adffc9135a5e?w=1800&q=90','https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1800&q=90','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1800&q=90','https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=90'];

let galCurrentEvent=null,galCurrentIndex=0;

function openGallery(id){
  const ev=eventGalleries[id];if(!ev)return;
  galCurrentEvent=ev;galCurrentIndex=0;
  document.getElementById('galModalCat').textContent=ev.cat;
  document.getElementById('galModalName').textContent=ev.name;
  document.getElementById('modalDlAll').style.display=ev.photos.length>1?'flex':'none';
  renderGalModal();
  document.getElementById('modal').classList.add('open');
  
}
function renderGalModal(){
  const ev=galCurrentEvent,total=ev.photos.length;
  document.getElementById('modalImg').src=ev.photos[galCurrentIndex];
  document.getElementById('galModalCount').textContent=`${galCurrentIndex+1} / ${total}`;
  const tb=document.getElementById('galThumbs');
  tb.innerHTML=ev.photos.map((s,i)=>`<img src="${s.replace('w=1400','w=200')}" onclick="galJump(${i})" style="height:58px;width:88px;object-fit:cover;cursor:pointer;opacity:${i===galCurrentIndex?'1':'0.4'};border:${i===galCurrentIndex?'2px solid #4A5E3A':'2px solid transparent'};transition:all .2s;flex-shrink:0;">`).join('');
  const at=tb.children[galCurrentIndex];
  if(at)at.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}
function galNav(d){galCurrentIndex=(galCurrentIndex+d+galCurrentEvent.photos.length)%galCurrentEvent.photos.length;renderGalModal();}
function galJump(i){galCurrentIndex=i;renderGalModal();}
function downloadCurrentPhoto(){if(!galCurrentEvent)return;downloadPhoto(galCurrentEvent.photos[galCurrentIndex],`${galCurrentEvent.name.replace(/\s+/g,'-').toLowerCase()}-${galCurrentIndex+1}.jpg`);}
function downloadAllFromModal(){if(!galCurrentEvent)return;galCurrentEvent.photos.length===1?downloadCurrentPhoto():downloadAllPhotos(galCurrentEvent.photos,galCurrentEvent.name);}
function openModal(el){
  const img=el.tagName==='IMG'?el:el.querySelector('img');if(!img)return;
  galCurrentEvent={name:'Galeria Privada',cat:'Cliente',photos:[img.src.replace(/w=\d+/,'w=1400')]};
  galCurrentIndex=0;
  document.getElementById('galModalCat').textContent='Galeria Privada';
  document.getElementById('galModalName').textContent='';
  document.getElementById('galModalCount').textContent='';
  document.getElementById('modalImg').src=img.src.replace(/w=\d+/,'w=1400');
  document.getElementById('galThumbs').innerHTML='';
  document.getElementById('modalDlAll').style.display='none';
  document.getElementById('modal').classList.add('open');
  
}
function closeModal(){document.getElementById('modal').classList.remove('open');}
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')closeModal();
  if(e.key==='ArrowRight'&&galCurrentEvent&&galCurrentEvent.photos.length>1)galNav(1);
  if(e.key==='ArrowLeft'&&galCurrentEvent&&galCurrentEvent.photos.length>1)galNav(-1);
});

// ── SHARE ──
function sharePhoto(net){
  const texts={instagram:'Veja as fotos do Rafael Lima Fotografia! @rafaellimafoto',facebook:'Fotos incríveis do Rafael Lima Fotografia!',whatsapp:'Que fotos lindas do Rafael Lima Fotografia! 📸 rafaellimafoto.com.br',twitter:'Fotos incríveis do @rafaellimafoto! 📸 #RafaelLimaFotografia'};
  if(net==='instagram'){showToast('📸 Compartilhe direto no Instagram!');return;}
  const t=encodeURIComponent(texts[net]||'');
  const urls={facebook:`https://www.facebook.com/sharer/sharer.php?u=https://rafaellimafoto.com.br&quote=${t}`,whatsapp:`https://api.whatsapp.com/send?text=${t}`,twitter:`https://twitter.com/intent/tweet?text=${t}`};
  if(urls[net])window.open(urls[net],'_blank','width=600,height=500');
}
function shareGallery(net){sharePhoto(net);}
function openSocial(net){
  const u={instagram:'https://www.instagram.com/rafaellimafoto',facebook:'https://www.facebook.com',whatsapp:'https://api.whatsapp.com/send?phone=5511999990000&text=Olá Rafael!'};
  if(u[net])window.open(u[net],'_blank');
}

// ── CALENDAR ──
let calYear,calMonth_n,selectedDate=null,selectedTime=null;
function initCalendar(){const n=new Date();calYear=n.getFullYear();calMonth_n=n.getMonth();renderCal();}
function renderCal(){
  const months=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  document.getElementById('calMonth').textContent=`${months[calMonth_n]} ${calYear}`;
  const grid=document.getElementById('calGrid');
  const days=['D','S','T','Q','Q','S','S'];
  let html=days.map(d=>`<div class="cal-day-name">${d}</div>`).join('');
  const first=new Date(calYear,calMonth_n,1).getDay();
  const total=new Date(calYear,calMonth_n+1,0).getDate();
  const today=new Date();
  for(let i=0;i<first;i++)html+=`<div class="cal-day empty"></div>`;
  for(let d=1;d<=total;d++){
    const dt=new Date(calYear,calMonth_n,d);
    const isPast=dt<new Date(today.getFullYear(),today.getMonth(),today.getDate());
    const isSel=selectedDate&&selectedDate.getDate()===d&&selectedDate.getMonth()===calMonth_n&&selectedDate.getFullYear()===calYear;
    const isToday=dt.toDateString()===today.toDateString();
    const cls=isPast?'cal-day unavailable':(isSel?'cal-day selected':(isToday?'cal-day today':'cal-day'));
    html+=`<div class="${cls}" ${!isPast?`onclick="selectDate(${d})"`:''}>${d}</div>`;
  }
  grid.innerHTML=html;
}
function selectDate(d){selectedDate=new Date(calYear,calMonth_n,d);renderCal();}
function changeMonth(dir){calMonth_n+=dir;if(calMonth_n>11){calMonth_n=0;calYear++;}if(calMonth_n<0){calMonth_n=11;calYear--;}renderCal();}
function selectSlot(el){if(el.classList.contains('taken'))return;document.querySelectorAll('.tslot').forEach(t=>t.classList.remove('selected'));el.classList.add('selected');selectedTime=el.textContent;}

// ── BOOKING TABS ──
function switchTab(tab,btn){
  document.querySelectorAll('.btab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.booking-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-'+tab).classList.add('active');
}

// ── PAYMENT ──
function selectPay(btn,type){
  document.querySelectorAll('.pm-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.card-fields').forEach(f=>f.classList.remove('show'));
  document.getElementById('pay-'+type).classList.add('show');
}
function updateSinal(){
  const prices={'Essencial (R$1.800)':1800,'Premium (R$4.500)':4500,'Luxo (R$8.000)':8000};
  const sel=document.getElementById('f-pacote');if(!sel)return;
  const val=prices[sel.value];
  if(val){document.getElementById('sinVal').textContent=`R$${Math.round(val*.3).toLocaleString('pt-BR')}`;document.getElementById('restVal').textContent=`R$${(val-Math.round(val*.3)).toLocaleString('pt-BR')}`;}
  else{document.getElementById('sinVal').textContent='—';document.getElementById('restVal').textContent='—';}
}
document.addEventListener('change',e=>{if(e.target.id==='f-pacote')updateSinal();});
function formatCard(input){let v=input.value.replace(/\D/g,'').substring(0,16);input.value=v.replace(/(.{4})/g,'$1 ').trim();}
function finalizarAgendamento(){
  const nome=document.getElementById('f-nome')?.value.trim();
  const email=document.getElementById('f-email')?.value.trim();
  if(!nome||!email){showToast('⚠ Preencha nome e e-mail na aba Dados');return;}
  document.getElementById('formArea').style.display='none';
  document.getElementById('successMsg').style.display='block';
}
function goToAgendar(pacote){
  goTo('agendar');
  setTimeout(()=>{const s=document.getElementById('f-pacote');if(s){s.value=pacote;updateSinal();}switchTab('calendario',document.querySelectorAll('.btab')[0]);},100);
}

// ── GALERIA LOGIN ──
function acessarGal(){
  const pass=document.getElementById('galPass').value;
  const err=document.getElementById('galErr');
  if(pass==='1234'||pass==='demo'||pass==='rafael'){
    document.getElementById('galGrid').classList.add('visible');
    document.getElementById('galShareRow').style.display='flex';
    document.getElementById('galDownload').style.display='flex';
    err.style.display='none';
  } else {
    err.style.display='block';
    document.getElementById('galGrid').classList.remove('visible');
    document.getElementById('galShareRow').style.display='none';
    document.getElementById('galDownload').style.display='none';
  }
}

// ── STORIES ──
let currentRating=5;
function setRating(n){
  currentRating=n;
  document.querySelectorAll('.rating-star').forEach((s,i)=>s.classList.toggle('active',i<n));
}
function publicarHistoria(){
  const nome=document.getElementById('st-nome')?.value.trim();
  const texto=document.getElementById('st-texto')?.value.trim();
  if(!nome||!texto){showToast('⚠ Preencha seu nome e sua história');return;}
  const tipo=document.getElementById('st-tipo')?.value;
  const stars='★'.repeat(currentRating)+'☆'.repeat(5-currentRating);
  const card=document.createElement('div');
  card.className='dep-card';
  card.innerHTML=`<span class="dep-quote">"</span><div class="dep-stars">${stars}</div><p class="dep-text">${texto}</p><div class="dep-author"><div class="dep-avatar" style="background:#1A1A1A;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--sage);">${nome.charAt(0)}</div><div><div class="dep-name">${nome}</div><div class="dep-event">${tipo||'Cliente'} — ${new Date().toLocaleDateString('pt-BR',{month:'long',year:'numeric'})}</div></div></div>`;
  document.getElementById('depGrid').appendChild(card);
  document.getElementById('storyForm').style.display='none';
  document.getElementById('storyPublished').style.display='block';
  showToast('✨ Sua história foi publicada!');
}

// ── DOWNLOADS ──
async function downloadPhoto(url,filename){
  try{
    showToast('⏳ Preparando download...');
    const r=await fetch(url.replace(/w=\d+/,'w=1800'));
    const blob=await r.blob();
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);a.download=filename||'foto.jpg';
    document.body.appendChild(a);a.click();document.body.removeChild(a);
    URL.revokeObjectURL(a.href);showToast('✅ Download concluído!');
  }catch{window.open(url.replace(/w=\d+/,'w=1800'),'_blank');showToast('📥 Foto aberta em nova aba — salve com botão direito');}
}
async function downloadAllPhotos(photos,name){
  showToast(`⏳ Baixando ${photos.length} fotos...`);
  for(let i=0;i<photos.length;i++){
    await downloadPhoto(photos[i],`${name.replace(/\s+/g,'-').toLowerCase()}-foto-${i+1}.jpg`);
    await new Promise(r=>setTimeout(r,600));
  }
  showToast(`✅ ${photos.length} fotos baixadas!`);
}

// ── TOAST ──
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.style.opacity='1';
  clearTimeout(window._tt);window._tt=setTimeout(()=>t.style.opacity='0',3000);
}
