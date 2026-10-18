'use strict';
// Independent scalar transverse ODE in seconds; no product exponential helper.
function decay(rate,teMs,steps=512){const h=teMs*.001/steps;let y=1;for(let j=0;j<steps;j++){const a=-rate*y,b=-rate*(y+h*a/2),c=-rate*(y+h*b/2),d=-rate*(y+h*c);y+=h*(a+2*b+2*c+d)/6;}return y;}
function calculate(o,steps=512){
 const trueBaseline=decay(30,o.teMs,steps),inputBaseline=o.baselineFactor*trueBaseline,curve=Array.from({length:121},(_,i)=>{
  const timeSec=i/4,trueDeltaR2=timeSec>0&&timeSec<20?20*(1-Math.cos(2*Math.PI*timeSec/20)):0,signal=decay(30+trueDeltaR2,o.teMs,steps),ratio=signal/inputBaseline,inferredDeltaR2=-Math.log(ratio)/(o.teMs*.001);return{timeSec,trueDeltaR2,signal,ratio,inferredDeltaR2,bias:inferredDeltaR2-trueDeltaR2};
 });return{options:o,trueBaseline,inputBaseline,curve,current:curve[o.timeSec*4],analyticBias:Math.log(o.baselineFactor)/(o.teMs*.001)};
}
module.exports={calculate,decay};
