const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),M=require('../../assets/temporal-window-model.js'),R=require('../../../tests/helpers/temporal-window-reference.cjs');
const refs=[],max={average:0,instantaneous:0,timeSec:0,overlap:0,convergence:0};let frameCount=0;
for(const windowSec of [2,6,12])for(const frameIntervalSec of [2,6]){
 const options={windowSec,frameIntervalSec,selectedTimeSec:10},a=M.calculate(options),b=R.calculate(options);frameCount+=b.frames.length;
 for(const [p,q]of [...a.frames.map((p,i)=>[p,b.frames[i]]),...a.curve.map((p,i)=>[p,b.curve[i]])]){max.average=Math.max(max.average,Math.abs(p.average-q.average));max.instantaneous=Math.max(max.instantaneous,Math.abs(p.instantaneous-q.instantaneous));for(const k of ['centerSec','startSec','endSec'])max.timeSec=Math.max(max.timeSec,Math.abs(p[k]-q[k]));const fine=R.at(q.centerSec,windowSec,1024);max.convergence=Math.max(max.convergence,Math.abs(fine.average-q.average));}
 max.overlap=Math.max(max.overlap,Math.abs(a.overlapFraction-b.overlapFraction));assert.equal(a.current.index,b.current.index);assert.equal(a.peak.index,b.peak.index);refs.push(b);
}
assert(max.average<1e-8&&max.instantaneous<1e-12&&max.timeSec<1e-12&&max.overlap<1e-12&&max.convergence<1e-8);
const examples=[M.calculate(),M.calculate({windowSec:12}),M.calculate({frameIntervalSec:6}),M.calculate({windowSec:12,selectedTimeSec:0})].map(r=>({options:r.options,current:r.current,peak:r.peak,overlapFraction:r.overlapFraction}));
const result={date:'2026-10-18',combinations:refs.length,frames:frameCount,curvePoints:refs.length*301,max,examples};fs.writeFileSync(path.join(__dirname,'X04-numerical.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'X04-display-reference.json'),JSON.stringify(refs)+'\n');console.log(JSON.stringify(result));
