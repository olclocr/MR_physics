const {reference:gre}=require('./gre-reference.cjs'),cache=new Map();function response(tr,flip,t1){const key=tr+'/'+flip+'/'+t1;if(!cache.has(key))cache.set(key,gre(tr,flip,t1));return cache.get(key);}
function reference(o){const w=response(o.trMs,o.flipDeg,1000),f=response(o.trMs,o.flipDeg,300),rawWater=(1-o.fatDensityFraction)*w.signal,rawFat=o.fatDensityFraction*f.signal,cw=rawWater/w.mz,cf=rawFat/f.mz;return{rawWater,rawFat,waterMz:w.mz,fatMz:f.mz,rawFraction:rawFat/(rawWater+rawFat),correctedWater:cw,correctedFat:cf,correctedFraction:cf/(cw+cf)};}
module.exports={reference,response};
