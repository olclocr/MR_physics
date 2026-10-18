(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./diffusion-tensor-model.js'):root.DiffusionTensor,node?require('./adc-fit-model.js'):root.ADCFit);if(node)module.exports=api;else root.DiffusionMixture=api;})(typeof globalThis!=='undefined'?globalThis:this,function(Tensor,ADC){
 'use strict';const defaults=Object.freeze({separationDeg:90,fraction:.5,b:1000}),cache=new Map(),signalCache=new Map();
 function attenuation(adc,b){const key=adc.toPrecision(16)+'|'+b;if(!signalCache.has(key)){const r=ADC.calculate({diffusionMm2PerS:adc,t2Ms:80,sigma:0});signalCache.set(key,r.curve[b/5].signal/r.s0);}return signalCache.get(key);}
 function calculate(options={}){
  const o={...defaults,...options};if(![0,45,90].includes(o.separationDeg)||![0,.25,.5,.75,1].includes(o.fraction)||![0,500,1000].includes(o.b))throw new RangeError('Unsupported two-component diffusion state');const key=o.separationDeg+'|'+o.fraction+'|'+o.b;
  if(!cache.has(key)){const a=Tensor.calculate({shape:'prolate',rotationDeg:0,b:o.b}),b=Tensor.calculate({shape:'prolate',rotationDeg:o.separationDeg,b:o.b}),rows=a.angular.map((p,i)=>{const mixed=o.fraction*p.signal+(1-o.fraction)*b.angular[i].signal;return{thetaDeg:p.thetaDeg,componentA:p.signal,componentB:b.angular[i].signal,mixed,apparentAdc:o.b===0?null:-Math.log(mixed)/o.b};});let coefficients=null,rmsAdc=null,maxAbsAdc=null;
   if(o.b!==0){const unique=rows.slice(0,36);let mean=0,cos=0,sin=0;for(const p of unique){const phase=2*p.thetaDeg*Math.PI/180;mean+=p.apparentAdc/36;cos+=2*p.apparentAdc*Math.cos(phase)/36;sin+=2*p.apparentAdc*Math.sin(phase)/36;}coefficients=Object.freeze({xx:mean+cos,yy:mean-cos,xy:sin});for(const p of rows){const t=2*p.thetaDeg*Math.PI/180;p.fittedAdc=mean+cos*Math.cos(t)+sin*Math.sin(t);p.residualAdc=p.apparentAdc-p.fittedAdc;p.fittedSignal=attenuation(p.fittedAdc,o.b);}rmsAdc=Math.sqrt(rows.slice(0,36).reduce((sum,p)=>sum+p.residualAdc**2,0)/36);maxAbsAdc=Math.max(...rows.map(p=>Math.abs(p.residualAdc)));}
   else for(const p of rows){p.fittedAdc=null;p.residualAdc=null;p.fittedSignal=null;}
   cache.set(key,Object.freeze({rows:Object.freeze(rows.map(Object.freeze)),coefficients,rmsAdc,maxAbsAdc,componentMd:a.md,componentFa:a.fa}));
  }
  return{options:o,...cache.get(key)};
 }
 return{defaults,calculate};
});
