const fs=require('node:fs'),M=require('../../assets/finite-slice-rf-model.js');
const {reference}=require('../../../tests/helpers/finite-slice-rf-reference.cjs');
const cases=[],max={vector:0,magnitude:0,norm:0,widthMm:0,areaFlipDeg:0,peakMicroT:0,referenceConvergence:0};
for(const durationMs of [2,4,8])for(const flipDeg of [30,90])for(const gradientMilliTPerM of [-10,-5,5,10]){
  const options={durationMs,flipDeg,gradientMilliTPerM},r=M.calculate(options),v=reference(options),fine=reference(options,16384);
  for(let j=0;j<201;j++){
    for(const key of ['x','y','z']){
      max.vector=Math.max(max.vector,Math.abs(r.profile[j][key]-v.profile[j][key]));
      max.referenceConvergence=Math.max(max.referenceConvergence,Math.abs(fine.profile[j][key]-v.profile[j][key]));
    }
    max.magnitude=Math.max(max.magnitude,Math.abs(r.profile[j].magnitude-v.profile[j].magnitude));
    max.norm=Math.max(max.norm,Math.abs(r.profile[j].norm-1));
  }
  max.widthMm=Math.max(max.widthMm,Math.abs(r.nominalThicknessMm-v.nominalThicknessMm));
  max.areaFlipDeg=Math.max(max.areaFlipDeg,Math.abs(r.areaFlipDeg-flipDeg));
  max.peakMicroT=Math.max(max.peakMicroT,Math.abs(r.peakB1MicroT-v.peakB1MicroT));
  const waveform=Array.from({length:257},(_,j)=>{const q=4*(j/256-.5),sinc=q===0?1:Math.sin(Math.PI*q)/(Math.PI*q);return{timeMs:j/256*durationMs,b1MicroT:v.peakB1MicroT*sinc};});
  cases.push({...v,waveform});
}
if(max.vector>2e-5||max.magnitude>2e-5||max.norm>1e-10||max.widthMm>1e-9||max.areaFlipDeg>1e-4||max.peakMicroT>1e-5||max.referenceConvergence>1e-7)throw Error(JSON.stringify(max));
const result={date:'2026-10-17',cases:cases.length,spatialPoints:cases.length*201,max,examples:[{},{durationMs:8},{gradientMilliTPerM:5},{flipDeg:30}].map(o=>{const r=M.calculate(o);return{options:r.options,peakB1MicroT:r.peakB1MicroT,areaFlipDeg:r.areaFlipDeg,nominalBandwidthHz:r.nominalBandwidthHz,nominalThicknessMm:r.nominalThicknessMm,center:r.center};})};
fs.writeFileSync(__dirname+'/G02-rf-numerical.json',JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(__dirname+'/G02-rf-display-reference.json',JSON.stringify(cases)+'\n');
console.log(JSON.stringify({cases:cases.length,max}));
