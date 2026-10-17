'use strict';
const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/flow-gradient-phase-model.js'),R=require('./helpers/flow-gradient-phase-reference.cjs');
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b}`);
test('bipolar gradient moments and moving complex magnetization match independent SI Bloch trajectories',()=>{
  for(const velocityCmS of [-10,0,10])for(const lobeMs of [1,2,3])for(const polarity of [-1,1]){
    const o={velocityCmS,lobeMs,polarity},a=M.calculate(o),b=R.calculate(o);
    for(let j=0;j<=200;j++)for(const key of ['positionMm','phase','phaseStationary','phaseMotion','real','imaginary','magnitude'])near(a.curve[j][key],b.curve[j][key]);
    for(let j=0;j<=200;j++)for(const key of ['moment0','moment1'])near(a.curve[j][key],b.curve[j][key],1e-14);
  }
});
test('zero area refocuses stationary phase while first moment keeps velocity phase and unit magnitude',()=>{
  const base=M.calculate(),twice=M.calculate({lobeMs:1}),negative=M.calculate({velocityCmS:-10}),reverse=M.calculate({polarity:-1}),stationary=M.calculate({velocityCmS:0});
  near(base.end.moment0,0,1e-20);near(base.end.moment1,-8e-9,1e-20);near(base.end.phaseStationary,0);near(base.end.phase,4*twice.end.phase);near(base.end.phase,-negative.end.phase);near(base.end.phase,-reverse.end.phase);near(stationary.end.phase,0);
  for(const p of base.curve)near(p.magnitude,1,1e-14);
  near(base.end.phase,.214017751973588,1e-12);assert.throws(()=>M.calculate({velocityCmS:20}),RangeError);
});
