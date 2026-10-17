const fs=require('node:fs'),M=require('../../assets/complex-fat-fit-model.js');
const {reference}=require('../../../tests/helpers/complex-fat-fit-reference.cjs');
const cases=[],max={signal:0,basis:0,coefficient:0,fraction:0,objective:0,rmse:0,kktViolation:0};
for(const fatDensityFraction of [0,.3,.5,1])for(const fieldHz of [-60,0,60])for(const assumption of ['matched','single','common']){
  const o={fatDensityFraction,fieldHz,assumption},r=M.calculate(o),v=reference(o);
  for(let j=0;j<6;j++)for(const component of ['real','imaginary']){
    for(const key of ['data','predicted'])max.signal=Math.max(max.signal,Math.abs(r.rows[j][key][component]-v.rows[j][key][component]));
    for(const key of ['water','fat'])max.basis=Math.max(max.basis,Math.abs(r.columns[j][key][component]-v.rows[j].model[key][component]));
  }
  for(const key of ['water','fat','coefficientSum'])max.coefficient=Math.max(max.coefficient,Math.abs(r.estimate[key]-v.estimate[key]));
  max.fraction=Math.max(max.fraction,Math.abs(r.estimate.estimatedFraction-v.estimate.estimatedFraction));
  max.objective=Math.max(max.objective,Math.abs(r.estimate.objective-v.estimate.objective));
  max.rmse=Math.max(max.rmse,Math.abs(r.estimate.rmse-v.estimate.rmse));
  for(const key of ['water','fat']){
    const gradient=r.rows.reduce((sum,row,j)=>sum+2*((row.predicted.real-row.data.real)*r.columns[j][key].real+(row.predicted.imaginary-row.data.imaginary)*r.columns[j][key].imaginary),0);
    const violation=r.estimate[key]>1e-9?Math.abs(gradient):Math.max(0,-gradient);
    max.kktViolation=Math.max(max.kktViolation,violation);
  }
  cases.push(v);
}
if(max.signal>1e-8||max.basis>1e-8||max.coefficient>1e-8||max.fraction>1e-8||max.objective>1e-10||max.rmse>1e-8||max.kktViolation>1e-9)throw Error(JSON.stringify(max));
const examples=[{},{assumption:'single'},{assumption:'common'},{fatDensityFraction:0,assumption:'single'},{fatDensityFraction:1,assumption:'single'}].map(o=>{const r=M.calculate(o);return{options:r.options,estimate:r.estimate,bias:r.bias};});
fs.writeFileSync(__dirname+'/M04-fit-numerical.json',JSON.stringify({date:'2026-10-17',cases:cases.length,echoes:cases.length*6,max,examples},null,2)+'\n');
fs.writeFileSync(__dirname+'/M04-fit-display-reference.json',JSON.stringify(cases)+'\n');
console.log(JSON.stringify({cases:cases.length,max,examples:examples.map(p=>({options:p.options,water:p.estimate.water,fat:p.estimate.fat,fraction:p.estimate.estimatedFraction,rmse:p.estimate.rmse}))}));
