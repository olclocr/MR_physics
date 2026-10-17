const G=require('./gre-reference.cjs');
const cache=new Map();
function point(c,te,flip){
  const r1=1+4*c,r2=25+20*c,t1=1000/r1,t2=1000/r2,key=c+'/'+flip;
  if(!cache.has(key)){
    const repeated=G.reference(20,flip,t1),v=G.rotate([0,0,repeated.mz],flip*Math.PI/180);
    cache.set(key,{beforeRF:repeated.mz,afterRF:Math.hypot(v[0],v[1])});
  }
  const p=cache.get(key),signal=G.ode(p.afterRF,te,t2,0),t1Only=G.ode(p.afterRF,te,40,0);
  return{concentrationMm:c,r1PerS:r1,r2StarPerS:r2,t1Ms:t1,t2StarMs:t2,...p,signal,t1Only};
}
function reference(o){
  const baseline=point(0,o.teMs,o.flipDeg),ratio=p=>({...p,ratio:p.signal/baseline.signal});
  return{options:o,baseline,current:ratio(point(o.concentrationMm,o.teMs,o.flipDeg)),curve:Array.from({length:161},(_,j)=>ratio(point(j/40,o.teMs,o.flipDeg)))};
}
module.exports={point,reference};
