const fs=require('node:fs'),M=require('../../assets/contrast-concentration-model.js');
const {reference}=require('../../../tests/helpers/contrast-concentration-reference.cjs');
const cases=[],max={signal:0,magnetization:0,ratio:0,rateAndTime:0,analyticAttenuation:0};
for(const concentrationMm of [0,.25,.5,1,2,4])for(const teMs of [2,8,16])for(const flipDeg of [5,15,30]){
  const options={concentrationMm,teMs,flipDeg},r=M.calculate(options),v=reference(options);
  for(let j=0;j<161;j++){
    for(const key of ['signal','t1Only'])max.signal=Math.max(max.signal,Math.abs(r.curve[j][key]-v.curve[j][key]));
    for(const key of ['beforeRF','afterRF'])max.magnetization=Math.max(max.magnetization,Math.abs(r.curve[j][key]-v.curve[j][key]));
    max.ratio=Math.max(max.ratio,Math.abs(r.curve[j].ratio-v.curve[j].ratio));
    for(const key of ['r1PerS','r2StarPerS','t1Ms','t2StarMs'])max.rateAndTime=Math.max(max.rateAndTime,Math.abs(r.curve[j][key]-v.curve[j][key]));
    max.analyticAttenuation=Math.max(max.analyticAttenuation,Math.abs(r.curve[j].signal/r.curve[j].t1Only-Math.exp(-20*r.curve[j].concentrationMm*teMs/1000)));
  }
  cases.push(v);
}
if(max.signal>1e-8||max.magnetization>1e-8||max.ratio>1e-8||max.rateAndTime>1e-9||max.analyticAttenuation>1e-12)throw Error(JSON.stringify(max));
const examples=[{},{concentrationMm:4},{concentrationMm:4,teMs:16},{flipDeg:5}].map(o=>{const r=M.calculate(o);return{options:r.options,current:r.current,baseline:r.baseline};});
fs.writeFileSync(__dirname+'/X05-numerical.json',JSON.stringify({date:'2026-10-17',cases:cases.length,curvePoints:cases.length*161,max,examples},null,2)+'\n');
fs.writeFileSync(__dirname+'/X05-display-reference.json',JSON.stringify(cases)+'\n');
console.log(JSON.stringify({cases:cases.length,max,examples:examples.map(p=>({options:p.options,signal:p.current.signal,t1Only:p.current.t1Only,baseline:p.baseline.signal,ratio:p.current.ratio}))}));
