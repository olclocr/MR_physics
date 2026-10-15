const fs=require('node:fs'),path=require('node:path');
const P=require('../../assets/mr-physics-models.js'),R=require('../../../tests/helpers/spin-reference.cjs');
const error=(a,b)=>Math.max(...['x','y','z'].map(k=>Math.abs(a[k]-b[k]))),rows=[];
for(const b1MicroT of [1,10,30])for(const offResHz of [-120,0,120])for(const angleDeg of [0,90,180,270,360])for(const [t1Ms,t2Ms] of [[200,20],[900,80],[2500,500]]) {
  const options={b1MicroT,offResHz,angleDeg,t1Ms,t2Ms},ref=R.finiteRF(options);
  const actual=P.hardPulse({x:0,y:0,z:1},{...options,durationMs:ref.durationMs});
  rows.push({kind:'RF',options,timeMs:ref.durationMs,actual,reference:ref.m,error:error(actual,ref.m)});
  for(const timeMs of [0,t2Ms,t1Ms,5000]) {
    const a=P.free(actual,timeMs,offResHz,t1Ms,t2Ms),b=R.free(actual,timeMs,offResHz,t1Ms,t2Ms);
    rows.push({kind:'free',options,timeMs,actual:a,reference:b,endToEndReference:R.free(ref.m,timeMs,offResHz,t1Ms,t2Ms),error:error(a,b)});
  }
}
for(const [trMs,teMs]of [[100,99],[500,15],[500,15.1],[3000,100],[5000,300]])for(const spreadHz of [0,35,100])for(const offResHz of [-120,0,35,120]) {
  const options={trMs,teMs,t1Ms:900,t2Ms:80,spreadHz,offResHz};
  for(const timeMs of [0,teMs/2-1e-8,teMs/2-.1,teMs/2,teMs,Math.min(trMs,teMs+1),trMs]) {
    const a=P.spinEcho(options,timeMs),b=R.echo(options,timeMs);
    rows.push({kind:'SE',options,timeMs,actual:a.m,reference:b.m,error:Math.max(error(a.m,b.m),...a.members.map((x,i)=>error(x.m,b.members[i].m)))});
  }
}
for(const b0 of [1.5,3])for(const fatFraction of [0,.4,.5,1])for(const offResHz of [-120,0,120]) {
  const options={b0,fatFraction,offResHz,trMs:120,t1Ms:900,t2Ms:70},shift=R.GAMMA*b0*3.5;
  for(const timeMs of [0,500/shift,1000/shift,1.1,2.2,2.3,4.5,4.6,120]) {
    const a=P.chemical(options,timeMs),b=R.chemical(options,timeMs);
    rows.push({kind:'chemical',options,timeMs,actual:a.m,reference:b.m,error:Math.max(error(a.m,b.m),...a.species.map((x,i)=>error(x.m,b.species[i].m)))});
  }
}
const summary=Object.fromEntries(['RF','free','SE','chemical'].map(kind=>[kind,{count:rows.filter(r=>r.kind===kind).length,maxError:Math.max(...rows.filter(r=>r.kind===kind).map(r=>r.error))}]));
const result={method:'Independent RK4 in ms; chronological z recovery and analytic complex phases without production imports',summary,rows};
const out=process.argv[2]||'B03-numerical.json';
fs.writeFileSync(path.resolve(__dirname,out),JSON.stringify(result,null,2)+'\n');console.log(summary);
