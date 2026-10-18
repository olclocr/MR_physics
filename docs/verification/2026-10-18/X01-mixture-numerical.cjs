const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),M=require('../../assets/flow-mixture-model.js'),R=require('../../../tests/helpers/flow-mixture-reference.cjs');
const refs=[],max={velocityCmS:0,member:0,complex:0,magnitude:0,phaseCircular:0,scalarSum:0,meanPhase:0};let nullPhaseCases=0;
for(const speed of ['0','10','50','v90'])for(const positiveFraction of [0,.25,.5,.75,1])for(const lobeMs of [1,2,3]){
 const options={speed,positiveFraction,lobeMs},a=M.calculate(options),b=R.calculate(options);max.velocityCmS=Math.max(max.velocityCmS,Math.abs(a.velocityCmS-b.velocityCmS));for(const key of ['x','y'])max.member=Math.max(max.member,Math.abs(a.positive[key]-b.positive[key]),Math.abs(a.negative[key]-b.negative[key]));
 for(const [p,q]of [[a.current,b.current],...a.curve.map((p,j)=>[p,b.curve[j]])]){
  max.complex=Math.max(max.complex,Math.abs(p.real-q.real),Math.abs(p.imaginary-q.imaginary));max.magnitude=Math.max(max.magnitude,Math.abs(p.magnitude-q.magnitude));max.scalarSum=Math.max(max.scalarSum,Math.abs(p.scalarSum-q.scalarSum));max.meanPhase=Math.max(max.meanPhase,Math.abs(p.meanAccumulatedPhase-q.meanAccumulatedPhase));assert.equal(p.phase===null,q.phase===null);if(p.phase!==null)max.phaseCircular=Math.max(max.phaseCircular,Math.abs(Math.atan2(Math.sin(p.phase-q.phase),Math.cos(p.phase-q.phase))));assert.ok(p.magnitude<=p.scalarSum+1e-14);
 }
 if(a.current.phase===null)nullPhaseCases++;refs.push(b);
}
for(const [k,v]of Object.entries(max))assert.ok(v<(k==='phaseCircular'?1e-7:1e-8));
const result={date:'2026-10-18',cases:refs.length,fractionPoints:refs.length*101,nullPhaseCases,max,examples:[{}, {speed:'v90'}, {speed:'v90',positiveFraction:.75}, {speed:'v90',positiveFraction:1}, {speed:'v90',lobeMs:3}].map(o=>{const r=M.calculate(o);return{options:r.options,velocityCmS:r.velocityCmS,phaseRad:r.phaseRad,current:r.current};})};
fs.writeFileSync(path.join(__dirname,'X01-mixture-numerical.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'X01-mixture-display-reference.json'),JSON.stringify(refs)+'\n');console.log(JSON.stringify(result));
