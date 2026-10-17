const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const M=require('../../assets/flow-gradient-phase-model.js'),R=require('../../../tests/helpers/flow-gradient-phase-reference.cjs');
const refs=[],max={phase:0,complex:0,positionMm:0,moment0:0,moment1:0,norm:0,refConvergence:0};
for(const velocityCmS of [-10,0,10])for(const lobeMs of [1,2,3])for(const polarity of [-1,1]){
  const options={velocityCmS,lobeMs,polarity},a=M.calculate(options),b=R.calculate(options),fine=R.calculate(options,80);
  for(let j=0;j<=200;j++){
    const p=a.curve[j],q=b.curve[j];
    for(const k of ['phase','phaseStationary','phaseMotion'])max.phase=Math.max(max.phase,Math.abs(p[k]-q[k]));
    for(const k of ['real','imaginary']){max.complex=Math.max(max.complex,Math.abs(p[k]-q[k]));max.refConvergence=Math.max(max.refConvergence,Math.abs(fine.curve[j][k]-q[k]));}
    for(const k of ['positionMm','moment0','moment1'])max[k]=Math.max(max[k],Math.abs(p[k]-q[k]));max.norm=Math.max(max.norm,Math.abs(p.magnitude-1));
  }
  refs.push({...b,curve:b.curve.map((p,j)=>({...p,gradientMtM:j===200?0:(j<100?1:-1)*polarity*2,stationaryReal:Math.cos(p.phaseStationary),stationaryImaginary:Math.sin(p.phaseStationary)}))});
}
for(const k of ['phase','complex','positionMm'])assert.ok(max[k]<1e-8);for(const k of ['moment0','moment1'])assert.ok(max[k]<1e-14);assert.ok(max.norm<1e-14&&max.refConvergence<1e-9);
const result={date:'2026-10-17',cases:refs.length,points:refs.length*201,max,examples:[M.calculate().end,M.calculate({lobeMs:3}).end,M.calculate({velocityCmS:-10}).end,M.calculate({velocityCmS:0}).end]};
fs.writeFileSync(path.join(__dirname,'X01-numerical.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'X01-display-reference.json'),JSON.stringify(refs)+'\n');console.log(JSON.stringify(result));
