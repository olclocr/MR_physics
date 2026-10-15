/* Independent non-interacting proton spin-1/2 Zeeman levels at thermal equilibrium.
 * Polarization P is dimensionless. Phasor R is a separate geometric teaching model. */
(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./mr-physics-models.js'));
  else root.SpinEnsemble=factory(root.MRPhysics);
})(typeof globalThis!=='undefined'?globalThis:this,function(base){
  'use strict';
  const H=6.62607015e-34,K=1.380649e-23,GAMMA=base.GAMMA_HZ_PER_UT*1e6;
  const referenceP=Math.tanh(H*(GAMMA*3)/(2*K*310));
  function equilibrium(b0,temperatureK) {
    if(!Number.isFinite(b0)||b0<0||!Number.isFinite(temperatureK)||temperatureK<=0)throw new RangeError('Finite B0 >= 0 T and T > 0 K required');
    const frequencyHz=GAMMA*b0,gapJ=H*frequencyHz,x=gapJ/(2*K*temperatureK),polarization=Math.tanh(x);
    return {b0,temperatureK,frequencyHz,gapJ,x,polarization,ppm:polarization*1e6,
      lower:(1+polarization)/2,upper:(1-polarization)/2,
      ratio:Math.exp(2*x),relativeM0:polarization/referenceP,approxP:x,
      lowerPerMillion:(1+polarization)*5e5,upperPerMillion:(1-polarization)*5e5};
  }
  function populationDisplay(polarization,magnified) {
    const scale=magnified?10000:1,displayP=polarization*scale;
    return {scale,displayP,lowerPercent:50*(1+displayP),upperPercent:50*(1-displayP)};
  }
  function phaseSum(mode,count=16) {
    if(!['distributed','aligned'].includes(mode)||!Number.isInteger(count)||count<2||count>256)throw new RangeError('Valid phase mode and count required');
    const vectors=Array.from({length:count},(_,i)=>{
      const phase=mode==='aligned'?0:2*Math.PI*i/count;return {phase,x:Math.cos(phase),y:Math.sin(phase)};
    });
    const average=vectors.reduce((a,b)=>({x:a.x+b.x/count,y:a.y+b.y/count}),{x:0,y:0});
    return {vectors,average,magnitude:Math.hypot(average.x,average.y)};
  }
  return {H,K,GAMMA,referenceP,equilibrium,populationDisplay,phaseSum};
});
