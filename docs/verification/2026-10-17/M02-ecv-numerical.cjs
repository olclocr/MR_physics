const fs=require('node:fs'),M=require('../../assets/ecv-partition-model.js');
const {reference}=require('../../../tests/helpers/ecv-partition-reference.cjs');
const cases=[],max={r1:0,t1Ms:0,amount:0,fraction:0,curve:0};
for(const ecv of [.2,.3,.5])for(const plasmaMm of [0,.5,1,2])for(const analysisHct of [.25,.4,.55]){
  const options={ecv,plasmaMm,analysisHct},r=M.calculate(options),v=reference(options);
  for(let j=0;j<2;j++)for(const key of ['accessibleFraction','amountUmol','preR1','postR1','deltaR1','preT1Ms','postT1Ms']){
    const group=key.endsWith('Ms')?'t1Ms':key.endsWith('R1')?'r1':'amount';
    max[group]=Math.max(max[group],Math.abs(r.rows[j][key]-v.rows[j][key]));
  }
  for(const key of ['lambda','ecv']){
    if(v.estimate[key]===null){if(r.estimate[key]!==null)throw Error('Null lost');}
    else max.fraction=Math.max(max.fraction,Math.abs(r.estimate[key]-v.estimate[key]));
  }
  const curve=Array.from({length:41},(_,j)=>{
    const rr=reference({...options,plasmaMm:j/20});
    for(const [key,index]of [['deltaTissue',0],['deltaBlood',1]])max.curve=Math.max(max.curve,Math.abs(r.curve[j][key]-rr.rows[index].deltaR1));
    return{plasmaMm:j/20,deltaTissue:rr.rows[0].deltaR1,deltaBlood:rr.rows[1].deltaR1};
  });
  cases.push({...v,curve});
}
if(max.r1>1e-9||max.t1Ms>1e-6||max.amount>1e-9||max.fraction>1e-9||max.curve>1e-9)throw Error(JSON.stringify(max));
const result={date:'2026-10-17',cases:cases.length,curvePoints:cases.length*41,max,examples:[{},{plasmaMm:2},{analysisHct:.25},{plasmaMm:0}].map(o=>M.calculate(o))};
fs.writeFileSync(__dirname+'/M02-ecv-numerical.json',JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(__dirname+'/M02-ecv-display-reference.json',JSON.stringify(cases)+'\n');
console.log(JSON.stringify({cases:cases.length,max}));
