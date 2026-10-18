(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./mr-physics-models.js'):root.MRPhysics);if(node)module.exports=api;else root.LabelArrival=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P){
 'use strict';const defaults=Object.freeze({velocityCmS:20,t1Ms:1600,delaySec:2}),delays=Object.freeze([.5,1,2,3]),distanceCm=20,cache=new Map();
 function calculate(options={}){
  const o={...defaults,...options};if(![10,20,40].includes(o.velocityCmS)||![1000,1600,2200].includes(o.t1Ms)||!delays.includes(o.delaySec))throw new RangeError('Unsupported label packet state');const key=o.velocityCmS+'|'+o.t1Ms;
  if(!cache.has(key)){const arrivalSec=distanceCm/o.velocityCmS,curve=Array.from({length:61},(_,j)=>{const timeSec=j/20,timeMs=timeSec*1000,control=P.relax({x:0,y:0,z:1},timeMs,o.t1Ms,Infinity,1).z,label=P.relax({x:0,y:0,z:-1},timeMs,o.t1Ms,Infinity,1).z,remaining=(control-label)/2,arrived=timeSec>=arrivalSec;return Object.freeze({timeSec,control,label,remaining,arrived,positionCm:Math.min(distanceCm,o.velocityCmS*timeSec),observed:arrived?remaining:0});});cache.set(key,Object.freeze({arrivalSec,curve:Object.freeze(curve)}));}
  const base=cache.get(key);return{options:o,distanceCm,...base,current:base.curve[Math.round(o.delaySec*20)]};
 }
 return{defaults,delays,distanceCm,calculate};
});
