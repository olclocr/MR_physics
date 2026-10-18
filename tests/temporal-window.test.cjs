'use strict';const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/temporal-window-model.js'),R=require('./helpers/temporal-window-reference.cjs');const near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
test('finite windows, all frames and time curves match independent event-split quadrature',()=>{
 for(const windowSec of [2,6,12])for(const frameIntervalSec of [2,6]){
  const o={windowSec,frameIntervalSec,selectedTimeSec:10},a=M.calculate(o),b=R.calculate(o);assert.equal(a.frames.length,b.frames.length);near(a.overlapFraction,b.overlapFraction);near(a.peak.average,b.peak.average);near(a.peak.centerSec,b.peak.centerSec);
  for(const [p,q]of [...a.frames.map((p,i)=>[p,b.frames[i]]),...a.curve.map((p,i)=>[p,b.curve[i]])])for(const k of ['centerSec','startSec','endSec','instantaneous','average'])near(p[k],q[k]);
  for(const frame of a.frames){const p=M.calculate({...o,selectedTimeSec:frame.centerSec}).current;assert.equal(p.index,frame.index);near(p.average,b.frames[frame.index].average);assert.ok(p.average>=.05-1e-14&&p.average<=.3+1e-14);}
 }
});
test('frame spacing changes samples while the averaging footprint remains distinct and handles baseline outside the pulse',()=>{
 const fast=M.calculate(),slow=M.calculate({frameIntervalSec:6}),wide=M.calculate({windowSec:12});
 near(fast.peak.centerSec,10);near(slow.peak.centerSec,12);assert.ok(fast.peak.average>slow.peak.average);assert.ok(wide.peak.average<fast.peak.average);near(wide.overlapFraction,5/6);near(M.calculate({selectedTimeSec:30}).current.average,.05);assert.ok(M.calculate({selectedTimeSec:0,windowSec:12}).current.average>.05);
 for(let i=0;i<fast.curve.length;i++)near(fast.curve[i].average,slow.curve[i].average);
 assert.equal(M.calculate({frameIntervalSec:6,selectedTimeSec:3}).current.centerSec,6);assert.throws(()=>M.calculate({windowSec:0}),RangeError);
});
