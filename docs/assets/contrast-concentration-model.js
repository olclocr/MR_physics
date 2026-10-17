(function(root,factory){
  const node=typeof module==='object'&&module.exports,api=factory(node?require('./spoiled-gre-model.js'):root.SpoiledGRE);
  if(node)module.exports=api;else root.ContrastConcentration=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(G){
  'use strict';
  const defaults=Object.freeze({concentrationMm:1,teMs:8,flipDeg:15});
  const trMs=20,r1Slope=4,r2StarSlope=20,r1Native=1,r2StarNative=25;
  function at(concentrationMm,teMs,flipDeg){
    const r1PerS=r1Native+r1Slope*concentrationMm,r2StarPerS=r2StarNative+r2StarSlope*concentrationMm;
    const t1Ms=1000/r1PerS,t2StarMs=1000/r2StarPerS;
    const rf=G.tissue(trMs,flipDeg,t1Ms);
    // Remove only the old model's fixed readout decay, then apply this TE once.
    const afterRF=rf.signal/Math.exp(-G.teMs/G.t2StarMs);
    const signal=afterRF*Math.exp(-teMs*r2StarPerS/1000),t1Only=afterRF*Math.exp(-teMs*r2StarNative/1000);
    return{concentrationMm,r1PerS,r2StarPerS,t1Ms,t2StarMs,beforeRF:rf.mz,afterRF,signal,t1Only};
  }
  function calculate(options={}){
    const o={...defaults,...options};
    if(![0,.25,.5,1,2,4].includes(o.concentrationMm)||![2,8,16].includes(o.teMs)||![5,15,30].includes(o.flipDeg))throw new RangeError('Unsupported contrast concentration state');
    const baseline=at(0,o.teMs,o.flipDeg),ratio=p=>({...p,ratio:p.signal/baseline.signal});
    const current=ratio(at(o.concentrationMm,o.teMs,o.flipDeg));
    const curve=Array.from({length:161},(_,j)=>ratio(at(j/40,o.teMs,o.flipDeg)));
    return{options:o,trMs,r1Slope,r2StarSlope,r1Native,r2StarNative,current,baseline,curve};
  }
  return{defaults,trMs,r1Slope,r2StarSlope,r1Native,r2StarNative,calculate};
});
