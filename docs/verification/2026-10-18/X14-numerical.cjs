const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),M=require('../../assets/magic-angle-model.js'),R=require('../../../tests/helpers/magic-angle-reference.cjs');
const refs=[],max={signal:0,isotropicSignal:0,rate:0,time:0,factor:0,angle:0};
for(const angle of ['0','30','45','magic','70','90'])for(const teMs of [2,10,40]){
 const options={angle,teMs},a=M.calculate(options),b=R.calculate(options);max.angle=Math.max(max.angle,Math.abs(a.magicDeg-b.magicDeg));
 for(const [p,q]of [[a.current,b.current],[a.magicPoint,b.magicPoint],...a.angleCurve.map((p,j)=>[p,b.angleCurve[j]]),...a.timeCurve.map((p,j)=>[p,b.timeCurve[j]])]){
  max.signal=Math.max(max.signal,Math.abs(p.signal-q.signal));max.isotropicSignal=Math.max(max.isotropicSignal,Math.abs(p.isotropicSignal-q.isotropicSignal));max.rate=Math.max(max.rate,Math.abs(p.r2PerS-q.r2PerS));max.time=Math.max(max.time,Math.abs(p.t2Ms-q.t2Ms));max.factor=Math.max(max.factor,Math.abs(p.factor-q.factor),Math.abs(p.factorSquared-q.factorSquared));assert.ok(p.signal>=0&&p.signal<=p.isotropicSignal+1e-14);
 }
 refs.push(b);
}
for(const k of ['signal','isotropicSignal'])assert.ok(max[k]<1e-8);for(const k of ['rate','time','factor','angle'])assert.ok(max[k]<1e-9);
const result={date:'2026-10-18',cases:refs.length,anglePoints:18*181,timePoints:18*61,max,examples:[{}, {angle:'0'}, {angle:'90'}, {teMs:40}].map(o=>M.calculate(o).current)};
fs.writeFileSync(path.join(__dirname,'X14-numerical.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'X14-display-reference.json'),JSON.stringify(refs)+'\n');console.log(JSON.stringify(result));
