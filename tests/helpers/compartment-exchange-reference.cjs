'use strict';
// Independent convolution quadrature and event-split two-state RK4 mass balance.
function convolution(k,v,t,n=1024){if(t===0||k===0)return 0;const end=Math.min(t,1),h=end/n,rate=k/v,f=s=>k*Math.exp(-rate*(t-s));let sum=f(0)+f(end);for(let j=1;j<n;j++)sum+=(j%2?4:2)*f(j*h);return sum*h/3;}
function ode(k,v,t,steps=1024){let c=0,left=0;const rate=k/v;for(const[a,b,plasma]of [[0,Math.min(t,1),1],[1,t,0]]){if(b<=a)continue;const h=(b-a)/steps,F=y=>({c:k*plasma-rate*y,left:rate*y});for(let j=0;j<steps;j++){const p=F(c),q=F(c+h*p.c/2),r=F(c+h*q.c/2),s=F(c+h*r.c);c+=h*(p.c+2*q.c+2*r.c+s.c)/6;left+=h*(p.left+2*q.left+2*r.left+s.left)/6;}}return{tissue:c,left};}
function at(k,v,t){const tissue=convolution(k,v,t),plasma=t<1?1:0,rate=k/v,entered=k*Math.min(t,1);return{timeMin:t,plasma,tissue,ees:tissue/v,influx:k*plasma,efflux:rate*tissue,entered,left:entered-tissue,netRate:k*plasma-rate*tissue};}
function calculate(o){const kepMin=o.ktransMin/o.ve;return{options:o,kepMin,halfLifeMin:kepMin===0?null:Math.log(2)/kepMin,peakTimeMin:o.ktransMin===0?null:1,peakTissue:convolution(o.ktransMin,o.ve,1),current:at(o.ktransMin,o.ve,o.timeMin),curve:Array.from({length:121},(_,j)=>at(o.ktransMin,o.ve,j/20))};}
module.exports={convolution,ode,at,calculate};
