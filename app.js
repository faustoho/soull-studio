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
document.querySelector('#shoes').innerHTML='<img src="assets/tenis.jpeg" alt="Referências de tênis estilo All Star de cano alto, médio e baixo" loading="lazy" style="grid-column:1/-1;width:100%;height:auto;display:block;">';
document.querySelector('#inspiration').innerHTML='<img src="assets/maquiagem.jpeg" alt="Sugestões de maquiagem e penteados para as crianças" loading="lazy" style="grid-column:1/-1;width:100%;height:auto;display:block;">';
if(CONFIG.symplaUrl && /^https:\/\//.test(CONFIG.symplaUrl)){document.querySelector('#sympla-link').href=CONFIG.symplaUrl;document.querySelector('#sympla-link').hidden=false;document.querySelector('#sympla-pending').hidden=true;document.querySelector('#sympla-status').textContent='Ingressos pagos disponíveis na Sympla.';}
if(CONFIG.artisticText){const text=document.querySelector('#artistic-text');text.textContent=CONFIG.artisticText;text.hidden=false;}
