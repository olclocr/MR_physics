const {test}=require('node:test'),assert=require('node:assert/strict'),M=require('../docs/assets/fov-resolution-model.js'),{reference}=require('./helpers/fov-reference.cjs');
const near=(a,b,e=1e-9)=>assert.ok(Math.abs(a-b)<=e,`${a} != ${b}`);
test('FOV, sample spacing, acquired bins and display grids have consistent physical units',()=>{
 for(const fovMm of [160,240,320])for(const acquired of [16,32,64])for(const reconFactor of [1,2,4]){const a=M.calculate({fovMm,acquired,reconFactor});assert.equal(a.profile.length,acquired*reconFactor);assert.equal(a.coefficients.length,acquired);near(a.geometry.acquiredPixelMm*acquired,fovMm,1e-12);near(a.geometry.displayPixelMm*a.profile.length,fovMm,1e-12);near(a.geometry.deltaKPerM*fovMm/1000,1,1e-12);near(a.geometry.bandwidthPerMm*a.geometry.acquiredPixelMm,1,1e-12);a.coefficients.slice(1).forEach((v,i)=>near(v.kPerMm-a.coefficients[i].kPerMm,1/fovMm,1e-12));}
});
test('point and edge Fourier profiles match an independent finite kernel and spatial convolution',()=>{
 for(const fovMm of [160,240,320])for(const acquired of [16,32,64])for(const phantom of ['point','edge'])for(const xMm of [-fovMm/2,-30,-15,-4,0,4,15,30,fovMm/2]){const o={fovMm,acquired,phantom},a=M.at(o,xMm),r=reference(o,xMm);near(a.real,r.real);near(a.imaginary,r.imaginary);}
});
test('more reconstruction pixels preserve acquired information and the same point-response first zeros',()=>{
 for(const fovMm of [160,240,320])for(const acquired of [16,32,64])for(const phantom of ['point','edge']){const o={fovMm,acquired,phantom},a=M.calculate(o),b=M.calculate({...o,reconFactor:4});a.profile.forEach((v,i)=>{near(v.real,b.profile[i*4].real,1e-12);near(v.imaginary,b.profile[i*4].imaginary,1e-12);});assert.deepEqual(a.coefficients,b.coefficients);}
 for(const acquired of [16,32,64]){near(M.at({acquired},0).magnitude,1);for(const sign of [-1,1])near(M.at({acquired},sign*240/acquired).magnitude,0);}
 for(const o of [{fovMm:0},{acquired:15},{reconFactor:3},{phantom:'x'}])assert.throws(()=>M.calculate(o),RangeError);
});
