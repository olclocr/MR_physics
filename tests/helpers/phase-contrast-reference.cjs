'use strict';
// Independent SI worldline and transverse Bloch RK4 for two physical waveforms.
// Does not import product models or use their calculated moments/phases.
const fHz=42.57747892e6,gamma=2*Math.PI*fHz,tau=.002,cache=new Map();
function integrate(velocityCmS,vencCmS,commonPhaseDeg,polarity,steps=1024){
 const velocity=velocityCmS*.01,gradient=1/(4*fHz*(vencCmS*.01)*tau*tau),common=commonPhaseDeg*Math.PI/180;
 let state=[Math.cos(common),Math.sin(common),common,0,0],time=0;
 const deriv=(t,s,g)=>{const omega=gamma*g*(.001+velocity*t);return[omega*s[1],-omega*s[0],-omega,g,t*g];};
 const plus=(a,k,h)=>a.map((v,j)=>v+h*k[j]);
 for(const sign of [polarity,-polarity])for(let i=0;i<steps;i++){
  const dt=tau/steps,g=sign*gradient,a=deriv(time,state,g),b=deriv(time+dt/2,plus(state,a,dt/2),g),c=deriv(time+dt/2,plus(state,b,dt/2),g),d=deriv(time+dt,plus(state,c,dt),g);
  state=state.map((v,j)=>v+dt*(a[j]+2*b[j]+2*c[j]+d[j])/6);time+=dt;
 }
 return{x:state[0],y:state[1],phase:state[2],moment0:state[3],moment1:state[4],gradientTm:gradient};
}
function point(velocityCmS,vencCmS,commonPhaseDeg,steps=1024){
 const key=[velocityCmS,vencCmS,commonPhaseDeg,steps].join('|');if(cache.has(key))return cache.get(key);
 const a=integrate(velocityCmS,vencCmS,commonPhaseDeg,-1,steps),b=integrate(velocityCmS,vencCmS,commonPhaseDeg,1,steps);
 const real=b.x*a.x+b.y*a.y,imaginary=b.y*a.x-b.x*a.y;
 // Independent congruence interval (-VENC,VENC]; exact boundary ties go positive.
 const expectedVelocity=velocityCmS-2*vencCmS*Math.ceil(velocityCmS/(2*vencCmS)-.5-1e-13);
 const phase=expectedVelocity/vencCmS*Math.PI,phaseA=Math.atan2(a.y,a.x),phaseB=Math.atan2(b.y,b.x);
 const result={velocityCmS,a,b,phaseA,phaseB,real,imaginary,magnitude:Math.hypot(real,imaginary),phase,complexPhase:Math.atan2(imaginary,real),estimatedVelocityCmS:expectedVelocity,trueDeltaPhase:b.phase-a.phase,aliasErrorCmS:velocityCmS-expectedVelocity,boundary:Math.abs(Math.abs(expectedVelocity)-vencCmS)<1e-10};cache.set(key,result);return result;
}
function calculate(o){return{options:o,current:point(o.velocityCmS,o.vencCmS,o.commonPhaseDeg),curve:Array.from({length:121},(_,i)=>point(-300+5*i,o.vencCmS,o.commonPhaseDeg))};}
module.exports={calculate,point,integrate};
