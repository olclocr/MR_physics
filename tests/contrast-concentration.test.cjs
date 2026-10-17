const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../docs/assets/contrast-concentration-model.js');
const {reference}=require('./helpers/contrast-concentration-reference.cjs');
test('Concentration GRE signal matches independent RF/recovery/spoiling iterations and transverse ODE across 54 states',()=>{
  for(const concentrationMm of [0,.25,.5,1,2,4])for(const teMs of [2,8,16])for(const flipDeg of [5,15,30]){
    const o={concentrationMm,teMs,flipDeg},r=M.calculate(o),v=reference(o);
    for(let j=0;j<161;j++)for(const key of ['beforeRF','afterRF','signal','t1Only','ratio'])assert.ok(Math.abs(r.curve[j][key]-v.curve[j][key])<1e-8,JSON.stringify({o,j,key}));
    for(const key of ['signal','t1Only','ratio'])assert.ok(Math.abs(r.current[key]-v.current[key])<1e-8);
  }
});
test('The extra transverse attenuation is isolated, with equal zero-concentration curves and a nonmonotonic counterexample',()=>{
  const r=M.calculate({teMs:16}),high=M.calculate({concentrationMm:4,teMs:16});
  assert.ok(high.current.t1Ms<r.current.t1Ms&&high.current.signal<r.current.signal);
  assert.ok(high.current.signal<high.baseline.signal);
  for(const p of r.curve){assert.ok(Math.abs(p.signal/p.t1Only-Math.exp(-20*p.concentrationMm*16/1000))<1e-12);}
  assert.equal(r.curve[0].signal,r.curve[0].t1Only);
  assert.ok(r.curve.every(p=>p.signal>=0&&p.signal<=.5&&p.t1Only<=.5));
  assert.throws(()=>M.calculate({teMs:20}),RangeError);
});
