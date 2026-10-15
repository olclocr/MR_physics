(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory();else root.DephasingModel=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const defaults=Object.freeze({t2Ms:80,sigmaHz:10,teMs:40});
  function calculate(options={},timeMs=40){
    const o={...defaults,...options};
    if(!['t2Ms','sigmaHz','teMs'].every(k=>Number.isFinite(o[k]))||o.t2Ms<=0||o.sigmaHz<0||o.teMs<=0||!Number.isFinite(timeMs))throw new RangeError('Invalid dephasing parameters');
    const t=Math.max(0,Math.min(120,timeMs)),after=t>=o.teMs/2,seTime=after?t-o.teMs:t;
    const coherence=q=>Math.exp(-.5*(2*Math.PI*o.sigmaHz*q/1000)**2);
    const t2=Math.exp(-t/o.t2Ms),fidCoherence=coherence(t),seCoherence=coherence(seTime);
    return {timeMs:t,t2,fidCoherence,seCoherence,fid:t2*fidCoherence,se:t2*seCoherence,seTimeMs:seTime,afterRF:after};
  }
  function series(options={},steps=300){
    if(!Number.isInteger(steps)||steps<1||steps>10000)throw new RangeError('Invalid series length');
    return Array.from({length:steps+1},(_,i)=>calculate(options,120*i/steps));
  }
  return {defaults,calculate,series};
});
