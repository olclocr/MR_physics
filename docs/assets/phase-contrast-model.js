(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./mr-physics-models.js'):root.MRPhysics,node?require('./flow-gradient-phase-model.js'):root.FlowGradientPhase);if(node)module.exports=api;else root.PhaseContrast=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P,F){
 'use strict';
 const defaults=Object.freeze({velocityCmS:75,vencCmS:150,commonPhaseDeg:0}),lobeMs=2;
 const unit=F.calculate({velocityCmS:10,lobeMs,polarity:1}),gammaRad=F.gammaRad;
 function principal(x,y){const a=Math.atan2(y,x);return Math.abs(Math.abs(a)-Math.PI)<1e-12?Math.PI:Math.abs(a)<1e-12?0:a;}
 function calculate(options={}){
  const o={...defaults,...options};if(![-300,-150,-75,0,75,150,300].includes(o.velocityCmS)||![75,150,300].includes(o.vencCmS)||![-120,0,120].includes(o.commonPhaseDeg))throw new RangeError('Unsupported phase contrast state');
  const durationMs=2*lobeMs,momentMagnitude=Math.PI/(2*gammaRad*(o.vencCmS/100)),gradientTm=momentMagnitude/(lobeMs/1000)**2;
  const commonPhase=o.commonPhaseDeg*Math.PI/180;
  const vector=phase=>P.free({x:1,y:0,z:0},durationMs,-phase/(2*Math.PI*durationMs/1000));
  function point(velocityCmS){
   const motionPhase=unit.end.phase*(gradientTm/F.gradientTm)*(velocityCmS/10),a=vector(commonPhase-motionPhase),b=vector(commonPhase+motionPhase);
   const real=b.x*a.x+b.y*a.y,imaginary=b.y*a.x-b.x*a.y,phase=principal(real,imaginary),estimatedVelocityCmS=o.vencCmS*phase/Math.PI;
   return{velocityCmS,a,b,phaseA:principal(a.x,a.y),phaseB:principal(b.x,b.y),real,imaginary,magnitude:Math.hypot(real,imaginary),phase,estimatedVelocityCmS,trueDeltaPhase:2*motionPhase,aliasErrorCmS:velocityCmS-estimatedVelocityCmS,boundary:Math.abs(Math.abs(phase)-Math.PI)<1e-12};
  }
  return{options:o,durationMs,lobeMs,gammaRad,gradientTm,momentA:momentMagnitude,momentB:-momentMagnitude,deltaMoment:-2*momentMagnitude,commonPhase,current:point(o.velocityCmS),curve:Array.from({length:121},(_,i)=>point(-300+5*i))};
 }
 return{defaults,lobeMs,gammaRad,calculate};
});
