'use strict';
const B=require('./gre-reference.cjs');
function calculate(o){
 const angle=o.flipDeg*Math.PI/180,steady=B.reference(o.trMs,o.flipDeg,1200),current=v=>Math.hypot(...B.rotate([0,0,v],angle).slice(0,2));
 const profile=[];
 for(let j=0;j<120;j++){
  const positionMm=(j+.5)*.25;let z=1,previousRF=o.velocityCmS?0:null;
  if(o.velocityCmS){
   // Trace every past RF at its actual position on a known worldline. No
   // depth/displacement floor or closed recurrence is used here.
   for(let pulse=-80;pulse<0;pulse++){
    const positionThenM=positionMm*.001+o.velocityCmS*.01*pulse*o.trMs*.001;
    if(positionThenM>=0&&positionThenM<.03){z=B.rotate([0,0,z],angle)[2];previousRF++;}
    z=B.ode(z,o.trMs,1200,1);
   }
  }else z=steady.mz;
  const signal=current(z);profile.push({index:j,positionMm,previousRF,beforeRF:z,signal,ratioToStatic:signal/current(steady.mz)});
 }
 return{options:o,displacementMm:o.velocityCmS*10*o.trMs/1000,staticBeforeRF:steady.mz,staticSignal:current(steady.mz),freshSignal:current(1),profile,meanSignal:profile.reduce((s,p)=>s+p.signal,0)/120};
}
module.exports={calculate};
