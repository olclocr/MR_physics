const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/slice-selection-model.js'),{reference}=require('./helpers/slice-reference.cjs');
const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b} (${t})`);
test('slice geometry follows independently inverted SI frequencies and spatial quadrature at every allowed setting',()=>{
 for(let bandwidthHz=500;bandwidthHz<=4000;bandwidthHz+=500)for(let gradientMilliTPerM=2;gradientMilliTPerM<=10;gradientMilliTPerM+=2)for(let offsetHz=-2000;offsetHz<=2000;offsetHz+=100)for(const polarity of [-1,1]){
  const o={bandwidthHz,gradientMilliTPerM,offsetHz,polarity},a=M.calculate(o),r=reference(o);
  for(const k of ['lowMm','highMm','centerMm','thicknessMm'])near(a[k],r[k]);for(const k of ['fractionA','fractionB','meanSignal'])near(a[k],r[k],2/20000);near(a.integratedSignal,r.integratedSignal,2*a.thicknessMm/20000);
  const f=[M.frequencyAt(o,a.lowMm),M.frequencyAt(o,a.highMm)].sort((x,y)=>x-y);near(f[0],offsetHz-bandwidthHz/2);near(f[1],offsetHz+bandwidthHz/2);
 }
});
test('slice polarity, thickness scaling, pure compartments and centered boundary distinguish average from integrated signal',()=>{
 const o={bandwidthHz:2000,gradientMilliTPerM:10,offsetHz:500,polarity:1},a=M.calculate(o),b=M.calculate({...o,polarity:-1}),c=M.calculate({...o,bandwidthHz:1000});near(a.thicknessMm,b.thicknessMm);near(a.centerMm,-b.centerMm);near(a.fractionA,b.fractionB);near(c.thicknessMm,a.thicknessMm/2);
 const wide=M.calculate({...o,offsetHz:0}),thin=M.calculate({...o,offsetHz:0,bandwidthHz:1000});near(wide.fractionA,.5);near(thin.fractionA,.5);near(thin.meanSignal,.65);near(thin.integratedSignal,wide.integratedSignal/2);
 for(const offsetHz of [-2000,2000]){const r=M.calculate({...o,offsetHz,bandwidthHz:500});near(r.meanSignal,offsetHz<0?1:.3);near(r.fractionA,offsetHz<0?1:0);}
 for(const o of [{bandwidthHz:0},{gradientMilliTPerM:0},{offsetHz:NaN},{polarity:0}])assert.throws(()=>M.calculate(o),RangeError);
});
