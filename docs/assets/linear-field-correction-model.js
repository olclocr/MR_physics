(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./mr-physics-models.js'):root.MRPhysics);if(node)module.exports=api;else root.LinearFieldCorrection=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P){
 'use strict';const defaults=Object.freeze({field:'mixed',correction:'none',teMs:5}),widthMm=40,n=401,cache=new Map();
 const fields=Object.freeze({uniform:Object.freeze({offsetHz:30,slopeHzMm:0}),linear:Object.freeze({offsetHz:0,slopeHzMm:2}),mixed:Object.freeze({offsetHz:30,slopeHzMm:2})});
 function calculate(options={}){
  const o={...defaults,...options};if(!Object.hasOwn(fields,o.field)||!['none','constant','linear'].includes(o.correction)||![0,5,12.5].includes(o.teMs))throw new RangeError('Unsupported linear field correction state');
  const key=o.field+'|'+o.correction;if(!cache.has(key)){
   const f=fields[o.field],points=Array.from({length:n},(_,j)=>{const xMm=-widthMm/2+(j+.5)*widthMm/n;return{xMm,beforeHz:f.offsetHz+f.slopeHzMm*xMm};});
   const meanX=points.reduce((s,p)=>s+p.xMm,0)/n,meanF=points.reduce((s,p)=>s+p.beforeHz,0)/n,xx=points.reduce((s,p)=>s+(p.xMm-meanX)**2,0),xf=points.reduce((s,p)=>s+(p.xMm-meanX)*(p.beforeHz-meanF),0),fittedSlope=xf/xx,fittedOffset=meanF-fittedSlope*meanX;
   const correctionOffset=o.correction==='none'?0:o.correction==='constant'?meanF:fittedOffset,correctionSlope=o.correction==='linear'?fittedSlope:0;
   const field=points.map(p=>Object.freeze({...p,correctionHz:correctionOffset+correctionSlope*p.xMm,afterHz:p.beforeHz-correctionOffset-correctionSlope*p.xMm}));
   const mean=which=>field.reduce((s,p)=>s+p[which],0)/n,beforeMeanHz=mean('beforeHz'),afterMeanHz=mean('afterHz');
   const std=(which,m)=>Math.sqrt(field.reduce((s,p)=>s+(p[which]-m)**2,0)/n),beforeStdHz=std('beforeHz',beforeMeanHz),afterStdHz=std('afterHz',afterMeanHz);
   const signal=(timeMs,which)=>{let real=0,imaginary=0;for(const p of field){const m=P.free({x:1,y:0,z:0},timeMs,p[which]);real+=m.x/n;imaginary+=m.y/n;}const magnitude=Math.hypot(real,imaginary);return Object.freeze({real,imaginary,magnitude,phase:magnitude<=1e-8?null:Math.atan2(imaginary,real)});};
   const curve=Array.from({length:121},(_,i)=>Object.freeze({timeMs:i/4,before:signal(i/4,'beforeHz'),after:signal(i/4,'afterHz')}));
   cache.set(key,Object.freeze({field:Object.freeze(field),fittedOffset,fittedSlope,correctionOffset,correctionSlope,beforeMeanHz,afterMeanHz,beforeStdHz,afterStdHz,curve:Object.freeze(curve)}));
  }
  const base=cache.get(key);return{options:o,widthMm,n,...base,current:base.curve[Math.round(o.teMs*4)]};
 }
 return{defaults,widthMm,n,fields,calculate};
});
