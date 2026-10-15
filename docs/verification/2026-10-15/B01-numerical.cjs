const fs=require('node:fs'),path=require('node:path'),M=require('../../assets/spin-ensemble-model.js');
const reference=require('./B01-reference.json');
const rows=reference.rows.map(r=>{
  const actual=M.equilibrium(r.b0,r.temperatureK);
  const errors=Object.fromEntries(['polarization','lower','upper','relativeM0'].map(k=>[k,Math.abs(actual[k]-Number(r[k]))]));
  return {b0:r.b0,temperatureK:r.temperatureK,actual,reference:r,errors};
});
const maxErrors=Object.fromEntries(['polarization','lower','upper','relativeM0'].map(k=>[k,Math.max(...rows.map(r=>r.errors[k]))]));
const phases=['distributed','aligned'].map(mode=>({mode,...M.phaseSum(mode)}));
const result={method:reference.method,maxErrors,rows,phases};
fs.writeFileSync(path.join(__dirname,'B01-numerical.json'),JSON.stringify(result,null,2)+'\n');console.log({maxErrors,phases:phases.map(x=>({mode:x.mode,magnitude:x.magnitude})),baseline:M.equilibrium(3,310)});
