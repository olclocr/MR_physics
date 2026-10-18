(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./t2-fit-model.js'):root.T2Fit,node?require('./temporal-window-model.js'):root.TemporalWindow);if(node)module.exports=api;else root.WindowLog=api;})(typeof globalThis!=='undefined'?globalThis:this,function(T,W){
 'use strict';const defaults=Object.freeze({teMs:30,windowSec:12,centerSec:10}),centers=Object.freeze([0,10,20]),cache=new Map(),nativeRate=30;
 const rate=t=>40*(W.instantaneous(t)-.05)/.25;
 function stats(rateAt,teMs,centerSec,windowSec,n=512){const startSec=centerSec-windowSec/2,endSec=centerSec+windowSec/2,te=teMs/1000,baseline=T.signal(teMs,1000/nativeRate,1),cuts=[startSec,...[0,20].filter(t=>t>startSec&&t<endSec),endSec];let meanRatio=0,meanRate=0;
  for(let j=1;j<cuts.length;j++){const a=cuts[j-1],b=cuts[j],h=(b-a)/n;let q=0,r=0;for(let k=0;k<=n;k++){const v=rateAt(a+k*h),weight=k===0||k===n?1:k%2?4:2;q+=weight*T.signal(teMs,1000/(nativeRate+v),1)/baseline;r+=weight*v;}meanRatio+=q*h/3/windowSec;meanRate+=r*h/3/windowSec;}
  const effectiveRate=-Math.log(meanRatio)/te;return{centerSec,startSec,endSec,instantRatio:T.signal(teMs,1000/(nativeRate+rateAt(centerSec)),1)/baseline,instantRate:rateAt(centerSec),meanRatio,meanRate,effectiveRate,gap:meanRate-effectiveRate};
 }
 function calculate(options={}){const o={...defaults,...options};if(![10,30,60].includes(o.teMs)||![2,6,12].includes(o.windowSec)||!centers.includes(o.centerSec))throw new RangeError('Unsupported window/log state');const key=o.teMs+'|'+o.windowSec;if(!cache.has(key))cache.set(key,Object.freeze(Array.from({length:121},(_,j)=>Object.freeze(stats(rate,o.teMs,j/4,o.windowSec)))));const curve=cache.get(key);return{options:o,nativeRate,baseline:T.signal(o.teMs,1000/nativeRate,1),curve,index:o.centerSec*4,current:curve[o.centerSec*4]};}
 return{defaults,centers,rate,stats,calculate};
});
