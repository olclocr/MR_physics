'use strict';const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/linear-field-correction-model.js'),R=require('./helpers/linear-field-correction-reference.cjs');
const near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`),circle=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
test('field projection and coherent signals match independent grid moments, geometric sums and transverse ODE',()=>{
 for(const field of ['uniform','linear','mixed'])for(const correction of ['none','constant','linear'])for(const teMs of [0,5,12.5]){
  const o={field,correction,teMs},a=M.calculate(o),b=R.calculate(o);
  for(const k of ['fittedOffset','fittedSlope','correctionOffset','correctionSlope','beforeMeanHz','afterMeanHz','beforeStdHz','afterStdHz'])near(a[k],b[k],1e-9);
  for(const [i,p]of a.field.entries())for(const k of ['xMm','beforeHz','correctionHz','afterHz'])near(p[k],b.field[i][k],1e-9);
  for(const [i,p]of a.curve.entries())for(const side of ['before','after']){const q=b.curve[i][side];for(const k of ['real','imaginary','magnitude'])near(p[side][k],q[k]);assert.equal(p[side].phase===null,q.phase===null);if(q.phase!==null)assert.ok(circle(p[side].phase,q.phase)<1e-8);assert.ok(p[side].magnitude<=1+1e-12);}
  const{a:ca,b:cb,c,d}=R.coefficients(o);for(const [side,offset,slope]of [['before',ca,cb],['after',ca-c,cb-d]]){const ode=R.odeAverage(offset,slope,teMs);for(const k of ['real','imaginary'])near(a.current[side][k],ode[k]);}
 }
});
test('constant correction removes a shared phase but retains spread and null; linear correction recovers unit coherence',()=>{
 const raw=M.calculate(),constant=M.calculate({correction:'constant'}),linear=M.calculate({correction:'linear'}),zero=M.calculate({correction:'constant',teMs:12.5});
 near(constant.afterMeanHz,0);near(constant.afterStdHz,raw.beforeStdHz);near(constant.current.after.magnitude,raw.current.before.magnitude);near(constant.current.after.phase,0);near(linear.afterStdHz,0);near(linear.current.after.magnitude,1);near(zero.current.after.magnitude,0);assert.equal(zero.current.after.phase,null);
 for(const correction of ['constant','linear'])near(M.calculate({field:'uniform',correction}).current.after.magnitude,1);
 assert.throws(()=>M.calculate({correction:'quadratic'}),RangeError);
});
