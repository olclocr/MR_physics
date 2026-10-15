const fs=require('node:fs'),path=require('node:path'),M=require('../../assets/echo-comparison-model.js'),{reference}=require('../../../tests/helpers/echo-reference.cjs');
const rows=[];let maxComponentError=0,maxMemberError=0,maxMagnitudeError=0;
function collect(options,t) {
  const a=M.calculate(options,t),b=reference(options,t),componentError=Math.max(Math.abs(a.m.x-b.m.x),Math.abs(a.m.y-b.m.y)),magnitudeError=Math.abs(a.magnitude-b.magnitude);
  const memberError=Math.max(...a.members.flatMap((m,i)=>[Math.abs(m.m.x-b.members[i].m.x),Math.abs(m.m.y-b.members[i].m.y)]));
  maxComponentError=Math.max(maxComponentError,componentError);maxMemberError=Math.max(maxMemberError,memberError);maxMagnitudeError=Math.max(maxMagnitudeError,magnitudeError);
  rows.push({options,timeMs:t,actual:{m:a.m,magnitude:a.magnitude,physicalArea:a.physicalArea,effectiveArea:a.effectiveArea,gradientNullMs:a.gradientNullMs},reference:{m:b.m,magnitude:b.magnitude},componentError,magnitudeError,memberError});
}
for(const teMs of [10,40,80])for(const t2Ms of [20,80,200])for(const gradientHz of [0,20,40])for(const balance of [0,.6,1,2])for(const offResHz of [-80,0,80])for(const spreadHz of [0,35,60])for(const mode of ['se','gre']) {
  const o={mode,teMs,t2Ms,gradientHz,balance,offResHz,spreadHz};
  for(const t of [0,teMs/4,teMs/2-.1,teMs/2-1e-8,teMs/2,teMs,1.25*teMs,1.5*teMs])collect(o,t);
}
for(const mode of ['se','gre'])for(const timeMs of [0,19.9,20,40,60])collect({...M.defaults,mode,offResHz:35},timeMs);
const curves=[];
for(const options of [{...M.defaults},{...M.defaults,spreadHz:35},{...M.defaults,balance:.6},{...M.defaults,offResHz:35},
  {...M.defaults,teMs:80,t2Ms:20,gradientHz:40,balance:2,offResHz:80,spreadHz:60},{...M.defaults,gradientHz:0}]) {
  const a=M.series(options),values=a.map(x=>({timeMs:x.timeMs,se:reference({...options,mode:'se'},x.timeMs).magnitude,gre:reference({...options,mode:'gre'},x.timeMs).magnitude}));
  const error=Math.max(...a.flatMap((x,i)=>[Math.abs(x.se-values[i].se),Math.abs(x.gre-values[i].gre)]));curves.push({options,values,error});
}
const summary={rows:rows.length,maxComponentError,maxMemberError,maxMagnitudeError,curveConditions:curves.length,maxCurveError:Math.max(...curves.map(c=>c.error))};
fs.writeFileSync(path.join(__dirname,'C02-numerical.json'),JSON.stringify({method:'Analytic complex phases, independent of production free/rotate',summary,rows,curves})+'\n');console.log(summary);
