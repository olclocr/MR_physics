(function(root,factory){
  const node=typeof module==='object'&&module.exports,api=factory(node?require('./mr-physics-models.js'):root.MRPhysics);
  if(node)module.exports=api;else root.FlowGradientPhase=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(P){
  'use strict';
  const defaults=Object.freeze({velocityCmS:10,lobeMs:2,polarity:1}),gradientTm=.002,initialM=.001;
  const gammaRad=2*Math.PI*P.GAMMA_HZ_PER_UT*1e6;
  function at(o,timeMs){
    const tau=o.lobeMs/1000,t=timeMs/1000,g=o.polarity*gradientTm,v=o.velocityCmS/100;
    const first=Math.min(t,tau),second=Math.max(0,t-tau);
    const moment0=g*(first-second),moment1=g*(first*first/2-(second? (t*t-tau*tau)/2:0));
    const phaseStationary=-gammaRad*initialM*moment0,phaseMotion=-gammaRad*v*moment1,phase=phaseStationary+phaseMotion;
    // All fields point along z, so their commuting rotations equal the rotation
    // at the time-averaged frequency. Phase remains unwrapped separately.
    const hz=timeMs? -phase/(2*Math.PI*t):0;
    const m=P.free({x:1,y:0,z:0},timeMs,hz),stationary=P.free({x:1,y:0,z:0},timeMs,timeMs?-phaseStationary/(2*Math.PI*t):0);
    return{timeMs,positionMm:1000*(initialM+v*t),gradientMtM:timeMs===2*o.lobeMs?0:timeMs<o.lobeMs?g*1000:-g*1000,moment0,moment1,phase,phaseMotion,phaseStationary,real:m.x,imaginary:m.y,stationaryReal:stationary.x,stationaryImaginary:stationary.y,magnitude:Math.hypot(m.x,m.y)};
  }
  function calculate(options={}){
    const o={...defaults,...options};
    if(![-10,0,10].includes(o.velocityCmS)||![1,2,3].includes(o.lobeMs)||![-1,1].includes(o.polarity))throw new RangeError('Unsupported flow gradient state');
    const curve=Array.from({length:201},(_,i)=>at(o,2*o.lobeMs*i/200));
    return{options:o,gradientTm,initialM,gammaRad,durationMs:2*o.lobeMs,curve,end:curve[200]};
  }
  return{defaults,gradientTm,initialM,gammaRad,calculate};
});
