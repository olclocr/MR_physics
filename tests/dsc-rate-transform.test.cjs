'use strict';const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/dsc-rate-transform-model.js'),R=require('./helpers/dsc-rate-transform-reference.cjs');const near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
test('signals and log-rate curves match independent second-based transverse ODE and baseline bias',()=>{
 for(const teMs of [10,30,60])for(const baselineFactor of [.8,1,1.2]){
  const o={teMs,baselineFactor,timeSec:10},a=M.calculate(o),b=R.calculate(o);near(a.trueBaseline,b.trueBaseline);near(a.inputBaseline,b.inputBaseline);
  for(const [i,p]of a.curve.entries()){const q=b.curve[i];for(const k of ['trueDeltaR2','signal','ratio'])near(p[k],q[k]);near(p.inferredDeltaR2,q.inferredDeltaR2,1e-6);near(p.bias,b.analyticBias,1e-10);assert.ok(p.signal>0&&p.ratio>0);}
  for(const timeSec of [0,5,10,15,20,30])near(M.calculate({...o,timeSec}).current.inferredDeltaR2,b.curve[timeSec*4].inferredDeltaR2,1e-6);
 }
});
test('correct baseline recovers TE-independent rate while mismatched baseline gives signed inverse-TE bias',()=>{
 const short=M.calculate({teMs:10}),long=M.calculate({teMs:60}),wrong=M.calculate({teMs:10,baselineFactor:.8,timeSec:0}),fixed=M.calculate({teMs:10,timeSec:0});near(short.current.inferredDeltaR2,40);near(long.current.inferredDeltaR2,40);assert.ok(long.current.ratio<short.current.ratio);assert.ok(wrong.current.inferredDeltaR2<0);near(wrong.current.inferredDeltaR2,Math.log(.8)/.01);near(fixed.current.inferredDeltaR2,0);near(M.calculate({teMs:30,baselineFactor:.8,timeSec:0}).current.bias,wrong.current.bias/3);
 assert.throws(()=>M.calculate({teMs:0}),RangeError);
});
