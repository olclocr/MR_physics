'use strict';const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/flow-mixture-model.js'),R=require('./helpers/flow-mixture-reference.cjs');const near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`),phaseDiff=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
test('two velocity components and fraction curves match independent SI Bloch trajectories',()=>{
 for(const speed of ['0','10','50','v90'])for(const positiveFraction of [0,.25,.5,.75,1])for(const lobeMs of [1,2,3]){
  const o={speed,positiveFraction,lobeMs},a=M.calculate(o),b=R.calculate(o);near(a.velocityCmS,b.velocityCmS);near(a.phaseRad,b.phaseRad);for(const key of ['x','y']){near(a.positive[key],b.positive[key]);near(a.negative[key],b.negative[key]);}
  for(const [p,q]of [[a.current,b.current],...a.curve.map((p,j)=>[p,b.curve[j]])]){for(const k of ['real','imaginary','magnitude','scalarSum','meanVelocityCmS','meanAccumulatedPhase'])near(p[k],q[k]);assert.equal(p.phase===null,q.phase===null);if(p.phase!==null)assert.ok(phaseDiff(p.phase,q.phase)<1e-7);assert.ok(p.magnitude<=p.scalarSum+1e-14);}
 }
});
test('opposed equal populations cancel with undefined phase while a single population preserves unit magnitude',()=>{
 const cancel=M.calculate({speed:'v90'}),unequal=M.calculate({speed:'v90',positiveFraction:.75}),single=M.calculate({speed:'v90',positiveFraction:1}),returned=M.calculate({speed:'v90',lobeMs:3});
 near(cancel.phaseRad,Math.PI/2);near(cancel.current.magnitude,0);assert.equal(cancel.current.phase,null);near(cancel.current.scalarSum,1);near(cancel.current.meanVelocityCmS,0);
 near(unequal.current.magnitude,.5);near(unequal.current.phase,Math.PI/2);near(single.current.magnitude,1);near(returned.current.magnitude,Math.cos(Math.PI/8));near(returned.current.phase,Math.PI);near(returned.current.meanAccumulatedPhase,0);
 for(const p of M.calculate({speed:'0'}).curve)near(p.magnitude,1);
 assert.throws(()=>M.calculate({speed:'100'}),RangeError);
});
