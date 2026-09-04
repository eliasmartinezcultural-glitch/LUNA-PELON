const menu=document.getElementById('menu');
const game=document.getElementById('game');
const play=document.getElementById('playButton');
const player=document.getElementById('player');
const interaction=document.getElementById('interaction');
const dialogue=document.getElementById('dialogue');
const questTitle=document.getElementById('questTitle');
const questObjective=document.getElementById('questObjective');
const coinLabel=document.getElementById('coinLabel');
const letter=document.getElementById('letter');
const toast=document.getElementById('toast');
const inventory=document.getElementById('inventory');
const inventoryItems=document.getElementById('inventoryItems');
const inventoryButton=document.getElementById('inventoryButton');
const closeInventory=document.getElementById('closeInventory');

const keys={};
let x=.5,y=.5;
const saveKey='luna-pelon-save-v04';
let state=JSON.parse(localStorage.getItem(saveKey)||'null')||{
  coins:0,
  inventory:[],
  quest:'none',
  letterTaken:false,
  questDone:false
};

const npcs=[
  {x:.42,y:.42,name:'Vecino'},
  {x:.73,y:.28,name:'Luna'}
];

function save(){localStorage.setItem(saveKey,JSON.stringify(state))}
function say(text){dialogue.textContent=text;dialogue.style.display='block'}
function notify(text){toast.textContent=text;toast.classList.add('show');clearTimeout(notify.t);notify.t=setTimeout(()=>toast.classList.remove('show'),2200)}
function updateUI(){
  coinLabel.textContent='🪙 '+state.coins;
  letter.classList.toggle('taken',state.letterTaken);
  if(state.quest==='none'){
    questTitle.textContent='Una primera historia';
    questObjective.textContent='Hablá con el Vecino para descubrir qué necesita.';
  }else if(state.quest==='letter'){
    questTitle.textContent='Un mensaje para Luna';
    questObjective.textContent=state.letterTaken?'Llevá la carta a Luna.':'Encontrá la carta cerca de la casa.';
  }else if(state.quest==='deliver'){
    questTitle.textContent='Un mensaje para Luna';
    questObjective.textContent='Entregale la carta a Luna.';
  }else if(state.quest==='complete'){
    questTitle.textContent='Misión completada';
    questObjective.textContent='Luna recibió la carta. Explorá el pueblo.';
  }
  inventoryItems.innerHTML='';
  const items=state.inventory;
  if(!items.length){inventoryItems.innerHTML='<div class="inventory-item"><span class="icon">·</span><small>Vacío</small></div>'}
  items.forEach(item=>{
    const el=document.createElement('div');el.className='inventory-item';
    el.innerHTML='<span class="icon">'+item.icon+'</span><small>'+item.name+'</small>';
    inventoryItems.appendChild(el);
  });
}

play.addEventListener('click',()=>{menu.classList.add('hidden');game.classList.remove('hidden');updateUI();notify('Bienvenido a Luna Pelón')});
inventoryButton.addEventListener('click',()=>inventory.classList.remove('hidden'));
closeInventory.addEventListener('click',()=>inventory.classList.add('hidden'));

document.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  keys[k]=true;
  if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();
  if(k==='i'){inventory.classList.toggle('hidden');keys[k]=false}
  if(k==='escape'){dialogue.style.display='none';inventory.classList.add('hidden')}
});
document.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);

document.querySelectorAll('.touch-controls button').forEach(b=>{
  const k=b.dataset.key;
  const down=e=>{e.preventDefault();keys[k]=true};
  const up=e=>{e.preventDefault();keys[k]=false};
  b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('pointerleave',up)
});

function addItem(name,icon){if(!state.inventory.some(i=>i.name===name))state.inventory.push({name,icon})}
function removeItem(name){state.inventory=state.inventory.filter(i=>i.name!==name)}
function interact(){
  const nearNPC=npcs.find(n=>Math.hypot(x-n.x,y-n.y)<.095);
  const nearLetter=!state.letterTaken&&Math.hypot(x-.34,y-.29)<.075;
  if(nearLetter){
    state.letterTaken=true;state.quest='deliver';addItem('Carta','✉️');save();updateUI();notify('Conseguiste la carta');say('Encontraste una carta. Parece que alguien en el pueblo está esperando este mensaje.');return
  }
  if(nearNPC){
    if(nearNPC.name==='Vecino'){
      if(state.quest==='none'){
        state.quest='letter';save();updateUI();say('Vecino: “Necesito hacerle llegar una carta a Luna. Está por el otro lado del pueblo. ¿Podés ayudarme?”');return
      }
      if(state.quest==='letter'){
        say('Vecino: “La carta está cerca de mi casa. Buscala y después llevásela a Luna.”');return
      }
      if(state.quest==='deliver'){
        say('Vecino: “¿Ya encontraste a Luna? La carta es importante.”');return
      }
      say('Vecino: “El pueblo tiene muchas historias. Recién estamos empezando.”');return
    }
    if(nearNPC.name==='Luna'){
      if(state.quest==='deliver'&&state.inventory.some(i=>i.name==='Carta')){
        removeItem('Carta');state.quest='complete';state.questDone=true;state.coins+=25;addItem('Recuerdo de Luna','🌙');save();updateUI();say('Luna: “Gracias. No sabía si este mensaje iba a llegar. Tomá esto como recuerdo. Nos vamos a volver a ver.”');notify('+25 monedas · Misión completada');return
      }
      if(state.quest==='none'){say('Luna: “Hola. ¿Recién llegás? Hablá con el Vecino, parece que necesita ayuda.”');return}
      if(state.quest==='letter'){say('Luna: “Creo que el Vecino quería decirme algo. ¿Encontraste la carta?”');return}
      say('Luna: “Hay mucho por descubrir todavía.”');return
    }
  }
}

function getTarget(){
  let target=null,best=.085;
  npcs.forEach(n=>{const d=Math.hypot(x-n.x,y-n.y);if(d<best){best=d;target={type:'npc',data:n}}});
  if(!state.letterTaken){const d=Math.hypot(x-.34,y-.29);if(d<best)target={type:'letter'} }
  return target;
}

function loop(){
  let dx=0,dy=0;
  if(keys.w||keys.arrowup)dy-=.004;if(keys.s||keys.arrowdown)dy+=.004;
  if(keys.a||keys.arrowleft)dx-=.004;if(keys.d||keys.arrowright)dx+=.004;
  if(dx&&dy){dx*=.707;dy*=.707}
  x=Math.max(.03,Math.min(.97,x+dx));y=Math.max(.06,Math.min(.94,y+dy));
  player.style.left=x*100+'%';player.style.top=y*100+'%';
  const target=getTarget();
  if(target){
    interaction.style.display='block';
    interaction.textContent=target.type==='letter'?'E — Recoger carta':'E — Hablar con '+target.data.name;
    if(keys.e){interact();keys.e=false}
  }else interaction.style.display='none';
  requestAnimationFrame(loop)
}
updateUI();loop();