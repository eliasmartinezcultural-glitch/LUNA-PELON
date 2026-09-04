/* LUNA PELÓN — HISTORIA VIVA · NÚCLEO 0.9
   Estado único -> misiones -> capítulos -> memoria -> exploración -> guardado.
   Sin dependencias externas. Todo funciona desde el navegador.
*/
const $=id=>document.getElementById(id);
const menu=$('menu'),game=$('game'),play=$('playButton'),world=$('world'),worldMap=$('worldMap'),player=$('player'),interaction=$('interaction'),dialogue=$('dialogue'),questTitle=$('questTitle'),questObjective=$('questObjective'),coinLabel=$('coinLabel'),letter=$('letter'),bread=$('bread'),artifact=$('artifact'),toast=$('toast'),inventory=$('inventory'),inventoryItems=$('inventoryItems'),inventoryButton=$('inventoryButton'),closeInventory=$('closeInventory'),dayLabel=$('dayLabel'),chapterLabel=$('chapterLabel'),journal=$('journal'),journalButton=$('journalButton'),closeJournal=$('closeJournal'),journalContent=$('journalContent'),historyCard=$('historyCard'),historyTitle=$('historyTitle'),historyText=$('historyText'),historySource=$('historySource'),closeHistory=$('closeHistory'),interior=$('interior'),interiorTitle=$('interiorTitle'),interiorKicker=$('interiorKicker'),interiorContent=$('interiorContent'),interiorAction=$('interiorAction'),exitInterior=$('exitInterior');
const SAVE_KEY='luna-pelon-save-v09',OLD_KEYS=['luna-pelon-save-v08','luna-pelon-save-v07'];
const WORLD={w:1800,h:1050};
const defaults={x:.50,y:.52,coins:0,inventory:[],quest:'intro',letterTaken:false,breadTaken:false,artifactTaken:false,memories:[],day:1,historySeen:[],chapter:1,zone:'village',visited:[],interiors:{},flags:{}};
const chapters={1:{title:'El territorio',short:'Antes de las calles'},2:{title:'El agua abre camino',short:'Acequia y riego'},3:{title:'Las chacras',short:'Tierra y cosecha'},4:{title:'Nace una comunidad',short:'Fecha y memoria'},5:{title:'Voces del presente',short:'Muchas historias'}};
const memories={
 river:{chapter:1,title:'El río y la vida',text:'Los valles irrigados transformaron paisajes áridos en zonas de producción. El agua, los canales y el trabajo son parte esencial de esta historia territorial.',source:'Recreación educativa inspirada en documentación pública provincial.'},
 founding:{chapter:4,title:'Cuando nace una comunidad',text:'Una fecha fundacional marca un momento de organización, pero no contiene toda la historia. Antes y después existen familias, trabajo, territorio, agua y decisiones.',source:'Recreación narrativa educativa; no es una reproducción documental.'},
 irrigation:{chapter:2,title:'El agua no llega sola',text:'La agricultura necesita infraestructura: canales, compuertas, drenajes y mantenimiento. El riego modifica el territorio y permite sostener chacras productivas.',source:'Recreación educativa inspirada en informes públicos de infraestructura y ordenamiento.'},
 orchard:{chapter:3,title:'De la tierra a la cosecha',text:'El paisaje productivo se organiza en parcelas, caminos, alamedas y chacras. Fruticultura y vitivinicultura forman parte del desarrollo productivo regional.',source:'Recreación educativa inspirada en documentación ambiental y territorial pública.'},
 people:{chapter:5,title:'Muchas historias, un territorio',text:'La memoria rural reúne voces indígenas, criollas, familias llegadas de distintos lugares y trabajadores vinculados a las actividades productivas. Una historia local no tiene una sola voz.',source:'Recreación educativa inspirada en documentación territorial pública.'}
};
const npcs=[{x:.42,y:.42,name:'Vecino',id:'neighbor'},{x:.83,y:.55,name:'Almacenero',id:'shopkeeper'},{x:.59,y:.76,name:'Maestra',id:'teacher'}];
const doors=[{x:.19,y:.31,id:'house',name:'Casa de Luna'},{x:.74,y:.59,id:'store',name:'Almacén'},{x:.58,y:.75,id:'school',name:'Escuela'}];
const obstacles=[{x:.09,y:.18,w:.20,h:.17},{x:.68,y:.46,w:.18,h:.15},{x:.51,y:.67,w:.14,h:.13},{x:.22,y:.60,w:.09,h:.14},{x:.77,y:.68,w:.11,h:.14}];
const keys={};
let state=loadState(),x=state.x,y=state.y,lastSave=0,dialogueOpen=false,historyOpen=false,currentInterior=null,started=false;
function loadState(){try{let raw=localStorage.getItem(SAVE_KEY);if(!raw)for(const k of OLD_KEYS){raw=localStorage.getItem(k);if(raw)break}if(raw){const p=JSON.parse(raw);return normalize({...defaults,...p})}}catch(e){console.warn('No se pudo leer el guardado',e)}return {...defaults,inventory:[],memories:[],historySeen:[],visited:[],interiors:{},flags:{}}}
function normalize(s){s.inventory=Array.isArray(s.inventory)?s.inventory:[];s.memories=Array.isArray(s.memories)?s.memories:[];s.historySeen=Array.isArray(s.historySeen)?s.historySeen:[];s.visited=Array.isArray(s.visited)?s.visited:[];s.interiors=s.interiors&&typeof s.interiors==='object'?s.interiors:{};s.flags=s.flags&&typeof s.flags==='object'?s.flags:{};s.chapter=Math.min(5,Math.max(1,Number(s.chapter)||1));s.x=Number(s.x)||.5;s.y=Number(s.y)||.52;return s}
function save(force=false){const now=Date.now();if(!force&&now-lastSave<500)return;state.x=x;state.y=y;state.version=9;localStorage.setItem(SAVE_KEY,JSON.stringify(state));lastSave=now}
function has(name){return state.inventory.some(i=>i.name===name)}
function addItem(name,icon){if(!has(name)){state.inventory.push({name,icon});updateUI();save(true)}}
function removeItem(name){state.inventory=state.inventory.filter(i=>i.name!==name);updateUI();save(true)}
function setChapter(n){if(n>state.chapter){state.chapter=Math.min(5,n);notify('Capítulo '+state.chapter+' desbloqueado: '+chapters[state.chapter].title);updateUI();save(true)}}
function markVisited(id){if(!state.visited.includes(id)){state.visited.push(id);updateUI();save(true)}}
function learn(id){const m=memories[id];if(!m)return;if(!state.memories.includes(id)){state.memories.push(id);state.historySeen.push(id);setChapter(m.chapter);updateUI();save(true);showHistory(id)}}
function showHistory(id){const m=memories[id];if(!m)return;historyTitle.textContent=m.title;historyText.textContent=m.text;historySource.textContent=m.source;historyCard.classList.remove('hidden');historyOpen=true}
function closeHistoryCard(){historyCard.classList.add('hidden');historyOpen=false}
function notify(t){toast.textContent=t;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),2200)}
function say(t){dialogue.textContent=t;dialogue.style.display='block';dialogueOpen=true}
function closeDialogue(){dialogue.style.display='none';dialogueOpen=false}
function modalOpen(){return dialogueOpen||historyOpen||!inventory.classList.contains('hidden')||!journal.classList.contains('hidden')||!interior.classList.contains('hidden')}
function updateUI(){
 coinLabel.textContent='🪙 '+state.coins;dayLabel.textContent='DÍA '+state.day+' · '+(state.day%2?'MAÑANA':'TARDE');chapterLabel.textContent='CAPÍTULO '+state.chapter+' · '+chapters[state.chapter].title.toUpperCase();
 letter.classList.toggle('taken',state.letterTaken);bread.classList.toggle('taken',state.breadTaken);artifact.classList.toggle('taken',state.artifactTaken);
 const qs={intro:['El primer recorrido','Hablá con el Vecino y empezá a conocer Villa Pelón.'],letter:['Un mensaje','Encontrá la carta cerca de la casa del Vecino.'],deliver:['Una historia que viaja','Llevá la carta a la Maestra.'],bread:['Una compra sencilla','Comprá un pan en el Almacén por 5 monedas.'],learn:['Las huellas del territorio','Encontrá la huella junto a la acequia.'],explore:['Voces del pueblo','Hablá con la Maestra y reuní otra memoria.'],done:['Historia en marcha','Explorá Villa Pelón y reuní memorias.']}[state.quest]||['Historia en marcha','Explorá Villa Pelón.'];questTitle.textContent=qs[0];questObjective.textContent=qs[1];
 inventoryItems.innerHTML=state.inventory.length?state.inventory.map(i=>'<div class="inventory-item"><span class="icon">'+i.icon+'</span><small>'+i.name+'</small></div>').join(''):'<div class="inventory-item"><span class="icon">·</span><small>Vacío</small></div>';
 renderJournal('story');
}
function renderJournal(tab){
 if(tab==='facts'){journalContent.innerHTML=state.memories.length?state.memories.map(id=>{const m=memories[id];return '<article class="journal-entry"><span class="chapter-mini">CAP. '+m.chapter+'</span><strong>'+m.title+'</strong><p>'+m.text+'</p></article>'}).join(''):'<article class="journal-entry"><strong>Aún no hay memorias</strong><p>Observá el territorio, entrá a los edificios y hablá con sus habitantes.</p></article>';return}
 if(tab==='map'){journalContent.innerHTML='<article class="journal-entry"><strong>Rumbo de Luna</strong><p>Casa · camino · acequia · chacras · almacén · escuela · río.</p></article><article class="journal-entry"><strong>Capítulos</strong><p>'+Object.entries(chapters).map(([n,c])=>'CAP. '+n+' · '+c.title+(Number(n)<=state.chapter?' ✓':' · pendiente')).join('<br>')+'</p></article><article class="journal-entry"><strong>Exploración</strong><p>'+state.visited.length+' lugares registrados · '+Object.keys(state.interiors).length+' interiores visitados.</p></article>';return}
 journalContent.innerHTML='<article class="journal-entry"><span class="chapter-mini">CAPÍTULO '+state.chapter+'</span><strong>Luna, protagonista</strong><p>Luna recorre Villa Pelón y reconstruye su memoria caminando, observando, conversando y entrando a los espacios cotidianos.</p></article><article class="journal-entry"><strong>Memorias</strong><p>'+state.memories.length+' de '+Object.keys(memories).length+' recuerdos descubiertos.</p></article><article class="journal-entry"><strong>Principio del viaje</strong><p>La historia no está solamente en las fechas: también está en el territorio, el agua, el trabajo y las voces.</p></article>'
}
function openPanel(p){p.classList.remove('hidden');closeDialogue()}
function closePanel(p){p.classList.add('hidden')}
function enterInterior(kind){
 const data={house:{k:'CASA',t:'Casa de Luna',html:'<div class="interior-object bed">CAMA</div><div class="interior-object table">MESA</div><div class="interior-object notebook">CUADERNO</div><p>Un espacio cotidiano. Los objetos, las costumbres y los relatos también guardan memoria.</p>',action:'LEER EL CUADERNO'},store:{k:'ALMACÉN',t:'Almacén',html:'<div class="interior-object shelf">ESTANTES</div><div class="interior-object counter">MOSTRADOR</div><div class="interior-object ledger">LIBRETA</div><p>Un lugar de encuentro: mercaderías, conversaciones y noticias circulan al mismo tiempo.</p>',action:'MIRAR LA LIBRETA'},school:{k:'ESCUELA',t:'Escuela',html:'<div class="interior-object board">PIZARRÓN<br><small>AGUA → TIERRA → COSECHA</small></div><div class="interior-object desk">BANCOS</div><p>La escuela conserva preguntas y conocimientos. Aprender historia también es aprender a mirar el territorio.</p>',action:'ESTUDIAR EL PIZARRÓN'}}[kind];
 currentInterior=kind;state.zone=kind;state.interiors[kind]=true;interiorKicker.textContent=data.k;interiorTitle.textContent=data.t;interiorContent.innerHTML=data.html;interiorAction.textContent=data.action;interior.classList.remove('hidden');markVisited(kind);save(true)
}
function exitInterior(){interior.classList.add('hidden');currentInterior=null;state.zone='village';save(true)}
function interiorInteract(){
 if(currentInterior==='house'){learn('people');say('Luna: “Una casa también puede ser un archivo: objetos, relatos y costumbres guardan memoria.”')}
 else if(currentInterior==='store'){say('Libreta del almacén: “Las compras son pequeñas, pero las conversaciones conectan al pueblo.”')}
 else if(currentInterior==='school'){if(!state.memories.includes('irrigation'))learn('irrigation');else if(!state.memories.includes('orchard'))learn('orchard');else say('Luna: “Ya anoté esta idea en mi diario.”')}
}
function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function getTarget(){
 let best=.075,target=null;
 npcs.forEach(n=>{const d=distance({x,y},n);if(d<best){best=d;target={type:'npc',data:n,label:'E — hablar con '+n.name}}});
 doors.forEach(d=>{const q=distance({x,y},d);if(q<best){best=q;target={type:'door',data:d.id,label:'E — entrar en '+d.name}}});
 const objects=[
  !state.letterTaken&&{type:'letter',x:.34,y:.29,label:'E — recoger carta'},
  state.quest==='bread'&&!state.breadTaken&&{type:'bread',x:.76,y:.58,label:'E — comprar pan · 5 monedas'},
  !state.artifactTaken&&{type:'artifact',x:.28,y:.78,label:'E — observar huella'},
  {type:'river',x:.89,y:.35,label:'E — contemplar el río'},
  {type:'orchard',x:.14,y:.68,label:'E — observar las chacras'}
 ].filter(Boolean);
 objects.forEach(o=>{const d=distance({x,y},o);if(d<best){best=d;target={type:o.type,data:o,label:o.label}}});return target
}
function interact(){
 if(currentInterior){interiorInteract();return}
 const t=getTarget();if(!t)return;
 if(t.type==='door'){enterInterior(t.data);return}
 if(t.type==='letter'){state.letterTaken=true;state.quest='deliver';addItem('Carta','✉️');notify('Carta encontrada');say('Luna encontró una carta. Una pequeña tarea puede abrir una historia.');return}
 if(t.type==='bread'){if(state.coins>=5){state.coins-=5;state.breadTaken=true;state.quest='learn';state.day++;setChapter(2);addItem('Pan','🥖');notify('Pan comprado · -5 monedas');say('Almacenero: “Un pan, una charla y un camino. Todo forma parte de la vida de un pueblo.”')}else say('Almacenero: “Te faltan monedas. Volvé cuando tengas 5.”');return}
 if(t.type==='artifact'){state.artifactTaken=true;state.quest='explore';addItem('Huella del territorio','🪨');learn('irrigation');return}
 if(t.type==='river'){markVisited('river');learn('river');return}
 if(t.type==='orchard'){markVisited('orchard');if(state.chapter>=3)learn('orchard');else say('Luna observa las filas de cultivo: agua, suelo y trabajo parecen formar un mismo sistema.');return}
 const n=t.data;
 if(n.name==='Vecino'){if(state.quest==='intro'){state.quest='letter';learn('founding');say('Vecino: “Luna, si querés conocer este lugar, no mires solamente las calles. Mirá el agua, las chacras y escuchá a la gente. Tengo una carta para la Maestra.”')}else say('Vecino: “Ninguna historia empieza solamente cuando alguien pone una fecha.”');return}
 if(n.name==='Maestra'){if(state.quest==='deliver'&&has('Carta')){removeItem('Carta');state.quest='bread';state.coins+=25;addItem('Recuerdo de la Maestra','📜');setChapter(4);notify('+25 monedas · nueva misión');say('Maestra: “Gracias, Luna. Los mensajes también forman memoria. Si vas al almacén, traeme un pan.”');return}if(state.quest==='explore'){state.quest='done';learn('people');setChapter(5);state.day++;say('Maestra: “Para entender Villa Pelón hay que escuchar muchas voces. La memoria se construye entre personas.”');return}if(!state.memories.includes('orchard')&&state.chapter>=3){learn('orchard');return}say('Maestra: “Mirá las chacras. Tierra, agua y trabajo están conectados.”');return}
 if(n.name==='Almacenero')say('Almacenero: “Bienvenida, Luna. Acá las noticias también viajan de boca en boca.”')
}
function blocked(nx,ny){if(nx<.025||nx>.975||ny<.035||ny>.965)return true;return obstacles.some(o=>nx>o.x-.025&&nx<o.x+o.w+.025&&ny>o.y-.025&&ny<o.y+o.h+.025)}
function move(dx,dy){if(modalOpen()||!started)return;const speed=.0038;const nx=x+dx*speed,ny=y+dy*speed;if(!blocked(nx,y))x=nx;if(!blocked(x,ny))y=ny;save();updateCamera();updateInteraction()}
function updateCamera(){const rect=world.getBoundingClientRect();const mapW=1800,mapH=1050;const px=x*mapW,py=y*mapH;const maxX=Math.max(0,mapW-rect.width),maxY=Math.max(0,mapH-rect.height);const cx=Math.min(maxX,Math.max(0,px-rect.width/2)),cy=Math.min(maxY,Math.max(0,py-rect.height/2));worldMap.style.transform='translate('+(-cx)+'px,'+(-cy)+'px)';player.style.left=(px)+'px';player.style.top=(py)+'px'}
function updateInteraction(){if(modalOpen()){interaction.style.display='none';return}const t=getTarget();interaction.textContent=t?t.label:'';interaction.style.display=t?'block':'none'}
function loop(){updateCamera();updateInteraction();let dx=0,dy=0;if(keys.w||keys.arrowup)dy-=1;if(keys.s||keys.arrowdown)dy+=1;if(keys.a||keys.arrowleft)dx-=1;if(keys.d||keys.arrowright)dx+=1;if(dx||dy){const l=Math.hypot(dx,dy);move(dx/l,dy/l)}requestAnimationFrame(loop)}
function start(){started=true;menu.classList.add('hidden');game.classList.remove('hidden');updateUI();updateCamera();notify('Explorá libremente · acercate a alguien o a un lugar y presioná E')}
play.addEventListener('click',start);dialogue.addEventListener('click',closeDialogue);closeHistory.addEventListener('click',closeHistoryCard);journalButton.addEventListener('click',()=>openPanel(journal));closeJournal.addEventListener('click',()=>closePanel(journal));inventoryButton.addEventListener('click',()=>openPanel(inventory));closeInventory.addEventListener('click',()=>closePanel(inventory));exitInterior.addEventListener('click',exitInterior);interiorAction.addEventListener('click',interiorInteract);
journal.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>renderJournal(b.dataset.tab)));
world.addEventListener('click',e=>{if(e.target.closest('.hud-button,.overlay-panel,.dialogue,.history-card,.interior'))return;if(e.target.closest('[data-door]')){const id=e.target.closest('[data-door]').dataset.door;if(!currentInterior)enterInterior(id)}});
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','e','i','j'].includes(k))e.preventDefault();keys[k]=true;if(k==='e')interact();if(k==='i'&&!dialogueOpen&&!historyOpen)openPanel(inventory);if(k==='j'&&!dialogueOpen&&!historyOpen)openPanel(journal);if(k==='escape'){closeDialogue();closeHistoryCard();closePanel(inventory);closePanel(journal);if(currentInterior)exitInterior()}});window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
document.querySelectorAll('.touch-controls button').forEach(btn=>{const k=btn.dataset.key;const down=e=>{e.preventDefault();if(k==='e')interact();else keys[k]=true};const up=e=>{e.preventDefault();keys[k]=false};btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up);btn.addEventListener('pointerleave',up)});
window.addEventListener('resize',updateCamera);window.addEventListener('beforeunload',()=>save(true));
updateUI();requestAnimationFrame(loop);