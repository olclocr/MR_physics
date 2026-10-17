'use strict';
const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/inflow-rf-saturation-model.js'),R=require('./helpers/inflow-rf-saturation-reference.cjs');const near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
test('slab RF histories match independent worldline event counts and Rodrigues/RK4 recovery',()=>{
 for(const velocityCmS of [0,5,10,20])for(const trMs of [10,20,40])for(const flipDeg of [10,30,60]){
  const o={velocityCmS,trMs,flipDeg},a=M.calculate(o),b=R.calculate(o);for(const k of ['staticBeforeRF','staticSignal','freshSignal','meanSignal'])near(a[k],b[k]);
  for(let j=0;j<120;j++){assert.equal(a.profile[j].previousRF,b.profile[j].previousRF);for(const k of ['beforeRF','signal','ratioToStatic'])near(a.profile[j][k],b.profile[j][k]);}
 }
});
test('fresh spins start at equilibrium, RF history lowers signal with depth, and no flow is steady state',()=>{
 const a=M.calculate(),slow=M.calculate({velocityCmS:5}),fast=M.calculate({velocityCmS:20}),stopped=M.calculate({velocityCmS:0}),large=M.calculate({flipDeg:60});
 near(a.profile[0].beforeRF,1);assert.equal(a.profile[0].previousRF,0);assert.equal(a.profile[119].previousRF,14);assert.equal(slow.profile[119].previousRF,29);assert.equal(fast.profile[119].previousRF,7);
 assert.ok(slow.profile[119].signal<a.profile[119].signal&&a.profile[119].signal<fast.profile[119].signal);
 for(let j=1;j<120;j++)assert.ok(a.profile[j].signal<=a.profile[j-1].signal+1e-14);
 for(const p of stopped.profile){assert.equal(p.previousRF,null);near(p.signal,stopped.staticSignal);near(p.ratioToStatic,1);}
 assert.ok(large.profile[119].beforeRF<a.profile[119].beforeRF);assert.throws(()=>M.calculate({velocityCmS:-5}),RangeError);
});
