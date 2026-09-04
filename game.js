/* LUNA PELÓN — HISTORIA VIVA
   Núcleo 0.8: estado, misiones, memoria, interiores y controles.
   Todo el progreso relevante se conserva en localStorage.
*/
const $=id=>document.getElementById(id);
const menu=$('menu'),game=$('game'),play=$('playButton'),player=$('player'),interaction=$('interaction'),dialogue=$('dialogue'),questTitle=$('questTitle'),questObjective=$('questObjective'),coinLabel=$('coinLabel'),letter=$('letter'),bread=$('bread'),artifact=$('artifact'),toast=$('toast'),inventory=$('inventory'),inventoryItems=$('inventoryItems'),inventoryButton=$('inventoryButton'),closeInventory=$('closeInventory'),dayLabel=$('dayLabel'),chapterLabel=$('chapterLabel'),journal=$('journal'),journalButton=$('journalButton'),closeJournal=$('closeJournal'),journalContent=$('journalContent'),historyCard=$('historyCard'),historyTitle=$('historyTitle'),historyText=$('historyText'),historySource=$('historySource'),closeHistory=$('closeHistory'),interior=$('interior'),interiorTitle=$('interiorTitle'),interiorKicker=$('interiorKicker'),interiorContent=$('interiorContent'),interiorAction=$('interiorAction'),exitInterior=$('exitInterior');
const keys={};
const SAVE_KEY='luna-pelon-save-v08';
const OLD_KEY='luna-pelon-save-v07';
const defaults={x:.5,y:.5,coins:0,inventory:[],quest:'intro',letterTaken:false,breadTaken:false,artifactTaken:false,memories:[],day:1,historySeen:[],chapter:1,zone:'village',visited:[],interiors:{}};
let state=loadState();
let x=Number(state.x)||.5,y=Number(state.y)||.5,lastSave=0,dialogueOpen=false,historyOpen=false,currentInterior=null;
const chapters={
  1:{title:'El territorio',short:'Antes de las calles'},
  2:{title:'El agua abre camino',short:'Acequia y riego'},
  3:{title:'Las chacras',short:'Tierra y cosecha'},
  4:{title:'Nace una comunidad',short:'Fecha y memoria'},
  5:{title:'Voces del presente',short:'Muchas historias'}
};
const npcs=[{x:.42,y:.42,name:'Vecino',id:'neighbor'},{x:.83,y:.55,name:'Almacenero',id:'shopkeeper'},{x:.59,y:.76,name:'Maestra',id:'teacher'}];
const obstacles=[{x:.09,y:.18,w:.20,h:.17},{x:.68,y:.46,w:.18,h:.15},{x:.51,y:.67,w:.14,h:.13},{x:.22,y:.60,w:.09,h:.14},{x:.77,y:.68,w:.11,h:.14}];
const memories={
 river:{chapter:1,title:'El río y la vida',text:'Los valles irrigados del norte de la Patagonia transformaron paisajes áridos en zonas de producción. El agua, los canales y el trabajo comunitario son parte esencial de esta historia territorial.',source:'Inspirado en documentación pública provincial sobre el valle y sus sistemas de riego.'},
 irrigation:{chapter:2,title:'El agua no llega sola',text:'La agricultura intensiva necesita infraestructura: canales, compuertas, drenajes y mantenimiento. El sistema de riego permitió sostener chacras y organizar el territorio productivo.',source:'Recreación educativa inspirada en informes oficiales de ordenamiento territorial e infraestructura.'},
 people:{chapter:5,title:'Muchas historias, un territorio',text:'La historia rural reúne memorias indígenas, criollas, familias llegadas de distintos lugares y trabajadores vinculados a las actividades agrícolas. Una historia local no tiene una sola voz.',source:'Recreación educativa inspirada en documentación territorial pública.'},
 orchard:{chapter:3,title:'De la tierra a la cosecha',text:'El paisaje productivo se organiza en parcelas, caminos rurales, alamedas y chacras. La fruticultura y la vitivinicultura forman parte del desarrollo productivo regional.',source:'Recreación educativa inspirada en documentación ambiental y territorial pública.'},
 founding:{chapter:4,title:'Cuando nace una comunidad',text:'Villa Pelón recuerda su fecha fundacional como un momento de organización comunitaria. Pero una fecha no explica por sí sola un pueblo: antes y después existen familias, trabajo, territorio, agua y decisiones.',source:'Recreación narrativa educativa; no es una reproducción documental.'}
};
function loadState(){
  try{const raw=localStorage.getItem(SAVE_KEY)||localStorage.getItem(OLD_KEY);if(raw){const parsed=JSON.parse(raw);return {...defaults,...parsed,inventory:Array.isArray(parsed.inventory)?parsed.inventory:[],memories:Array.isArray(parsed.memories)?parsed.memories:[],historySeen:Array.isArray(parsed.historySeen)?parsed.historySeen:[],visited:Array.isArray(parsed.visited)?parsed.visited:[],interiors:parsed.interiors||{}}}}catch(e){console.warn('Save reset',e)}
  return {...defaults};
}
function save(){state.x=x;state.y=y;localStorage.setItem(SAVE_KEY,JSON.stringify(state));}
function say(text){dialogue.textContent=text;dialogue.style.display='block';dialogueOpen=true;}
function closeDialogue(){dialogue.style.display='none';dialogueOpen=false;}
function notify(text){toast.textContent=text;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),2200);}
function has(name){return state.inventory.some(i=>i.name===name)}
function addItem(name,icon){if(!has(name))state.inventory.push({name,icon})}
function removeItem(name){state.inventory=state.inventory.filter(i=>i.name!==name)}
function setChapter(n){state.chapter=Math.max(state.chapter,n);updateUI();save();}
function learn(id){if(!state.memories.includes(id)){state.memories.push(id);state.historySeen.push(id);const c=memories[id]?.chapter||1;if(c>state.chapter)state.chapter=c;save();showHistory(id)}}
function showHistory(id){const m=memories[id];if(!m)return;historyTitle.textContent=m.title;historyText.textContent=m.text;historySource.textContent=m.source;historyCard.classList.remove('hidden');historyOpen=true;}
function closeHistoryCard(){historyCard.classList.add('hidden');historyOpen=false;}
function markVisited(id){if(!state.visited.includes(id)){state.visited.push(id);save()}}
function updateUI(){
 coinLabel.textContent='🪙 '+state.coins;
 dayLabel.textContent='DÍA '+state.day+' · '+(state.day%2?'MAÑANA':'TARDE');
 chapterLabel.textContent='CAPÍTULO '+state.chapter+' · '+chapters[state.chapter].title.toUpperCase();
 letter.classList.toggle('taken',state.letterTaken);bread.classList.toggle('taken',state.breadTaken);artifact.classList.toggle('taken',state.artifactTaken);
 const q={intro:['El primer recorrido','Hablá con el Vecino y empezá a conocer Villa Pelón.'],letter:['Un mensaje','Encontrá la carta cerca de la casa del Vecino.'],deliver:['Una historia que viaja','Llevá la carta a la Maestra.'],bread:['Una compra sencilla','Comprá un pan en el Almacén por 5 monedas.'],learn:['Las huellas del territorio','Encontrá la huella junto a la acequia y aprendé sobre el agua.'],explore:['Voces del pueblo','Hablá con la Maestra y reuní una nueva memoria.'],done:['Historia en marcha','Explorá Villa Pelón y reuní memorias de su historia.']}[state.quest]||['Historia en marcha','Explorá Villa Pelón.'];
 questTitle.textContent=q[0];questObjective.textContent=q[1];
 inventoryItems.innerHTML='';if(!state.inventory.length)inventoryItems.innerHTML='<div class="inventory-item"><span class="icon">·</span><small>Vacío</small></div>';
 state.inventory.forEach(item=>{const el=document.createElement('div');el.className='inventory-item';el.innerHTML='<span class="icon">'+item.icon+'</span><small>'+item.name+'</small>';inventoryItems.appendChild(el)});
 renderJournal('story');
}
function renderJournal(tab){
 if(tab==='facts'){journalContent.innerHTML=state.memories.length?state.memories.map(id=>{const m=memories[id];return '<article class="journal-entry"><span class="chapter-mini">CAP. '+m.chapter+'</span><strong>'+m.title+'</strong><p>'+m.text+'</p></article>'}).join(''):'<article class="journal-entry"><strong>Aún no hay memorias</strong><p>Explorá, observá y hablá con las personas del pueblo.</p></article>';return}
 if(tab==='map'){journalContent.innerHTML='<article class="journal-entry"><strong>Rumbo de Luna</strong><p>Casa · camino · acequia · chacras · almacén · escuela · río.</p></article><article class="journal-entry"><strong>Capítulos</strong><p>'+Object.entries(chapters).map(([n,c])=>'CAP. '+n+' · '+c.title+(Number(n)<=state.chapter?' ✓':' · pendiente')).join('<br>')+'</p></article><article class="journal-entry"><strong>Cómo jugar</strong><p>Acercate a personajes, objetos o puertas y usá E. I abre el inventario. J abre el diario.</p></article>';return}
 journalContent.innerHTML='<article class="journal-entry"><span class="chapter-mini">CAPÍTULO '+state.chapter+'</span><strong>Luna, protagonista</strong><p>Luna recorre Villa Pelón y reconstruye su memoria hablando con habitantes, observando lugares, entrando a edificios y reuniendo objetos.</p></article><article class="journal-entry"><strong>Memorias reunidas</strong><p>'+state.memories.length+' de '+Object.keys(memories).length+' recuerdos descubiertos.</p></article><article class="journal-entry"><strong>Exploración</strong><p>'+state.visited.length+' lugares registrados en el recorrido.</p></article>';
}
function isModal(){return dialogueOpen||historyOpen||!inventory.classList.contains('hidden')||!journal.classList.contains('hidden')||!interior.classList.contains('hidden')}
function enterInterior(kind){
 currentInterior=kind;interior.classList.remove('hidden');closeDialogue();
 const data={
  house:{k:'CASA',t:'Casa de Luna',html:'<div class="interior-object bed">CAMA</div><div class="interior-object table">MESA</div><div class="interior-object notebook">CUADERNO</div><p>Un espacio cotidiano. Las historias también viven en las cosas sencillas y en los recuerdos familiares.</p>',action:'E — Leer el cuaderno'},
  store:{k:'ALMACÉN',t:'Almacén',html:'<div class="interior-object shelf">ESTANTES</div><div class="interior-object counter">MOSTRADOR</div><div class="interior-object ledger">LIBRETA</div><p>Un lugar de encuentro: compras, conversaciones y noticias circulan junto con las mercaderías.</p>',action:'E — Mirar la libreta'},
  school:{k:'ESCUELA',t:'Escuela',html:'<div class="interior-object board">PIZARRÓN<br><small>AGUA → TIERRA → COSECHA</small></div><div class="interior-object desk">BANCOS</div><p>La escuela conserva preguntas y conocimientos. Aprender historia también es aprender a mirar el territorio.</p>',action:'E — Estudiar el pizarrón'}
 }[kind];
 interiorKicker.textContent=data.k;interiorTitle.textContent=data.t;interiorContent.innerHTML=data.html;interiorAction.textContent=data.action;markVisited(kind);save();
}
function exitCurrentInterior(){interior.classList.add('hidden');currentInterior=null;}
function interiorInteract(){
 if(!currentInterior)return;
 if(currentInterior==='house'){if(!state.memories.includes('people')){learn('people')}else notify('El cuaderno guarda recuerdos cotidianos.');say('Luna: “Una casa también puede ser un archivo: objetos, relatos y costumbres guardan memoria.”');}
 if(currentInterior==='store'){say('Libreta del almacén: “Las compras son pequeñas, pero las conversaciones conectan a todo el pueblo.”');}
 if(currentInterior==='school'){if(!state.memories.includes('irrigation'))learn('irrigation');else if(!state.memories.includes('orchard'))learn('orchard');else notify('El pizarrón ya quedó registrado en tu diario.');}
}
function interact(){
 if(currentInterior){interiorInteract();return}
 const target=getTarget();if(!target)return;
 if(target.type==='door'){enterInterior(target.data);return}
 if(target.type==='letter'){state.letterTaken=true;state.quest='deliver';addItem('Carta','✉️');save();updateUI();notify('Carta encontrada');say('Luna encontró una carta. El pasado y el presente se cruzan en cosas pequeñas.');return}
 if(target.type==='bread'){if(state.quest==='bread'&&state.coins>=5){state.coins-=5;state.breadTaken=true;addItem('Pan','🥖');state.quest='learn';state.day++;setChapter(2);save();updateUI();notify('Compraste pan · -5 monedas');say('Almacenero: “Acá las cosas sencillas también cuentan. Un pan, una charla, una historia.”');}else say(state.coins<5?'Almacenero: “Te faltan monedas para comprar el pan.”':'Almacenero: “Si necesitás algo, avisame.”');return}
 if(target.type==='artifact'){state.artifactTaken=true;addItem('Huella del territorio','🪨');state.quest='explore';learn('irrigation');updateUI();notify('Memoria descubierta');return}
 if(target.type==='river'){markVisited('river');learn('river');return}
 if(target.type==='orchard'){markVisited('orchard');if(state.chapter>=3)learn('orchard');else say('Luna observa las filas de cultivo. Agua, suelo y trabajo parecen formar un mismo sistema.');return}
 const n=target.data;
 if(n.name==='Vecino'){
  if(state.quest==='intro'){state.quest='letter';learn('founding');updateUI();say('Vecino: “Luna, si querés conocer este lugar, no mires solamente las calles. Mirá el agua, las chacras y escuchá a la gente. Tengo una carta para la Maestra. ¿Me ayudás a llevarla?”');return}
  say('Vecino: “Cada camino tiene una historia. Y ninguna historia empieza solamente cuando alguien pone una fecha.”');return;
 }
 if(n.name==='Maestra'){
  if(state.quest==='deliver'&&has('Carta')){removeItem('Carta');state.quest='bread';state.coins+=25;setChapter(4);addItem('Recuerdo de la Maestra','📜');save();updateUI();notify('+25 monedas · nueva misión');say('Maestra: “Gracias, Luna. Los mensajes también forman parte de la memoria de una comunidad. Si vas al almacén, traeme un pan.”');return}
  if(state.quest==='explore'){learn('people');state.quest='done';setChapter(5);state.day++;updateUI();notify('Nueva memoria para el diario');say('Maestra: “Para entender Villa Pelón hay que escuchar muchas voces. La memoria también se construye entre personas.”');return}
  if(!state.memories.includes('orchard')){learn('orchard');return}
  say('Maestra: “Mirá las chacras. La tierra, el agua y el trabajo están conectados.”');return;
 }
 if(n.name==='Almacenero'){say('Almacenero: “Bienvenida, Luna. El almacén es un buen lugar para enterarse de lo que pasa.”');}
}
function getTarget(){
 let target=null,best=.085;
 npcs.forEach(n=>{const d=Math.hypot(x-n.x,y-n.y);if(d<best){best=d;target={type:'npc',data:n}}});
 const doors=[{x:.19,y:.31,id:'house'},{x:.74,y:.59,id:'store'},{x:.58,y:.75,id:'school'}];
 doors.forEach(d=>{const dist=Math.hypot(x-d.x,y-d.y);if(dist<best){best=dist;target={type:'door',data:d.id}}});
 if(!state.letterTaken){const d=Math.hypot(x-.34,y-.29);if(d<best){best=d;target={type:'letter'}}}
 if(state.quest==='bread'&&!state.breadTaken){const d=Math.hypot(x-.76,y-.58);if(d<best){best=d;target={type:'bread'}}}
 if(!state.artifactTaken){const d=Math.hypot(x-.28,y-.78);if(d<best){best=d;target={type:'artifact'}}}
 const riverDist=Math.abs(x-.91);if(riverDist<.055&&y>.15){const d=riverDist;if(d<best){best=d;target={type:'river'}}}
 if(x<.39&&y>.55&&y<.7){const d=.04;if(d<best){best=d;target={type:'orchard'}}}
 return target;
}
function blocked(nx,ny){if(nx<.035||nx>.965||ny<.065||ny>.94)return true;const r=.024;return obstacles.some(o=>nx+r>o.x&&nx-r<o.x+o.w&&ny+r<o.y+o.h&&ny-r<o.y+o.h&&ny+r>o.y)}
function move(dx,dy){const nx=x+dx,ny=y+dy;if(!blocked(nx,y))x=nx;if(!blocked(x,ny))y=ny;}
play.addEventListener('click',()=>{menu.classList.add('hidden');game.classList.remove('hidden');updateUI();notify('Luna comienza su recorrido')});
inventoryButton.addEventListener('click',()=>inventory.classList.remove('hidden'));closeInventory.addEventListener('click',()=>inventory.classList.add('hidden'));
journalButton.addEventListener('click',()=>{journal.classList.remove('hidden');renderJournal('story')});closeJournal.addEventListener('click',()=>journal.classList.add('hidden'));closeHistory.addEventListener('click',closeHistoryCard);dialogue.addEventListener('click',closeDialogue);exitInterior.addEventListener('click',exitCurrentInterior);interiorAction.addEventListener('click',interiorInteract);
document.querySelectorAll('.journal-tabs button').forEach(b=>b.addEventListener('click',()=>renderJournal(b.dataset.tab)));
document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();keys[k]=true;if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();if(k==='i'&&!interior.classList.contains('hidden')){e.preventDefault();return}if(k==='i'){inventory.classList.toggle('hidden');keys[k]=false}if(k==='j'){journal.classList.toggle('hidden');keys[k]=false}if(k==='e'){if(!isModal()||!interior.classList.contains('hidden')){interact();keys[k]=false}}if(k==='escape'){closeDialogue();inventory.classList.add('hidden');journal.classList.add('hidden');closeHistoryCard();if(!interior.classList.contains('hidden'))exitCurrentInterior()}});
document.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('.touch-controls button').forEach(b=>{const k=b.dataset.key;const down=e=>{e.preventDefault();keys[k]=true};const up=e=>{e.preventDefault();keys[k]=false};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up)});
function loop(t){
 const modalOpen=isModal();
 if(!modalOpen){let dx=0,dy=0;if(keys.w||keys.arrowup)dy-=.0045;if(keys.s||keys.arrowdown)dy+=.0045;if(keys.a||keys.arrowleft)dx-=.0045;if(keys.d||keys.arrowright)dx+=.0045;if(dx&&dy){dx*=.707;dy*=.707}move(dx,dy)}
 player.style.left=x*100+'%';player.style.top=y*100+'%';
 const target=getTarget();
 if(target&&!modalOpen){interaction.style.display='block';interaction.textContent=target.type==='letter'?'E — Recoger carta':target.type==='bread'?'E — Comprar pan (5 🪙)':target.type==='artifact'?'E — Examinar huella':target.type==='door'?'E — Entrar':target.type==='river'?'E — Contemplar el río':target.type==='orchard'?'E — Observar la chacra':'E — Hablar con '+target.data.name;if(keys.e){interact();keys.e=false}}else interaction.style.display='none';
 if(t-lastSave>1000){save();lastSave=t}requestAnimationFrame(loop);
}
updateUI();requestAnimationFrame(loop);