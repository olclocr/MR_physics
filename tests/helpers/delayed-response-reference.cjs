'use strict';
function kernel(t,tau){if(t<0)return 0;const x=t/tau;return x*x*Math.exp(-x)/(2*tau);}
function simpson(f,a,b,n=1024){if(b<=a)return 0;const h=(b-a)/n;let sum=f(a)+f(b);for(let j=1;j<n;j++)sum+=(j%2?4:2)*f(a+j*h);return sum*h/3;}
function response(t,d,tau,n=1024){return simpson(s=>kernel(t-s,tau),2,Math.min(t,2+d),n);}
function ode(t,d,tau,steps=1024){let x=[0,0,0];const F=(v,u)=>[(u-v[0])/tau,(v[0]-v[1])/tau,(v[1]-v[2])/tau],next=(v,k,h)=>v.map((a,i)=>a+h*k[i]);for(const[a,b,u]of [[0,Math.min(t,2),0],[2,Math.min(t,2+d),1],[2+d,t,0]]){if(b<=a)continue;const h=(b-a)/steps;for(let j=0;j<steps;j++){const p=F(x,u),q=F(next(x,p,h/2),u),r=F(next(x,q,h/2),u),s=F(next(x,r,h),u);x=x.map((v,i)=>v+h*(p[i]+2*q[i]+2*r[i]+s[i])/6);}}return x[2];}
function peak(d,tau){let low=2+d,high=2+d+40*tau;for(let j=0;j<100;j++){const t=(low+high)/2,derivative=kernel(t-2,tau)-kernel(t-2-d,tau);if(derivative>0)low=t;else high=t;}const time=(low+high)/2;return{time,value:response(time,d,tau)};}
function calculate(o){const p=peak(o.durationSec,o.scaleSec),curve=Array.from({length:241},(_,j)=>{const timeSec=j/10;return{timeSec,input:timeSec>=2&&timeSec<2+o.durationSec?1:0,response:response(timeSec,o.durationSec,o.scaleSec)};});return{options:o,curve,kernelCurve:Array.from({length:121},(_,j)=>({timeSec:j/10,value:kernel(j/10,o.scaleSec)})),peakTimeSec:p.time,peakResponse:p.value,current:curve[Math.round(o.timeSec*10)]};}
module.exports={kernel,simpson,response,ode,peak,calculate};
