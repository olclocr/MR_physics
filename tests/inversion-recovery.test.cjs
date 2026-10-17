const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/inversion-recovery-model.js'),{reference,root}=require('./helpers/ir-reference.cjs');const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b} (${t})`);
test('IR formula and null agree with an independent chronological RK4 recovery, inversion and readout reset',()=>{
 for(const tr of [3500,6000,10000])for(const t1 of [300,1000,4000]){const expectedNull=root(tr,t1);near(M.nullTime(tr,t1),expectedNull,1e-6);for(const ti of [0,100,200,500,1000,2000,3000,expectedNull-.1,expectedNull,expectedNull+.1]){const actual=M.signedMz(ti,tr,t1),r=reference(ti,tr,t1);near(actual,r.mz);assert.ok(actual>=-1&&actual<=1);}
 }
});
test('long-TR limits, opposite signs with equal magnitude and finite-TR changes support null and magnitude lessons',()=>{
 for(const t1 of [300,1000,4000]){near(M.nullTime(1e6,t1),t1*Math.LN2);near(M.signedMz(t1*Math.LN2,1e6,t1),0);const tr=10000,tiMinus=-t1*Math.log((1+Math.exp(-tr/t1)+.5)/2),tiPlus=-t1*Math.log((1+Math.exp(-tr/t1)-.5)/2);if(tiPlus<tr){near(M.signedMz(tiMinus,tr,t1),-.5);near(M.signedMz(tiPlus,tr,t1),.5);}}
 assert.ok(M.signedMz(2000,10000,4000)<0);assert.ok(M.signedMz(2000,3500,4000)>0);assert.ok(M.nullTime(3500,4000)<M.nullTime(10000,4000));for(const o of [{tiMs:-1},{tiMs:6000},{trMs:0},{target:'none'}])assert.throws(()=>M.calculate(o),RangeError);
});
