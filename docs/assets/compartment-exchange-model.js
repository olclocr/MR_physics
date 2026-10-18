(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CompartmentExchange=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';const defaults=Object.freeze({ktransMin:.2,ve:.2,timeMin:2}),times=Object.freeze([0,.5,1,2,4,6]),cache=new Map();
 function rectangularInputAt(ktransMin,ve,timeMin,{durationMin=1,amplitudeMm=1}={}){
  if(![ktransMin,ve,timeMin,durationMin,amplitudeMm].every(Number.isFinite)||ktransMin<0||ve<=0||ve>1||timeMin<0||durationMin<=0||amplitudeMm<0)throw new RangeError('Finite nonnegative rates/time/input and positive EES fraction/input duration required');
  const kepMin=ktransMin/ve,plasma=timeMin<durationMin?amplitudeMm:0,tissue=amplitudeMm*ve*(-Math.expm1(-kepMin*Math.min(timeMin,durationMin)))*Math.exp(-kepMin*Math.max(0,timeMin-durationMin)),ees=tissue/ve,influx=ktransMin*plasma,efflux=kepMin*tissue,entered=ktransMin*amplitudeMm*Math.min(timeMin,durationMin),left=entered-tissue;
  return Object.freeze({timeMin,plasma,tissue,ees,influx,efflux,entered,left,netRate:influx-efflux});
 }
 function calculate(options={}){
  const o={...defaults,...options};if(![0,.1,.2,.4].includes(o.ktransMin)||![.2,.4].includes(o.ve)||!times.includes(o.timeMin))throw new RangeError('Unsupported single compartment state');
  const key=o.ktransMin+'|'+o.ve;if(!cache.has(key)){const curve=Array.from({length:121},(_,j)=>rectangularInputAt(o.ktransMin,o.ve,j/20)),kepMin=o.ktransMin/o.ve;cache.set(key,Object.freeze({curve:Object.freeze(curve),kepMin,halfLifeMin:kepMin===0?null:Math.LN2/kepMin,peakTimeMin:o.ktransMin===0?null:1,peakTissue:rectangularInputAt(o.ktransMin,o.ve,1).tissue}));}
  const base=cache.get(key);return{options:o,...base,current:base.curve[Math.round(o.timeMin*20)]};
 }
 return{defaults,times,calculate,rectangularInputAt};
});
