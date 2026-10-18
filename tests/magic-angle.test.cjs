'use strict';const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/magic-angle-model.js'),R=require('./helpers/magic-angle-reference.cjs');const near=(a,b,t=1e-8)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
test('defined angular R2 and shared transverse decay agree with independent projections and RK4',()=>{
 for(const angle of ['0','30','45','magic','70','90'])for(const teMs of [2,10,40]){const o={angle,teMs},a=M.calculate(o),b=R.calculate(o);near(a.magicDeg,b.magicDeg,1e-9);for(const [p,q]of [[a.current,b.current],...a.angleCurve.map((p,j)=>[p,b.angleCurve[j]]),...a.timeCurve.map((p,j)=>[p,b.timeCurve[j]])]){for(const k of ['factor','factorSquared','r2PerS','t2Ms'])near(p[k],q[k],1e-9);near(p.signal,q.signal);assert.ok(p.signal>=0&&p.signal<=1);}}
});
test('magic angle nulls only the anisotropic term and negative factor cannot give negative decay',()=>{
 const magic=M.calculate(),parallel=M.calculate({angle:'0'}),perp=M.calculate({angle:'90'}),long=M.calculate({teMs:40});near(magic.current.factor,0,1e-14);near(magic.current.r2PerS,50);near(magic.current.t2Ms,20);near(parallel.current.factor,2);near(parallel.current.r2PerS,850);near(perp.current.factor,-1);near(perp.current.r2PerS,250);
 assert.ok(parallel.current.signal<perp.current.signal&&perp.current.signal<magic.current.signal);assert.ok(long.current.signal<magic.current.signal);near(magic.current.signal,magic.isotropicSignal);assert.throws(()=>M.calculate({angle:'55'}),RangeError);
});
