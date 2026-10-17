const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/echo-train-model.js'),{reference}=require('./helpers/echo-train-reference.cjs');const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
test('all echo schedules and complex reconstructions match independently enumerated events and radix-2 FFT',()=>{
 for(const spacingMs of [5,10,15,20])for(const etl of [1,4,8,16])for(const ordering of ['linear','centric','reverse']){const o={spacingMs,etl,ordering},r=reference(o),a=M.calculate(o);near(a.effectiveTeMs,r.effectiveTeMs,1e-12);assert.equal(new Set(a.events.map(e=>e.k)).size,64);for(const e of a.events){const q=r.events.find(q=>q.k===e.k);assert.deepEqual(e,q);}for(let i=0;i<64;i++){near(a.pixels[i].real,r.pixels[i].real);near(a.pixels[i].imaginary,r.pixels[i].imaginary);near(a.pixels[i].magnitude,r.pixels[i].magnitude);}for(let shot=1;shot<=a.shots;shot++)assert.equal(a.events.filter(e=>e.shot===shot).length,etl);}
});
test('single-echo limit, central effective TE, refocusing times and changed peripheral weighting support the lesson',()=>{
 for(const ordering of ['linear','centric','reverse']){const a=M.calculate({etl:1,ordering});for(const p of a.pixels){near(p.magnitude,p.singleEcho);near(p.imaginary,0);}}
 for(const [ordering,expected]of [['linear',50],['centric',10],['reverse',80]])near(M.calculate({ordering}).effectiveTeMs,expected);
 const a=M.calculate({ordering:'centric',etl:8}),b=M.calculate({ordering:'centric',etl:16});near(a.effectiveTeMs,b.effectiveTeMs);assert.ok(a.pixels.some((p,i)=>Math.abs(p.magnitude-b.pixels[i].magnitude)>.01));for(const e of a.echoes){near(e.timeMs,e.echo*10);near(e.refocusMs,(e.echo-.5)*10);}
 for(const o of [{spacingMs:0},{etl:3},{ordering:'bad'}])assert.throws(()=>M.calculate(o),RangeError);
});
