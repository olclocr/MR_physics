'use strict';const fs=require('node:fs'),path=require('node:path'),M=require('../../assets/polynomial-field-model.js'),R=require('../../../tests/helpers/polynomial-field-reference.cjs');
const max={coefficient:0,frequency:0,complex:0,magnitude:0,phase:0,ode:0,odeConvergence:0},combinations=[],conditions=[];let fieldPoints=0,curvePoints=0;
function error(key,a,b){max[key]=Math.max(max[key],Math.abs(a-b));}
for(const curvatureHzMm2 of [0,.1,.2])for(const basis of ['none','constant','linear','quadratic']){
 const ref=R.calculate({curvatureHzMm2,basis,teMs:5}),combination=combinations.length;combinations.push({curvatureHzMm2,basis,reference:ref});
 for(const teMs of [0,5,12.5]){
  const options={curvatureHzMm2,basis,teMs},a=M.calculate(options),b=R.calculate(options);a.coefficients.forEach((v,i)=>error('coefficient',v,b.coefficients[i]));for(const k of ['beforeMeanHz','afterMeanHz','beforeStdHz','afterStdHz'])error('frequency',a[k],b[k]);
  for(const[i,p]of a.field.entries()){for(const k of ['xMm','beforeHz','correctionHz','afterHz'])error('frequency',p[k],b.field[i][k]);fieldPoints++;}
  for(const[i,p]of a.curve.entries()){for(const side of ['before','after']){for(const k of ['real','imaginary'])error('complex',p[side][k],b.curve[i][side][k]);error('magnitude',p[side].magnitude,b.curve[i][side].magnitude);if((p[side].phase===null)!==(b.curve[i][side].phase===null))throw Error('Phase definition mismatch');if(p[side].phase!==null)error('phase',0,Math.atan2(Math.sin(p[side].phase-b.curve[i][side].phase),Math.cos(p[side].phase-b.curve[i][side].phase)));}curvePoints++;}
  for(const side of ['before','after']){const coarse=R.ode(b[side],teMs,1024),fine=R.ode(b[side],teMs,2048);for(const k of ['real','imaginary']){error('ode',a.current[side][k],fine[k]);error('odeConvergence',coarse[k],fine[k]);}}
  conditions.push({options,combination,current:b.current,coefficients:b.coefficients,beforeMeanHz:b.beforeMeanHz,afterMeanHz:b.afterMeanHz,beforeStdHz:b.beforeStdHz,afterStdHz:b.afterStdHz});
 }
}
const criteria={coefficient:1e-9,frequency:1e-9,complex:1e-8,magnitude:1e-8,phase:1e-8,ode:1e-8,odeConvergence:1e-8},failed=Object.entries(criteria).filter(([k,t])=>max[k]>t).map(([k])=>k),result={conditions:conditions.length,combinations:combinations.length,fieldPoints,curvePoints,max,criteria,failed,passed:!failed.length};
fs.writeFileSync(path.join(__dirname,'X15-basis-numerical.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'X15-basis-display-reference.json'),JSON.stringify({independent:'symmetric-grid moments, analytic projection coefficients and quadratic-phase recurrence; selected-time transverse ODE',combinations,conditions})+'\n');console.log(JSON.stringify(result));if(failed.length)process.exitCode=1;
