'use strict';
// Independent centered-grid moment identities and closed geometric-series sum.
const n=401,width=40,fields={uniform:[30,0],linear:[0,2],mixed:[30,2]};
function coefficients(o){const[a,b]=fields[o.field];return{a,b,c:o.correction==='none'?0:a,d:o.correction==='linear'?b:0};}
function signal(a,b,timeMs){
 const t=timeMs*.001,halfStep=Math.PI*b*width*t/n,q=n*halfStep;
 const amplitude=Math.abs(halfStep)<1e-14?1:Math.sin(q)/(n*Math.sin(halfStep)),phase=-2*Math.PI*a*t,real=amplitude*Math.cos(phase),imaginary=amplitude*Math.sin(phase),magnitude=Math.hypot(real,imaginary);
 return{real,imaginary,magnitude,phase:magnitude<=1e-8?null:Math.atan2(imaginary,real)};
}
function odeAverage(a,b,timeMs,steps=512){
 let real=0,imaginary=0;const h=timeMs*.001/steps;
 for(let j=0;j<n;j++){
  const x=width*(2*j+1-n)/(2*n),omega=2*Math.PI*(a+b*x);let r=1,i=0;
  for(let k=0;k<steps;k++){
   const ar=omega*i,ai=-omega*r,br=omega*(i+h*ai/2),bi=-omega*(r+h*ar/2),cr=omega*(i+h*bi/2),ci=-omega*(r+h*br/2),dr=omega*(i+h*ci),di=-omega*(r+h*cr);
   r+=h*(ar+2*br+2*cr+dr)/6;i+=h*(ai+2*bi+2*ci+di)/6;
  }
  real+=r/n;imaginary+=i/n;
 }
 return{real,imaginary};
}
function calculate(o){
 const{a,b,c,d}=coefficients(o),rA=a-c,rB=b-d,sigmaX=width*Math.sqrt((n*n-1)/(12*n*n));
 const field=Array.from({length:n},(_,j)=>{const xMm=width*(2*j+1-n)/(2*n);return{xMm,beforeHz:a+b*xMm,correctionHz:c+d*xMm,afterHz:rA+rB*xMm};});
 const at=timeMs=>({timeMs,before:signal(a,b,timeMs),after:signal(rA,rB,timeMs)});
 return{options:o,field,fittedOffset:a,fittedSlope:b,correctionOffset:c,correctionSlope:d,beforeMeanHz:a,afterMeanHz:rA,beforeStdHz:Math.abs(b)*sigmaX,afterStdHz:Math.abs(rB)*sigmaX,current:at(o.teMs),curve:Array.from({length:121},(_,i)=>at(i/4))};
}
module.exports={calculate,signal,odeAverage,coefficients};
