'use strict';const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/phase-contrast-model.js'),R=require('./helpers/phase-contrast-reference.cjs');
const near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`),circle=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
test('two encodings and wrapped velocity curves match independent SI trajectories and congruences',()=>{
 for(const velocityCmS of [-300,-150,-75,0,75,150,300])for(const vencCmS of [75,150,300])for(const commonPhaseDeg of [-120,0,120]){
  const o={velocityCmS,vencCmS,commonPhaseDeg},a=M.calculate(o),b=R.calculate(o);
  for(const [p,q]of [[a.current,b.current],...a.curve.map((p,i)=>[p,b.curve[i]])]){
   for(const s of ['a','b'])for(const k of ['x','y'])near(p[s][k],q[s][k]);
   for(const k of ['real','imaginary','magnitude','estimatedVelocityCmS','aliasErrorCmS','trueDeltaPhase'])near(p[k],q[k]);
   for(const k of ['phaseA','phaseB','phase'])assert.ok(circle(p[k],q[k])<1e-8);
   assert.ok(circle(p.phase,q.complexPhase)<1e-8);assert.equal(p.boundary,q.boundary);near(p.magnitude,1);assert.ok(p.estimatedVelocityCmS>-vencCmS&&p.estimatedVelocityCmS<=vencCmS+1e-10);
  }
  near(a.momentA,b.current.a.moment1,1e-14);near(a.momentB,b.current.b.moment1,1e-14);near(b.current.a.moment0,0,1e-14);near(b.current.b.moment0,0,1e-14);
 }
});
test('common phase cancels while velocity aliases and exact pi boundary is explicitly shared',()=>{
 for(const commonPhaseDeg of [-120,0,120])near(M.calculate({commonPhaseDeg}).current.estimatedVelocityCmS,75);
 const alias=M.calculate({velocityCmS:150,vencCmS:75}),recover=M.calculate({velocityCmS:150,vencCmS:300}),positive=M.calculate({velocityCmS:150}),negative=M.calculate({velocityCmS:-150});
 near(alias.current.estimatedVelocityCmS,0);near(recover.current.estimatedVelocityCmS,150);near(positive.current.phase,Math.PI);near(negative.current.phase,Math.PI);assert.equal(positive.current.boundary,true);assert.equal(negative.current.boundary,true);
 near(negative.current.estimatedVelocityCmS,150);near(negative.current.aliasErrorCmS,-300);
 for(const k of ['real','imaginary'])near(positive.current[k],negative.current[k]);
 assert.throws(()=>M.calculate({vencCmS:0}),RangeError);
});
