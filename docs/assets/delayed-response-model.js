(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DelayedResponse=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';const defaults=Object.freeze({durationSec:2,scaleSec:1,timeSec:8}),times=Object.freeze([0,2,4,8,12,20]),cache=new Map(),onsetSec=2;
 function kernel(timeSec,scaleSec){if(!Number.isFinite(timeSec)||![1,2].includes(scaleSec))throw new RangeError('Finite time and supported kernel scale required');return timeSec<0?0:timeSec*timeSec*Math.exp(-timeSec/scaleSec)/(2*scaleSec**3);}
 function integral(timeSec,scaleSec){if(timeSec<=0)return 0;const x=timeSec/scaleSec;return-Math.expm1(-x)-Math.exp(-x)*(x+x*x/2);}
 function calculate(options={}){
  const o={...defaults,...options};if(![2,6].includes(o.durationSec)||![1,2].includes(o.scaleSec)||!times.includes(o.timeSec))throw new RangeError('Unsupported delayed response state');const key=o.durationSec+'|'+o.scaleSec;
  if(!cache.has(key)){const inputEndSec=onsetSec+o.durationSec,response=time=>integral(time-onsetSec,o.scaleSec)-integral(time-inputEndSec,o.scaleSec),curve=Array.from({length:241},(_,j)=>{const timeSec=j/10;return Object.freeze({timeSec,input:timeSec>=onsetSec&&timeSec<inputEndSec?1:0,response:response(timeSec)});}),peakTimeSec=onsetSec+o.durationSec/(-Math.expm1(-o.durationSec/(2*o.scaleSec)));cache.set(key,Object.freeze({onsetSec,inputEndSec,curve:Object.freeze(curve),kernelCurve:Object.freeze(Array.from({length:121},(_,j)=>Object.freeze({timeSec:j/10,value:kernel(j/10,o.scaleSec)}))),peakTimeSec,peakResponse:response(peakTimeSec),kernelPeakTimeSec:2*o.scaleSec,kernelPeak:kernel(2*o.scaleSec,o.scaleSec),totalResponseAreaSec:o.durationSec}));}
  const base=cache.get(key);return{options:o,...base,current:base.curve[Math.round(o.timeSec*10)]};
 }
 return{defaults,times,kernel,calculate};
});
