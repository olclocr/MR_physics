'use strict';
// Independent meter/second trajectory and scalar recovery ODE; no shared product calls.
function ode(t1Ms,timeSec,steps=1024){const h=timeSec/steps,T=t1Ms*.001;let label=-1;for(let j=0;j<steps;j++){const F=z=>(1-z)/T,a=F(label),b=F(label+h*a/2),c=F(label+h*b/2),d=F(label+h*c);label+=h*(a+2*b+2*c+d)/6;}return{control:1,label,remaining:(1-label)/2};}
function calculate(o){const speedMetersSec=o.velocityCmS*.01,arrivalSec=.2/speedMetersSec,curve=Array.from({length:61},(_,j)=>{const timeSec=j*.05,remaining=Math.exp(-timeSec/(o.t1Ms*.001)),arrived=timeSec>=arrivalSec-1e-14;return{timeSec,control:1,label:1-2*remaining,remaining,arrived,positionCm:100*Math.min(.2,speedMetersSec*timeSec),observed:arrived?remaining:0};});return{options:o,arrivalSec,curve,current:curve[Math.round(o.delaySec/.05)]};}
module.exports={ode,calculate};
