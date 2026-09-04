import { MEMORIES } from './content/memories.js';
import { CHARACTERS } from './content/characters.js';
import { getDialogueLines } from './content/dialogues.js';
import { getMissionById } from './content/missions.js';
import { LOCATIONS, DOORS } from './content/locations.js';

export const VERSION='v0.8.0';

export const WORLD={
  width:2400,height:1500,spawn:{x:360,y:760},river:{x:1810,width:220},bridge:{x:1690,y:650,w:460,h:100},
  zones:[{id:'town',name:'Villa Pelón',x:120,y:180,width:1450,height:650},{id:'chacras',name:'Chacras',x:120,y:830,width:1450,height:520},{id:'river-west',name:'Ribera',x:1570,y:180,width:240,height:1170},{id:'river-east',name:'Más allá del río',x:2030,y:180,width:250,height:1170}],
  roads:[{id:'main-road',x:0,y:650,width:1690,height:105,kind:'road'},{id:'riverside-road',x:1590,y:650,width:620,height:100,kind:'road'},{id:'bridge',x:1690,y:650,width:460,h:100,kind:'bridge'}],
  farms:[{id:'north-grove',x:190,y:230,width:420,height:250},{id:'orchard-west',x:620,y:910,width:430,height:250},{id:'orchard-south',x:1080,y:1040,width:360,height:220}],
  buildings:[{id:'house-marta',name:'Casa de Marta',x:270,y:420,width:190,height:150,roof:'#9c5b42',type:'house'},{id:'community-center',name:'Centro Comunitario',x:820,y:360,width:210,height:140,roof:'#a36c4b',type:'public'},{id:'workshop',name:'Taller',x:1180,y:420,width:230,height:150,roof:'#8b6045',type:'workshop'}],
  obstacles:[{id:'house-marta',x:270,y:420,width:190,height:150},{id:'community-center',x:820,y:360,width:210,height:140},{id:'workshop',x:1180,y:420,width:230,height:150},{id:'river-north',x:1810,y:0,width:220,height:650},{id:'river-south',x:1810,y:750,width:220,height:750}],
  points:{spawn:{x:360,y:760},marta:{x:760,y:690},tomas:{x:1320,y:930},firstMemory:{x:1040,y:520},communityCenter:{x:925,y:520},bridgeWest:{x:1690,y:700},bridgeEast:{x:2150,y:700},martaHome:{x:500,y:600},orchardWest:{x:835,y:1035}}
};

export const NPCS=CHARACTERS.map((character)=>({...character,dialogue:getDialogueLines(character.dialogueIds),text:getDialogueLines(character.dialogueIds)[0]?.text ?? ''}));
export const DISCOVERY={...MEMORIES[0],x:1040,y:520,interactable:true,collidable:false,type:'discovery'};
export const MISSION=getMissionById('territory-01');
export { LOCATIONS, DOORS };
