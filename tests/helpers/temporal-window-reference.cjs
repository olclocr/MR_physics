'use strict';
// Independent event-split numerical quadrature; no analytic product primitive.
function signal(t){if(t<=0||t>=20)return .05;const c=Math.cos(2*Math.PI*t/20);return .175-.125*c;}
function integral(a,b,subdivisions=512){
 const events=[a,...[0,20].filter(t=>t>a&&t<b),b];let total=0;
 for(let e=0;e<events.length-1;e++){
  const lo=events[e],hi=events[e+1],h=(hi-lo)/subdivisions;let sum=signal(lo)+signal(hi);
  for(let j=1;j<subdivisions;j++)sum+=(j%2?4:2)*signal(lo+j*h);
  total+=sum*h/3;
 }
 return total;
}
function at(centerSec,windowSec,subdivisions=512){return{centerSec,startSec:centerSec-windowSec/2,endSec:centerSec+windowSec/2,instantaneous:signal(centerSec),average:integral(centerSec-windowSec/2,centerSec+windowSec/2,subdivisions)/windowSec};}
function calculate(o){
 const frames=[];let index=0;for(let t=0;t<=30;t+=o.frameIntervalSec)frames.push({index:index++,...at(t,o.windowSec)});
 let current=frames[0];for(const f of frames)if(Math.abs(f.centerSec-o.selectedTimeSec)<=Math.abs(current.centerSec-o.selectedTimeSec))current=f;
 let peak=frames[0];for(const p of frames)if(p.average>peak.average)peak=p;
 const overlapLength=Math.max(0,Math.min(o.windowSec/2,o.frameIntervalSec+o.windowSec/2)-Math.max(-o.windowSec/2,o.frameIntervalSec-o.windowSec/2));
 return{options:o,frames,current,peak,overlapFraction:overlapLength/o.windowSec,curve:Array.from({length:301},(_,i)=>at(i/10,o.windowSec))};
}
module.exports={calculate,at,integral};
