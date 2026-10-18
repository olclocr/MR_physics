'use strict';
// Independent symmetric-grid moments/projection identities; no product QR or MRPhysics.
const n=401,L=40,mu2=L*L*(1-1/(n*n))/12,mu4=L**4*(3-10/(n*n)+7/n**4)/240;
function coefficients(o){const c=o.curvatureHzMm2;return o.basis==='none'?[0,0,0]:o.basis==='constant'?[30+c*mu2,0,0]:o.basis==='linear'?[30+c*mu2,2,0]:[30,2,c];}
function multiply(a,b){return{real:a.real*b.real-a.imaginary*b.imaginary,imaginary:a.real*b.imaginary+a.imaginary*b.real};}
function phasor(phase){return{real:Math.cos(phase),imaginary:Math.sin(phase)};}
function signal(coeff,timeMs){
 // Quadratic phase advances with a linearly advancing phase difference.
 const[a,b,c]=coeff,h=L/n,x0=L*(1-n)/(2*n),k=-2*Math.PI*timeMs*.001,A=a+b*x0+c*x0*x0,B=h*(b+2*c*x0),C=c*h*h;
 let z=phasor(k*A),ratio=phasor(k*(B+C));const step=phasor(2*k*C);let real=0,imaginary=0;
 for(let j=0;j<n;j++){real+=z.real/n;imaginary+=z.imaginary/n;z=multiply(z,ratio);ratio=multiply(ratio,step);}
 const magnitude=Math.hypot(real,imaginary);return{real,imaginary,magnitude,phase:magnitude<=1e-8?null:Math.atan2(imaginary,real)};
}
function ode(coeff,timeMs,steps=1024){
 let real=0,imaginary=0;const h=timeMs*.001/steps,[a,b,c]=coeff;
 for(let j=0;j<n;j++){const x=L*(2*j+1-n)/(2*n),w=2*Math.PI*(a+b*x+c*x*x);let r=1,i=0;for(let k=0;k<steps;k++){const ar=w*i,ai=-w*r,br=w*(i+h*ai/2),bi=-w*(r+h*ar/2),cr=w*(i+h*bi/2),ci=-w*(r+h*br/2),dr=w*(i+h*ci),di=-w*(r+h*cr);r+=h*(ar+2*br+2*cr+dr)/6;i+=h*(ai+2*bi+2*ci+di)/6;}real+=r/n;imaginary+=i/n;}return{real,imaginary};
}
function calculate(o){const before=[30,2,o.curvatureHzMm2],correction=coefficients(o),after=before.map((v,i)=>v-correction[i]),mean=([a,b,c])=>a+c*mu2,std=([a,b,c])=>Math.sqrt(b*b*mu2+c*c*(mu4-mu2*mu2)),at=timeMs=>({timeMs,before:signal(before,timeMs),after:signal(after,timeMs)});
 return{coefficients:correction,before,after,beforeMeanHz:mean(before),afterMeanHz:mean(after),beforeStdHz:std(before),afterStdHz:std(after),field:Array.from({length:n},(_,j)=>{const xMm=L*(2*j+1-n)/(2*n),poly=q=>q[0]+q[1]*xMm+q[2]*xMm*xMm;return{xMm,beforeHz:poly(before),correctionHz:poly(correction),afterHz:poly(after)};}),current:at(o.teMs),curve:Array.from({length:121},(_,i)=>at(i/4))};}
module.exports={mu2,mu4,coefficients,signal,ode,calculate};
