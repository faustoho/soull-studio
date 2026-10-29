// Atualize somente quando Saulo enviar o endereço oficial. Nunca use um link provisório.
const CONFIG = { symplaUrl: '', artisticText: '' };
const CLASSES = [
  {id:'db-merces',school:'dom-bosco',label:'Mercês · segunda-feira · 12h–13h',scene:'Morada da Memória',days:[20]},
  {id:'med-corpo',school:'medianeira',label:'Terça-feira · 13h30–14h40',scene:'Morada do Corpo',days:[20,21]},
  {id:'med-sonhos',school:'medianeira',label:'Quarta-feira · 10h30–11h40',scene:'Morada dos Sonhos',days:[20,21]},
  {id:'med-brincadeiras',school:'medianeira',label:'Terça-feira · 17h45–18h30',scene:'Morada das Brincadeiras',days:[20]},
  {id:'ass-bichinhos',school:'assuncao',label:'Terça-feira · 10h–11h',scene:'Morada dos Bichinhos',days:[20]},
  {id:'med-nucleo',school:'medianeira',label:'Núcleo de Pesquisa — Morada da Rua (terça-feira)',scene:'Morada da Rua',days:[20,21]},
  {id:'db-ahu',school:'dom-bosco',label:'Ahú · quinta-feira · 18h20–19h20',scene:'Morada da Humanidade',days:[20]},
  {id:'ass-memoria',school:'assuncao',label:'Quarta-feira · 17h45–18h45',scene:'Morada da Memória',days:[21]},
  {id:'med-brincadeiras-sab',school:'medianeira',label:'Terça-feira · 18h40–19h40',scene:'Morada das Brincadeiras',days:[21]},
  {id:'db-cei',school:'dom-bosco',label:'CEI · quinta-feira · 17h40–18h10',scene:'Morada dos Bichinhos',days:[21]}
];
const SCHOOLS = {'medianeira':'Colégio Medianeira','assuncao':'Colégio Assunção','dom-bosco':'Colégio Dom Bosco'};
const school = document.querySelector('#school');
const classroom = document.querySelector('#classroom');
const result = document.querySelector('#result');
const arrival = c => c.id === 'db-cei' ? '15h30' : '15h';
function selectSchool(){
  classroom.replaceChildren(new Option(school.value ? 'Selecione sua turma' : 'Primeiro, escolha o colégio',''));
  CLASSES.filter(c=>c.school===school.value).forEach(c=>classroom.add(new Option(c.label,c.id)));
  classroom.disabled=!school.value;
  result.innerHTML='<p class="finder-hint">Cada turma tem uma história. Encontre a sua.</p>';
}
function selectClass(){
  const c=CLASSES.find(c=>c.id===classroom.value);
  if(!c){result.innerHTML='<p class="finder-hint">Selecione uma turma para consultar as datas.</p>';return;}
  const both=c.days.length===2;
  const dates=both?'20 E 21 DE NOVEMBRO — DOIS ESPETÁCULOS':`${c.days[0]} DE NOVEMBRO — ${c.days[0]===20?'SEXTA-FEIRA':'SÁBADO'}`;
  const rehearsals=both?'19 e 20 de novembro de 2026':`${c.days[0]-1} de novembro de 2026`;
  result.innerHTML=`<article class="result-card"><span class="mini-label" style="color:#c8d6c9">SUA TURMA EM CENA</span><h3>${c.scene}</h3><p class="performance">${dates}</p><p>2026 · Espetáculo${both?'s':''} às <strong>17h</strong> · Chegada dos artistas: <strong>${arrival(c)}${both?' em ambos os dias':''}</strong>.</p><p class="result-rehearsal"><strong>${both?'Ensaios gerais':'Ensaio geral'}: ${rehearsals}</strong><br>Das 9h às 12h${both?' · Presença nos dois ensaios':''}.</p><p>Teatro Regina Vogue · Shopping Estação</p></article>`;
}
school.addEventListener('change',selectSchool);classroom.addEventListener('change',selectClass);
selectSchool();
document.querySelector('#schedule').innerHTML=[20,21].map(day=>`<article class="schedule-day"><span class="mini-label">${day===20?'SEXTA-FEIRA':'SÁBADO'} · 2026</span><h3>${day} de novembro · 17h</h3><p>Ensaio geral: ${day-1}/11, das 9h às 12h · Chegada: 15h${day===21?' (CEI: 15h30)':''}</p><ul>${CLASSES.filter(c=>c.days.includes(day)).map(c=>`<li><strong>${c.scene}</strong><span>${SCHOOLS[c.school]} · ${c.label}</span>${c.id==='db-cei'?'<span class="arrival">Chegada excepcional às 15h30</span>':''}</li>`).join('')}</ul></article>`).join('');
const credits=[['Direção geral e dramaturgia','Saulo Soull'],['Codireção','Alini Maria, Thayná Bressan, Ruana Rayra e Lara Leal'],['Composições musicais originais','Saulo Soull'],['Arranjos e ideias','Gustavo Arthury'],['Design','Saulo Soull e Frede Tizzot'],['Figurinos','Natalie Fronzack'],['Iluminação','Márcio Junior'],['Maquiagem','Izis Rodrigues'],['Cenografia','Saulo Soull, Dudu Faraco e Pro Acrílico'],['Fotografia e filmagem','Lays Gasperin e Diego Gasperin — Sinergize'],['Equipe de produção','Maduh e Gabriel Ribeiro'],['Camareira','Guilia Tramontin']];
document.querySelector('#credits').innerHTML=credits.map(([role,name])=>`<div><dt>${role}</dt><dd>${name}</dd></div>`).join('');
document.querySelector('#shoes').innerHTML=['Alto','Médio','Baixo'].map((label,i)=>`<figure><svg viewBox="0 0 160 130" role="img" aria-label="Tênis de cano ${label.toLowerCase()}"><path d="M25 ${24+i*18} L67 ${24+i*18} L83 83 Q92 88 121 89 Q141 90 143 108 L20 108 Z" fill="${['#a83627','#37635d','#c4924c'][i]}" stroke="#243a35" stroke-width="2"/><path d="M22 106 H143 V117 H20 Z" fill="#fffaf0" stroke="#243a35" stroke-width="2"/><path d="M112 90 Q141 89 143 106 H103 Q103 93 112 90" fill="#fffaf0" stroke="#243a35" stroke-width="2"/><path d="M66 ${39+i*14} L77 ${43+i*13} M69 ${52+i*9} L81 ${56+i*9} M73 74 L86 77 M77 84 L91 87" stroke="#fffaf0" stroke-width="3"/>${i===0?'<circle cx="43" cy="65" r="12" fill="#f7f3e9"/><path d="m43 57 2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z" fill="#243a35"/>':''}</svg><figcaption>Cano ${label.toLowerCase()}</figcaption></figure>`).join('');
document.querySelector('#inspiration').innerHTML=[['#75452f','Cachos & pontos de luz'],['#d59a6d','Presilhas & traços de cor'],['#f1c8a4','Coque & pequenos sóis']].map(([skin,label],i)=>`<figure><svg viewBox="0 0 150 170" role="img" aria-label="Inspiração ilustrada: ${label}"><path d="M20 170 Q25 130 75 127 Q125 130 130 170" fill="${['#a63c2a','#587367','#b98b49'][i]}"/><path d="M62 118 V141 Q75 151 88 141 V118" fill="${skin}"/><ellipse cx="75" cy="85" rx="39" ry="48" fill="${skin}"/>${i===0?'<path d="M37 90 Q15 77 28 61 Q10 43 32 35 Q25 16 47 19 Q56 2 72 15 Q94 0 106 20 Q128 17 123 40 Q142 55 124 72 L113 92 L109 57 Q79 67 44 53Z" fill="#302a25"/>':i===1?'<path d="M35 112 Q17 53 40 29 Q75 5 110 30 Q132 47 117 119 L108 67 Q76 63 62 40 Q53 64 40 72Z" fill="#3c2e24"/><path d="M104 47 l12 6 M102 53 l12 6" stroke="#d8a842" stroke-width="4"/>':'<circle cx="75" cy="24" r="21" fill="#4c3226"/><path d="M35 79 Q18 30 65 27 Q123 18 115 84 L108 61 Q78 55 68 40 Q58 62 40 66Z" fill="#4c3226"/>'}<path d="M51 85 q8 -5 15 0 M84 85 q8 -5 15 0" fill="none" stroke="#352b25" stroke-width="2"/><path d="M68 113 q8 5 15 -1" stroke="#8c3f31" stroke-width="2" fill="none"/><path d="M75 91 l-4 10 6 1" fill="none" stroke="#a36349"/>${i===0?'<g fill="#f6dfa5"><circle cx="46" cy="95" r="3"/><circle cx="53" cy="101" r="2"/><circle cx="102" cy="94" r="3"/></g>':i===1?'<path d="M43 97 l14 5 M93 101 l13 -5" stroke="#b74d35" stroke-width="4"/>':'<g stroke="#b66528" fill="none"><circle cx="48" cy="98" r="5"/><path d="M48 89v-3 M39 98h-3 M48 107v3 M57 98h3"/></g>'}</svg><figcaption>${label}</figcaption></figure>`).join('');
if(CONFIG.symplaUrl && /^https:\/\//.test(CONFIG.symplaUrl)){document.querySelector('#sympla-link').href=CONFIG.symplaUrl;document.querySelector('#sympla-link').hidden=false;document.querySelector('#sympla-pending').hidden=true;document.querySelector('#sympla-status').textContent='Ingressos pagos disponíveis na Sympla.';}
if(CONFIG.artisticText){const text=document.querySelector('#artistic-text');text.textContent=CONFIG.artisticText;text.hidden=false;}
