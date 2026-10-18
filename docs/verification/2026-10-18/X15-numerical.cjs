const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),M=require('../../assets/linear-field-correction-model.js'),R=require('../../../tests/helpers/linear-field-correction-reference.cjs');
const refs=[],max={fieldHz:0,positionMm:0,coefficients:0,statistics:0,complex:0,magnitude:0,circularPhase:0,ode:0,odeConvergence:0};const circle=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
for(const field of ['uniform','linear','mixed'])for(const correction of ['none','constant','linear'])for(const teMs of [0,5,12.5]){
 const options={field,correction,teMs},a=M.calculate(options),b=R.calculate(options);
 for(const k of ['fittedOffset','fittedSlope','correctionOffset','correctionSlope'])max.coefficients=Math.max(max.coefficients,Math.abs(a[k]-b[k]));for(const k of ['beforeMeanHz','afterMeanHz','beforeStdHz','afterStdHz'])max.statistics=Math.max(max.statistics,Math.abs(a[k]-b[k]));
 for(let i=0;i<a.field.length;i++)for(const k of ['xMm','beforeHz','correctionHz','afterHz']){const target=k==='xMm'?'positionMm':'fieldHz';max[target]=Math.max(max[target],Math.abs(a.field[i][k]-b.field[i][k]));}
 for(let i=0;i<a.curve.length;i++)for(const side of ['before','after']){const p=a.curve[i][side],q=b.curve[i][side];for(const k of ['real','imaginary'])max.complex=Math.max(max.complex,Math.abs(p[k]-q[k]));max.magnitude=Math.max(max.magnitude,Math.abs(p.magnitude-q.magnitude));assert.equal(p.phase===null,q.phase===null);if(q.phase!==null)max.circularPhase=Math.max(max.circularPhase,circle(p.phase,q.phase));}
 const{a:ca,b:cb,c,d}=R.coefficients(options);for(const [side,offset,slope]of [['before',ca,cb],['after',ca-c,cb-d]]){const ode=R.odeAverage(offset,slope,teMs),fine=R.odeAverage(offset,slope,teMs,1024);for(const k of ['real','imaginary']){max.ode=Math.max(max.ode,Math.abs(a.current[side][k]-ode[k]));max.odeConvergence=Math.max(max.odeConvergence,Math.abs(ode[k]-fine[k]));}}
 refs.push(b);
}
for(const k of ['fieldHz','positionMm','coefficients','statistics'])assert(max[k]<1e-9);for(const k of ['complex','magnitude','circularPhase','ode','odeConvergence'])assert(max[k]<1e-8);
const examples=[M.calculate(),M.calculate({correction:'constant'}),M.calculate({correction:'linear'}),M.calculate({correction:'constant',teMs:12.5})].map(r=>({options:r.options,beforeMeanHz:r.beforeMeanHz,afterMeanHz:r.afterMeanHz,beforeStdHz:r.beforeStdHz,afterStdHz:r.afterStdHz,current:r.current}));
const result={date:'2026-10-18',cases:refs.length,spatialPoints:refs.length*401,timePoints:refs.length*121,max,examples};
fs.writeFileSync(path.join(__dirname,'X15-numerical.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'X15-display-reference.json'),JSON.stringify(refs)+'\n');console.log(JSON.stringify(result));
