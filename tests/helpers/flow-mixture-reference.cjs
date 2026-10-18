'use strict';
const R=require('./flow-gradient-phase-reference.cjs'),cache=new Map(),v90CmS=100/(4*42.57747892e6*.002*.002**2),phaseThreshold=1e-8;
function member(velocityCmS,lobeMs){const key=velocityCmS+'|'+lobeMs;if(!cache.has(key))cache.set(key,R.calculate({velocityCmS,lobeMs,polarity:1}).end);return cache.get(key);}
function calculate(o){
 const velocityCmS=o.speed==='v90'?v90CmS:Number(o.speed),positive=member(velocityCmS,o.lobeMs),negative=member(-velocityCmS,o.lobeMs);
 function sum(f){
  const real=f*positive.real+(1-f)*negative.real,imaginary=f*positive.imaginary+(1-f)*negative.imaginary,magnitude=Math.hypot(real,imaginary);let phase=magnitude<=phaseThreshold?null:Math.atan2(imaginary,real);if(phase!==null&&Math.abs(phase+Math.PI)<1e-8)phase=Math.PI;
  return{positiveFraction:f,negativeFraction:1-f,real,imaginary,magnitude,phase,scalarSum:f*positive.magnitude+(1-f)*negative.magnitude,meanVelocityCmS:(2*f-1)*velocityCmS,meanAccumulatedPhase:f*positive.phase+(1-f)*negative.phase};
 }
 return{options:o,v90CmS,velocityCmS,phaseRad:positive.phase,positive:{x:positive.real,y:positive.imaginary},negative:{x:negative.real,y:negative.imaginary},current:sum(o.positiveFraction),curve:Array.from({length:101},(_,j)=>sum(j/100))};
}
module.exports={calculate};
