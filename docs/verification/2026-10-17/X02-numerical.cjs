const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),M=require('../../assets/inflow-rf-saturation-model.js'),R=require('../../../tests/helpers/inflow-rf-saturation-reference.cjs');
const refs=[],max={magnetization:0,signal:0,ratio:0,mean:0,count:0};
for(const velocityCmS of [0,5,10,20])for(const trMs of [10,20,40])for(const flipDeg of [10,30,60]){
 const o={velocityCmS,trMs,flipDeg},a=M.calculate(o),b=R.calculate(o);max.mean=Math.max(max.mean,Math.abs(a.meanSignal-b.meanSignal));
 for(let j=0;j<120;j++){const p=a.profile[j],q=b.profile[j];assert.equal(p.previousRF,q.previousRF);max.magnetization=Math.max(max.magnetization,Math.abs(p.beforeRF-q.beforeRF));max.signal=Math.max(max.signal,Math.abs(p.signal-q.signal));max.ratio=Math.max(max.ratio,Math.abs(p.ratioToStatic-q.ratioToStatic));assert.ok(p.signal>=0&&p.signal<=1&&p.beforeRF<=1);}
 refs.push(b);
}
for(const v of Object.values(max))assert.ok(v<1e-8);
const result={date:'2026-10-17',cases:refs.length,positions:refs.length*120,max,examples:[M.calculate(),M.calculate({velocityCmS:5}),M.calculate({flipDeg:60}),M.calculate({velocityCmS:0})].map(r=>({options:r.options,displacementMm:r.displacementMm,staticSignal:r.staticSignal,freshSignal:r.freshSignal,meanSignal:r.meanSignal,entrance:r.profile[0],exit:r.profile[119]}))};
fs.writeFileSync(path.join(__dirname,'X02-numerical.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'X02-display-reference.json'),JSON.stringify(refs)+'\n');console.log(JSON.stringify(result));
