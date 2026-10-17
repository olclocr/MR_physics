(function(root,factory){const adc=typeof module==='object'&&module.exports?require('./adc-fit-model.js'):root.ADCFit,api=factory(adc);if(typeof module==='object'&&module.exports)module.exports=api;else root.DWIEPI=api;})(typeof globalThis!=='undefined'?globalThis:this,function(adc){
 'use strict';
 const defaults=Object.freeze({b:1000,mode:'single',offsetHz:50,polarity:1}),n=32,fovMm=160,pointMm=-20,teMs=80;
 const modes=Object.freeze({single:Object.freeze({label:'Single shot',r:1,shots:1,espMs:.8}),parallel:Object.freeze({label:'PI R=2 · 시간 예시',r:2,shots:1,espMs:.8}),segmented:Object.freeze({label:'읽기 3분할 · 시간 예시',r:1,shots:3,espMs:.4})});
 const signalRows=adc.calculate({diffusionMm2PerS:.001,t2Ms:80,sigma:0}).rows;
 function calculate(options={}){
  const o={...defaults,...options};if(!adc.bValues.includes(o.b)||!Object.hasOwn(modes,o.mode)||!Number.isFinite(o.offsetHz)||o.offsetHz< -100||o.offsetHz>100||![1,-1].includes(o.polarity))throw new RangeError('Unsupported DWI/EPI scenario');
  const mode=modes[o.mode],effectiveEspMs=mode.espMs/mode.r,rowsPerShot=n/mode.r,signal=signalRows.find(p=>p.b===o.b).signal,b0Signal=signalRows[0].signal,events=[];
  for(let shot=0;shot<mode.shots;shot++)for(let row=0;row<rowsPerShot;row++){
   const q=-n/2+row*mode.r,ky=o.polarity*q/fovMm,centerMs=teMs+(row-rowsPerShot/2)*mode.espMs,spatialPhase=-2*Math.PI*ky*pointMm,offResPhase=-2*Math.PI*o.offsetHz*(centerMs-teMs)/1000,phase=spatialPhase+offResPhase;
   events.push({shot:shot+1,row,q,ky,centerMs,offResPhase,real:signal*Math.cos(phase),imaginary:signal*Math.sin(phase)});
  }
  const shiftMm=o.polarity*o.offsetHz*effectiveEspMs/1000*fovMm,predictedMm=pointMm+shiftMm,phaseHzPerPixel=1000/(n*effectiveEspMs),centerSpanMs=(rowsPerShot-1)*mode.espMs;
  return {options:o,mode,n,fovMm,pointMm,teMs,rowsPerShot,effectiveEspMs,centerSpanMs,phaseHzPerPixel,signal,b0Signal,relativeDiffusionSignal:signal/b0Signal,shiftMm,shiftPixels:shiftMm/(fovMm/n),predictedMm,events};
 }
 return {defaults,modes,n,fovMm,pointMm,teMs,calculate};
});
