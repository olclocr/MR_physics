(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CompartmentExchange=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';const defaults=Object.freeze({ktransMin:.2,ve:.2,timeMin:2}),times=Object.freeze([0,.5,1,2,4,6]),cache=new Map();
 function at(ktransMin,ve,timeMin){
  if(!Number.isFinite(timeMin)||timeMin<0)throw new RangeError('Nonnegative time in minutes required');
  const kepMin=ktransMin/ve,plasma=timeMin<1?1:0,tissue=ve*(-Math.expm1(-kepMin*Math.min(timeMin,1)))*Math.exp(-kepMin*Math.max(0,timeMin-1)),ees=tissue/ve,influx=ktransMin*plasma,efflux=kepMin*tissue,entered=ktransMin*Math.min(timeMin,1),left=entered-tissue;
  return Object.freeze({timeMin,plasma,tissue,ees,influx,efflux,entered,left,netRate:influx-efflux});
 }
 function calculate(options={}){
  const o={...defaults,...options};if(![0,.1,.2,.4].includes(o.ktransMin)||![.2,.4].includes(o.ve)||!times.includes(o.timeMin))throw new RangeError('Unsupported single compartment state');
  const key=o.ktransMin+'|'+o.ve;if(!cache.has(key)){const curve=Array.from({length:121},(_,j)=>at(o.ktransMin,o.ve,j/20)),kepMin=o.ktransMin/o.ve;cache.set(key,Object.freeze({curve:Object.freeze(curve),kepMin,halfLifeMin:kepMin===0?null:Math.LN2/kepMin,peakTimeMin:o.ktransMin===0?null:1,peakTissue:at(o.ktransMin,o.ve,1).tissue}));}
  const base=cache.get(key);return{options:o,...base,current:base.curve[Math.round(o.timeMin*20)]};
 }
 return{defaults,times,calculate};
});
