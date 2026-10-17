(function(root,factory){
  const node=typeof module==='object'&&module.exports;
  const api=factory(node?require('./mr-physics-models.js'):root.MRPhysics);
  if(node)module.exports=api;else root.FiniteSliceRF=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(P){
  'use strict';
  const defaults=Object.freeze({durationMs:4,flipDeg:90,gradientMilliTPerM:10});
  const timeSteps=2048,tbw=4;
  const shape=u=>u===0?1:Math.sin(Math.PI*u)/(Math.PI*u);
  function calculate(options={}){
    const o={...defaults,...options};
    if(![2,4,8].includes(o.durationMs)||![30,90].includes(o.flipDeg)||![-10,-5,5,10].includes(o.gradientMilliTPerM))throw new RangeError('Unsupported finite slice RF state');
    const dtMs=o.durationMs/timeSteps;
    const samples=Array.from({length:timeSteps},(_,j)=>shape(tbw*((j+.5)/timeSteps-.5)));
    const shapeIntegralSeconds=samples.reduce((a,b)=>a+b,0)*dtMs/1000;
    const peakB1MicroT=o.flipDeg/360/(P.GAMMA_HZ_PER_UT*shapeIntegralSeconds);
    const b1=samples.map(v=>v*peakB1MicroT);
    const areaFlipDeg=360*P.GAMMA_HZ_PER_UT*b1.reduce((a,b)=>a+b,0)*dtMs/1000;
    const nominalBandwidthHz=tbw*1000/o.durationMs;
    const nominalThicknessMm=nominalBandwidthHz/(P.GAMMA_HZ_PER_UT*Math.abs(o.gradientMilliTPerM));
    const profile=Array.from({length:201},(_,j)=>{
      const zMm=-10+j/10,offResHz=P.GAMMA_HZ_PER_UT*o.gradientMilliTPerM*zMm;
      let m=P.v(0,0,1);
      for(const b1MicroT of b1)m=P.hardPulse(m,{b1MicroT,offResHz,durationMs:dtMs});
      return{zMm,offResHz,x:m.x,y:m.y,z:m.z,magnitude:Math.hypot(m.x,m.y),norm:Math.hypot(m.x,m.y,m.z),idealMagnitude:Math.abs(zMm)<nominalThicknessMm/2?Math.sin(o.flipDeg*Math.PI/180):0};
    });
    const waveform=Array.from({length:257},(_,j)=>({timeMs:j/256*o.durationMs,b1MicroT:peakB1MicroT*shape(tbw*(j/256-.5))}));
    return{options:o,timeSteps,tbw,areaFlipDeg,peakB1MicroT,nominalBandwidthHz,nominalThicknessMm,profile,waveform,center:profile[100]};
  }
  return{defaults,timeSteps,tbw,calculate};
});
