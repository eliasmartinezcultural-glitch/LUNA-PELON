export const VERSION='v0.6.0';

export const WORLD={
  width:2400,
  height:1500,
  spawn:{x:360,y:760},
  river:{x:1810,width:220},
  bridge:{x:1690,y:650,w:460,h:100},
  zones:[
    {id:'town',name:'Villa Pelón',x:120,y:180,width:1450,height:650},
    {id:'chacras',name:'Chacras',x:120,y:830,width:1450,height:520},
    {id:'river-west',name:'Ribera',x:1570,y:180,width:240,height:1170},
    {id:'river-east',name:'Más allá del río',x:2030,y:180,width:250,height:1170}
  ],
  roads:[
    {id:'main-road',x:0,y:650,width:1690,height:105,kind:'road'},
    {id:'riverside-road',x:1590,y:650,width:620,height:100,kind:'road'},
    {id:'bridge',x:1690,y:650,width:460,height:100,kind:'bridge'}
  ],
  farms:[
    {id:'north-grove',x:190,y:230,width:420,height:250},
    {id:'orchard-west',x:620,y:910,width:430,height:250},
    {id:'orchard-south',x:1080,y:1040,width:360,height:220}
  ],
  buildings:[
    {id:'house-marta',x:270,y:420,width:190,height:150,roof:'#9c5b42',type:'house'},
    {id:'community-center',x:820,y:360,width:210,height:140,roof:'#a36c4b',type:'public'},
    {id:'workshop',x:1180,y:420,width:230,height:150,roof:'#8b6045',type:'workshop'}
  ],
  obstacles:[
    {id:'house-marta',x:270,y:420,width:190,height:150},
    {id:'community-center',x:820,y:360,width:210,height:140},
    {id:'workshop',x:1180,y:420,width:230,height:150},
    {id:'river-north',x:1810,y:0,width:220,height:650},
    {id:'river-south',x:1810,y:750,width:220,height:750}
  ],
  points:{
    spawn:{x:360,y:760},
    marta:{x:760,y:690},
    tomas:{x:1320,y:930},
    firstMemory:{x:1040,y:520},
    communityCenter:{x:925,y:520},
    bridgeWest:{x:1690,y:700},
    bridgeEast:{x:2150,y:700}
  }
};

export const NPCS=[
  {
    id:'marta',type:'npc',name:'Marta',x:760,y:690,color:'#9b5b43',radius:14,collidable:true,interactable:true,speed:62,
    schedule:[
      {start:0,target:'point:houseMarta',state:'resting'},
      {start:8*60,target:'point:communityCenter',state:'working'},
      {start:13*60,target:'point:houseMarta',state:'resting'},
      {start:17*60,target:'point:communityCenter',state:'talking'},
      {start:21*60,target:'point:houseMarta',state:'resting'}
    ],
    text:'Hola, Luna. Si querés conocer Villa Pelón, empezá por mirar el territorio y escuchar sus historias.'
  },
  {
    id:'tomas',type:'npc',name:'Tomás',x:1320,y:930,color:'#536d4b',radius:14,collidable:true,interactable:true,speed:68,
    schedule:[
      {start:0,target:'point:houseMarta',state:'resting'},
      {start:7*60,target:'point:orchardWest',state:'working'},
      {start:14*60,target:'point:bridgeWest',state:'walking'},
      {start:18*60,target:'point:communityCenter',state:'talking'},
      {start:22*60,target:'point:houseMarta',state:'resting'}
    ],
    text:'El paisaje también guarda memoria: el río, las chacras y los caminos ayudan a entender cómo se construyó una comunidad.'
  }
];

export const DISCOVERY={id:'first-memory',type:'discovery',x:1040,y:520,title:'Primera huella',interactable:true,collidable:false,text:'El primer aprendizaje de Luna: una historia local no vive solamente en fechas. También vive en el territorio, sus caminos, el agua, el trabajo y las personas.'};
export const MISSION={id:'territory-01',title:'Escuchar el territorio',objective:'Encontrá a Marta y conversá con ella.'};
