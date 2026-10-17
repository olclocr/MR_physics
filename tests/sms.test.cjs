const test=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/sms-model.js'),{reference}=require('./helpers/sms-reference.cjs');
test('SMS independent spatial folding FFT/QR, transfer and conditioning across all UI combinations',()=>{
 for(const profile of ['uniform','spatial'])for(let angleDeg=0;angleDeg<=45;angleDeg++)for(const shift of [0,16])for(const calibrationDeg of [0,5]){const o={profile,angleDeg,shift,calibrationDeg},r=M.calculate(o),ref=reference(o);for(let c=0;c<2;c++)for(let j=0;j<32;j++){assert.ok(Math.hypot(r.raw[c][j].real-ref.raw[c][j].real,r.raw[c][j].imaginary-ref.raw[c][j].imaginary)<1e-10);assert.ok(Math.abs(r.mixed[c][j].real-ref.mixed[c][j])<1e-10);const x=r.estimate[c][j],y=ref.estimate[c][j];assert.equal(x===null,y===null);if(x)assert.ok(Math.hypot(x.real-y,x.imaginary)<1e-10);}
 for(let j=0;j<32;j++){const a=r.pairs[j],b=ref.pairs[j];if(Number.isFinite(a.g))assert.ok(Math.abs(a.g-b.g)<1e-8);else assert.equal(b.g,Infinity);if(a.transfer)for(let s=0;s<2;s++)for(let t=0;t<2;t++)assert.ok(Math.abs(a.transfer[s][t]-b.transfer[s][t])<1e-10);}if(r.residual!==null)assert.ok(r.residual<1e-10);if(calibrationDeg===0&&r.error!==null)assert.ok(r.error<1e-10);
 }
});
test('SMS shift conditions, rank loss, calibration leakage and ideal grouping limits',()=>{
 const a=M.calculate(),b=M.calculate({shift:16});assert.ok(b.rmsG<a.rmsG);for(const shift of [0,16]){assert.equal(M.calculate({angleDeg:45,profile:'uniform',shift}).solved,0);assert.ok(M.calculate({calibrationDeg:5,shift}).error>.01);}assert.ok(Math.abs(M.calculate({profile:'uniform'}).rmsG-M.calculate({profile:'uniform',shift:16}).rmsG)<1e-12);assert.equal(a.schedule.sequentialMs/a.schedule.smsMs,2);assert.throws(()=>M.calculate({shift:8}),RangeError);
});
