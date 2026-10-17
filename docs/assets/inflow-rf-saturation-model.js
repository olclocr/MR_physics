(function(root,factory){
 const node=typeof module==='object'&&module.exports,api=factory(node?require('./spoiled-gre-model.js'):root.SpoiledGRE);
 if(node)module.exports=api;else root.InflowRFSaturation=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(G){
 'use strict';
 const defaults=Object.freeze({velocityCmS:10,trMs:20,flipDeg:30}),slabMm=30,t1Ms=1200,samples=120;
 function calculate(options={}){
  const o={...defaults,...options};if(![0,5,10,20].includes(o.velocityCmS)||![10,20,40].includes(o.trMs)||![10,30,60].includes(o.flipDeg))throw new RangeError('Unsupported inflow RF state');
  const stationary=G.tissue(o.trMs,o.flipDeg,t1Ms),sin=Math.sin(o.flipDeg*Math.PI/180),displacementMm=o.velocityCmS*10*o.trMs/1000;
  const staticSignal=stationary.mz*sin,freshSignal=sin;
  const profile=Array.from({length:samples},(_,index)=>{
   const positionMm=(index+.5)*slabMm/samples,previousRF=o.velocityCmS?Math.floor(positionMm/displacementMm):null;
   const beforeRF=previousRF===null?stationary.mz:stationary.mz+(1-stationary.mz)*stationary.q**previousRF;
   const signal=beforeRF*sin;return{index,positionMm,previousRF,beforeRF,signal,ratioToStatic:signal/staticSignal};
  });
  return{options:o,slabMm,t1Ms,samples,displacementMm,staticBeforeRF:stationary.mz,staticSignal,freshSignal,profile,meanSignal:profile.reduce((s,p)=>s+p.signal,0)/samples};
 }
 return{defaults,slabMm,t1Ms,samples,calculate};
});
