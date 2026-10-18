'use strict';const fs=require('node:fs'),path=require('node:path'),M=require('../../assets/compartment-exchange-model.js'),R=require('../../../tests/helpers/compartment-exchange-reference.cjs');
const combinations=[],conditions=[],max={concentration:0,rate:0,cumulative:0,ode:0,odeConvergence:0,conservation:0,quadratureConvergence:0};
const add=(key,a,b)=>max[key]=Math.max(max[key],Math.abs(a-b));
for(const ktransMin of [0,.1,.2,.4])for(const ve of [.2,.4]){
 const reference=R.calculate({ktransMin,ve,timeMin:2}),combination=combinations.length;combinations.push({ktransMin,ve,reference});
 for(const timeMin of M.times){const options={ktransMin,ve,timeMin},a=M.calculate(options),b=R.calculate(options);for(const[i,p]of a.curve.entries()){for(const key of ['plasma','tissue','ees'])add('concentration',p[key],b.curve[i][key]);for(const key of ['influx','efflux','netRate'])add('rate',p[key],b.curve[i][key]);for(const key of ['entered','left'])add('cumulative',p[key],b.curve[i][key]);add('quadratureConvergence',R.convolution(ktransMin,ve,p.timeMin,1024),R.convolution(ktransMin,ve,p.timeMin,2048));}
  const coarse=R.ode(ktransMin,ve,timeMin,1024),fine=R.ode(ktransMin,ve,timeMin,2048);for(const key of ['tissue','left']){add('ode',a.current[key],fine[key]);add('odeConvergence',coarse[key],fine[key]);}add('conservation',fine.tissue+fine.left,a.current.entered);conditions.push({options,combination,...b});
 }
}
// Curves live once per parameter combination; per-condition records hold the selected values.
for(const c of conditions)delete c.curve;
const failed=Object.keys(max).filter(key=>max[key]>1e-8),result={conditions:conditions.length,combinations:combinations.length,curveComparisons:conditions.length*121,max,tolerance:1e-8,failed,passed:!failed.length};fs.writeFileSync(path.join(__dirname,'X07-numerical.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'X07-display-reference.json'),JSON.stringify({independent:'event-split ODE with integrated efflux and convolution quadrature',combinations,conditions})+'\n');console.log(JSON.stringify(result));if(failed.length)process.exitCode=1;
