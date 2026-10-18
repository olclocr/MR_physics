'use strict';const{test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/signed-subtraction-model.js'),R=require('./helpers/signed-subtraction-reference.cjs');const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
test('signed pixel differences and region integrals match independent subpixel and event quadrature',()=>{
 for(const enhancement of [0,.1,.3])for(const shiftMm of [-8,0,8])for(const alignment of ['none','known']){
  const o={enhancement,shiftMm,alignment},a=M.calculate(o),b=R.calculate(o);for(const [i,p]of a.pixels.entries())for(const k of ['xMm','before','shifted','selected','difference'])near(p[k],b.pixels[i][k],1e-12);for(const k of ['positiveArea','negativeArea','totalArea','roiMean','trueArea'])near(a[k],b[k]);near(a.totalArea,12*enhancement);if(alignment==='known')near(a.roiMean,enhancement);assert.ok(a.negativeArea<=0&&a.positiveArea>=0);
 }
});
test('pure translation gives positive and negative boundaries with zero net change, while exact known integer alignment preserves enhancement',()=>{
 const motion=M.calculate({enhancement:0,shiftMm:8}),mixed=M.calculate({enhancement:.3,shiftMm:8}),aligned=M.calculate({enhancement:.3,shiftMm:8,alignment:'known'});
 near(motion.positiveArea,2.4);near(motion.negativeArea,-2.4);near(motion.totalArea,0);near(motion.roiMean,-1/15);near(mixed.roiMean,1/30);near(mixed.totalArea,3.6);near(aligned.roiMean,.3);near(aligned.negativeArea,0);near(aligned.positiveArea,3.6);
 assert.throws(()=>M.calculate({shiftMm:1}),RangeError);
});
