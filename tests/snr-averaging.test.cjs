const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/snr-averaging-model.js'),{magnitudeMoments,moments,correlation}=require('./helpers/noise-reference.cjs');
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b} (${t})`);
test('seeded independent quadratures and nested averages match predeclared five-standard-error statistical bounds',()=>{
 const pixels=65536;for(const seed of [0x51a7c0de,0x243f6a88,0x13579bdf]){
  const bank=M.createBank(pixels,16,seed);assert.ok(Math.abs(correlation(bank[0].re,bank[0].im))<5/Math.sqrt(pixels));assert.ok(Math.abs(correlation(bank[0].re,bank[1].re))<5/Math.sqrt(pixels));
  for(const nex of [1,4,16]){const a=M.averageNoise(bank,nex),sigma=.2/Math.sqrt(nex);for(const values of [a.re,a.im]){const r=moments([...values]);assert.ok(Math.abs(r.mean)<=5/Math.sqrt(nex*pixels));assert.ok(Math.abs(r.sd*Math.sqrt(nex)-1)<=5/Math.sqrt(2*(pixels-1)));}
   for(const signal of [0,.1,.6]){const values=[...a.re].map((v,i)=>Math.hypot(signal+.2*v,.2*a.im[i])),r=moments(values),ref=magnitudeMoments(signal,sigma);near(r.mean,ref.mean,5*Math.sqrt(ref.variance/pixels));const varianceSquared=4*sigma*sigma*(signal*signal+sigma*sigma);near(r.second,ref.second,5*Math.sqrt(varianceSquared/pixels));}
  }
 }
});
test('averaging precedes magnitude and fixed seed, zero noise, zero contrast and pixel layout retain their meaning',()=>{
 assert.deepEqual(M.createBank(12,2),M.createBank(12,2));const bank=[{re:new Float64Array(3072).fill(1),im:new Float64Array(3072)},{re:new Float64Array(3072).fill(-1),im:new Float64Array(3072)}],r=M.calculate({nex:2,sigma:1},bank);near(r.magnitude[0],0);near(M.calculate({nex:1,sigma:1},bank).magnitude[0],1);
 for(const nex of M.levels){const z=M.calculate({nex,sigma:0,contrast:0});assert.equal(z.snrA,null);assert.equal(z.cnr,null);near(z.roi.A.magnitude.mean,.6);near(z.roi.B.magnitude.mean,.6);near(z.roi.background.magnitude.mean,0);const a=M.calculate({nex,contrast:0});near(a.cnr,0);near(a.sigmaMean,.2/Math.sqrt(nex));assert.equal(a.roi.A.real.count,480);assert.equal(a.roi.background.real.count,2112);}
 for(const o of [{sigma:-1},{nex:3},{contrast:.7},{view:'imaginary'}])assert.throws(()=>M.calculate(o),RangeError);
});
