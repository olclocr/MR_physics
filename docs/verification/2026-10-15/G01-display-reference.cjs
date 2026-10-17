// Independent Dirichlet-kernel / real-space Simpson reference for rendered data.
const fs=require('node:fs'),path=require('node:path');
const {reference}=require('../../../tests/helpers/fov-reference.cjs');
const cases=[];
for(const fovMm of [160,200,240,280,320])for(const acquired of [16,32,64])for(const phantom of ['point','edge']){
 const o={fovMm,acquired,phantom},magnitude=x=>{const r=reference(o,x);return Math.hypot(r.real,r.imaginary);};
 cases.push({...o,dense:Array.from({length:501},(_,i)=>magnitude(-fovMm/2+fovMm*i/500)),fine:Array.from({length:acquired*4},(_,i)=>magnitude((i-acquired*2)*fovMm/(acquired*4)))});
}
fs.writeFileSync(path.join(__dirname,'G01-display-reference.json'),JSON.stringify({method:'closed finite kernel; edge: 4096-interval spatial Simpson convolution',cases}));
console.log('Independent display references:',cases.length,'acquisitions');
