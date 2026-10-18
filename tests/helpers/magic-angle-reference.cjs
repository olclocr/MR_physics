'use strict';
const cache=new Map(),magicDeg=Math.atan(Math.sqrt(2))*180/Math.PI;
function at(angleDeg,teMs){
 const key=angleDeg+'|'+teMs;if(cache.has(key))return cache.get(key);
 // Obtain a unit axis from its slope; contrast two parallel projections against
 // one perpendicular projection rather than using the product cos expression.
 const slope=Math.tan(angleDeg*Math.PI/180),norm=Math.hypot(slope,1),nx=slope/norm,nz=1/norm;
 const factor=2*nz*nz-nx*nx,r2PerS=50+200*factor*factor,t2Ms=1000/r2PerS,duration=teMs*.001,steps=Math.max(1,Math.ceil(duration*r2PerS*200)),h=duration/steps;
 let signal=1,isotropicSignal=1;
 const step=(s,rate)=>{const a=-rate*s,b=-rate*(s+h*a/2),c=-rate*(s+h*b/2),d=-rate*(s+h*c);return s+h*(a+2*b+2*c+d)/6;};
 for(let j=0;j<steps;j++){signal=step(signal,r2PerS);isotropicSignal=step(isotropicSignal,50);}
 const result={angleDeg,teMs,factor,factorSquared:factor*factor,r2PerS,t2Ms,signal,isotropicSignal};cache.set(key,result);return result;
}
function calculate(o){const angleDeg=o.angle==='magic'?magicDeg:Number(o.angle);return{options:o,magicDeg,current:at(angleDeg,o.teMs),magicPoint:at(magicDeg,o.teMs),angleCurve:Array.from({length:181},(_,j)=>at(j/2,o.teMs)),timeCurve:Array.from({length:61},(_,j)=>at(angleDeg,j))};}
module.exports={calculate,magicDeg};
