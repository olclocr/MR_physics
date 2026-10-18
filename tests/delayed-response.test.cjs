'use strict';const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/delayed-response-model.js'),R=require('./helpers/delayed-response-reference.cjs'),near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
test('defined gamma-kernel closed convolution matches independent quadrature and event-split three-stage ODE',()=>{
 for(const durationSec of [2,6])for(const scaleSec of [1,2])for(const timeSec of M.times){const o={durationSec,scaleSec,timeSec},a=M.calculate(o),r=R.calculate(o);near(a.peakTimeSec,r.peakTimeSec);near(a.peakResponse,r.peakResponse);for(const[i,p]of a.curve.entries()){near(p.response,r.curve[i].response);assert.equal(p.input,r.curve[i].input);assert.ok(p.response>=-1e-14&&p.response<=1+1e-14);}near(a.current.response,R.ode(timeSec,durationSec,scaleSec));}
});
test('causal response outlasts a defined stimulus, kernel area is one, and time-scale changes are not neural or BOLD estimates',()=>{
 const r=M.calculate(),slow=M.calculate({scaleSec:2});assert.equal(r.curve[10].response,0);assert.equal(r.curve[20].response,0);assert.equal(r.curve[40].input,0);assert.ok(r.curve[40].response>0);assert.ok(r.peakTimeSec>r.inputEndSec);assert.ok(slow.peakTimeSec>r.peakTimeSec);for(const tau of [1,2])near(R.simpson(t=>M.kernel(t,tau),0,100*tau,16384),1);assert.throws(()=>M.calculate({scaleSec:0}),RangeError);
});
