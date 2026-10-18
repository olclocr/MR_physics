(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./t2-fit-model.js'):root.T2Fit,node?require('./temporal-window-model.js'):root.TemporalWindow);if(node)module.exports=api;else root.DSCRateTransform=api;})(typeof globalThis!=='undefined'?globalThis:this,function(T,W){
 'use strict';const defaults=Object.freeze({teMs:30,baselineFactor:1,timeSec:10}),nativeR2Star=30,cache=new Map();
 function calculate(options={}){
  const o={...defaults,...options};if(![10,30,60].includes(o.teMs)||![.8,1,1.2].includes(o.baselineFactor)||![0,5,10,15,20,30].includes(o.timeSec))throw new RangeError('Unsupported DSC rate transform state');
  const key=o.teMs+'|'+o.baselineFactor;if(!cache.has(key)){
   // Same scalar monoexponential helper as M03, with a defined effective R2*.
   const trueBaseline=T.signal(o.teMs,1000/nativeR2Star,1),inputBaseline=o.baselineFactor*trueBaseline;
   const curve=Array.from({length:121},(_,i)=>{
    const timeSec=i/4,shape=(W.instantaneous(timeSec)-.05)/.25,trueDeltaR2=40*shape,signal=T.signal(o.teMs,1000/(nativeR2Star+trueDeltaR2),1),ratio=signal/inputBaseline,inferredDeltaR2=-Math.log(ratio)/(o.teMs/1000);
    return Object.freeze({timeSec,trueDeltaR2,signal,ratio,inferredDeltaR2,bias:inferredDeltaR2-trueDeltaR2});
   });cache.set(key,Object.freeze({trueBaseline,inputBaseline,curve:Object.freeze(curve)}));
  }
  const base=cache.get(key);return{options:o,nativeR2Star,...base,current:base.curve[o.timeSec*4]};
 }
 return{defaults,nativeR2Star,calculate};
});
