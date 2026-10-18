(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.TemporalWindow=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';const defaults=Object.freeze({windowSec:2,frameIntervalSec:2,selectedTimeSec:10}),cache=new Map();
 function instantaneous(t){return .05+(t>0&&t<20?.25*Math.sin(Math.PI*t/20)**2:0);}
 function primitive(t){const u=Math.min(20,Math.max(0,t));return .05*t+.25*(u/2-20/(4*Math.PI)*Math.sin(2*Math.PI*u/20));}
 function calculate(options={}){
  const o={...defaults,...options};if(![2,6,12].includes(o.windowSec)||![2,6].includes(o.frameIntervalSec)||!Number.isFinite(o.selectedTimeSec)||o.selectedTimeSec<0||o.selectedTimeSec>30)throw new RangeError('Unsupported temporal window state');
  const key=o.windowSec+'|'+o.frameIntervalSec;if(!cache.has(key)){
   const at=centerSec=>Object.freeze({centerSec,startSec:centerSec-o.windowSec/2,endSec:centerSec+o.windowSec/2,instantaneous:instantaneous(centerSec),average:(primitive(centerSec+o.windowSec/2)-primitive(centerSec-o.windowSec/2))/o.windowSec});
   const frames=Object.freeze(Array.from({length:30/o.frameIntervalSec+1},(_,i)=>Object.freeze({index:i,...at(i*o.frameIntervalSec)}))),curve=Object.freeze(Array.from({length:301},(_,i)=>at(i/10))),peak=frames.reduce((best,p)=>p.average>best.average?p:best,frames[0]);
   cache.set(key,Object.freeze({frames,curve,peak,overlapFraction:Math.max(0,1-o.frameIntervalSec/o.windowSec)}));
  }
  const base=cache.get(key),index=Math.max(0,Math.min(base.frames.length-1,Math.round(o.selectedTimeSec/o.frameIntervalSec)));
  return{options:o,...base,current:base.frames[index],truePeak:{timeSec:10,value:.3},baseline:.05};
 }
 return{defaults,instantaneous,calculate};
});
