(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./mr-physics-models.js'):root.MRPhysics,node?require('./flow-gradient-phase-model.js'):root.FlowGradientPhase);if(node)module.exports=api;else root.FlowMixture=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P,F){
 'use strict';
 const defaults=Object.freeze({speed:'10',positiveFraction:.5,lobeMs:2}),phaseThreshold=1e-8;
 const unitPhases=Object.fromEntries([1,2,3].map(lobeMs=>[lobeMs,F.calculate({velocityCmS:10,lobeMs,polarity:1}).end.phase]));
 const v90CmS=10*Math.PI/2/unitPhases[2];
 function calculate(options={}){
  const o={...defaults,...options};if(!['0','10','50','v90'].includes(o.speed)||![0,.25,.5,.75,1].includes(o.positiveFraction)||![1,2,3].includes(o.lobeMs))throw new RangeError('Unsupported flow mixture state');
  const velocityCmS=o.speed==='v90'?v90CmS:Number(o.speed),phaseRad=unitPhases[o.lobeMs]*velocityCmS/10,durationMs=2*o.lobeMs;
  const vector=phase=>P.free({x:1,y:0,z:0},durationMs,-phase/(2*Math.PI*durationMs/1000));
  const positive=vector(phaseRad),negative=vector(-phaseRad);
  function combine(positiveFraction){
   const negativeFraction=1-positiveFraction,real=positiveFraction*positive.x+negativeFraction*negative.x,imaginary=positiveFraction*positive.y+negativeFraction*negative.y,magnitude=Math.hypot(real,imaginary);
   let phase=magnitude<=phaseThreshold?null:Math.atan2(imaginary,real);if(phase!==null&&Math.abs(phase+Math.PI)<1e-12)phase=Math.PI;
   return{positiveFraction,negativeFraction,real,imaginary,magnitude,phase,scalarSum:positiveFraction*Math.hypot(positive.x,positive.y)+negativeFraction*Math.hypot(negative.x,negative.y),meanVelocityCmS:(2*positiveFraction-1)*velocityCmS,meanAccumulatedPhase:(2*positiveFraction-1)*phaseRad};
  }
  return{options:o,phaseThreshold,v90CmS,velocityCmS,phaseRad,durationMs,positive,negative,current:combine(o.positiveFraction),curve:Array.from({length:101},(_,j)=>combine(j/100))};
 }
 return{defaults,phaseThreshold,v90CmS,calculate};
});
