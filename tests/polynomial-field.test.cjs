'use strict';const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/polynomial-field-model.js'),R=require('./helpers/polynomial-field-reference.cjs'),near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
test('quadratic field QR projection and coherent signal match independent grid moments, phase recurrence and ODE',()=>{
 for(const curvatureHzMm2 of [0,.1,.2])for(const basis of ['none','constant','linear','quadratic'])for(const teMs of [0,5,12.5]){
  const o={curvatureHzMm2,basis,teMs},a=M.calculate(o),b=R.calculate(o);a.coefficients.forEach((v,i)=>near(v,b.coefficients[i],1e-9));for(const k of ['beforeMeanHz','afterMeanHz','beforeStdHz','afterStdHz'])near(a[k],b[k],1e-9);
  for(const[i,p]of a.field.entries())for(const k of ['xMm','beforeHz','correctionHz','afterHz'])near(p[k],b.field[i][k],1e-9);
  for(const[i,p]of a.curve.entries())for(const side of ['before','after']){for(const k of ['real','imaginary','magnitude'])near(p[side][k],b.curve[i][side][k]);assert.equal(p[side].phase===null,b.curve[i][side].phase===null);if(p[side].phase!==null)near(Math.atan2(Math.sin(p[side].phase-b.curve[i][side].phase),Math.cos(p[side].phase-b.curve[i][side].phase)),0);}
  for(const side of ['before','after']){const q=R.ode(b[side],teMs);near(a.current[side].real,q.real);near(a.current[side].imaginary,q.imaginary);}
 }
});
test('matching basis removes known curvature, linear fit retains curvature, and nested residual energy never increases',()=>{
 for(const c of [0,.1,.2]){let previous=Infinity;for(const basis of ['none','constant','linear','quadratic']){const r=M.calculate({curvatureHzMm2:c,basis}),energy=r.field.reduce((s,p)=>s+p.afterHz*p.afterHz,0)/M.n;assert.ok(energy<=previous+1e-9);previous=energy;if(basis==='quadratic'){near(r.afterStdHz,0);near(r.current.after.magnitude,1);}if(basis==='linear'&&c>0){assert.ok(r.afterStdHz>0);assert.ok(r.current.after.magnitude<1);near(r.afterMeanHz,0);}}}
 near(M.calculate({curvatureHzMm2:0,basis:'linear'}).current.after.magnitude,1);assert.throws(()=>M.calculate({basis:'cubic'}),RangeError);assert.throws(()=>M.calculate({curvatureHzMm2:-.1}),RangeError);
});
