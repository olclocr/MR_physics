const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),M=require('../../assets/phase-contrast-model.js'),R=require('../../../tests/helpers/phase-contrast-reference.cjs');
const refs=[],max={complex:0,circularPhase:0,velocityCmS:0,unwrappedPhase:0,moment:0,norm:0,referenceConvergence:0};
const circle=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
for(const velocityCmS of [-300,-150,-75,0,75,150,300])for(const vencCmS of [75,150,300])for(const commonPhaseDeg of [-120,0,120]){
 const options={velocityCmS,vencCmS,commonPhaseDeg},a=M.calculate(options),b=R.calculate(options);
 for(const [p,q]of [[a.current,b.current],...a.curve.map((p,i)=>[p,b.curve[i]])]){
  for(const s of ['a','b'])for(const k of ['x','y'])max.complex=Math.max(max.complex,Math.abs(p[s][k]-q[s][k]));
  for(const k of ['real','imaginary'])max.complex=Math.max(max.complex,Math.abs(p[k]-q[k]));
  for(const k of ['phaseA','phaseB','phase'])max.circularPhase=Math.max(max.circularPhase,circle(p[k],q[k]));
  max.circularPhase=Math.max(max.circularPhase,circle(p.phase,q.complexPhase));max.velocityCmS=Math.max(max.velocityCmS,Math.abs(p.estimatedVelocityCmS-q.estimatedVelocityCmS));max.unwrappedPhase=Math.max(max.unwrappedPhase,Math.abs(p.trueDeltaPhase-q.trueDeltaPhase));max.norm=Math.max(max.norm,Math.abs(p.magnitude-1));assert.equal(p.boundary,q.boundary);
 }
 max.moment=Math.max(max.moment,Math.abs(a.momentA-b.current.a.moment1),Math.abs(a.momentB-b.current.b.moment1),Math.abs(b.current.a.moment0),Math.abs(b.current.b.moment0));
 const fine=R.point(velocityCmS,vencCmS,commonPhaseDeg,2048);for(const s of ['a','b'])for(const k of ['x','y'])max.referenceConvergence=Math.max(max.referenceConvergence,Math.abs(b.current[s][k]-fine[s][k]));
 refs.push({...b,gradientTm:b.current.a.gradientTm,momentA:b.current.a.moment1,momentB:b.current.b.moment1,deltaMoment:b.current.b.moment1-b.current.a.moment1});
}
assert(max.complex<1e-8&&max.circularPhase<1e-8&&max.velocityCmS<1e-6&&max.unwrappedPhase<1e-8&&max.moment<1e-14&&max.norm<1e-12&&max.referenceConvergence<1e-8);
const examples=[M.calculate(),M.calculate({velocityCmS:150,vencCmS:75}),M.calculate({velocityCmS:150,vencCmS:300}),M.calculate({velocityCmS:-150})].map(r=>({options:r.options,gradientMtM:r.gradientTm*1000,deltaMomentMtMs2M:r.deltaMoment*1e9,current:r.current}));
const result={date:'2026-10-18',cases:refs.length,curvePoints:refs.length*121,max,examples};
fs.writeFileSync(path.join(__dirname,'X03-numerical.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'X03-display-reference.json'),JSON.stringify(refs)+'\n');console.log(JSON.stringify({cases:refs.length,curvePoints:refs.length*121,max,examples:examples.map(e=>({options:e.options,gradientMtM:e.gradientMtM,phase:e.current.phase,velocity:e.current.estimatedVelocityCmS,boundary:e.current.boundary}))}));
