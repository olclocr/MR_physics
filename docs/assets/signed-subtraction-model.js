(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SignedSubtraction=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';const defaults=Object.freeze({enhancement:.1,shiftMm:0,alignment:'none'}),n=128,fovMm=128,dxMm=fovMm/n;
 function fraction(lo,hi,a,b){return Math.max(0,Math.min(hi,b)-Math.max(lo,a))/(hi-lo);}
 function calculate(options={}){
  const o={...defaults,...options};if(![0,.1,.3].includes(o.enhancement)||![-8,0,8].includes(o.shiftMm)||!['none','known'].includes(o.alignment))throw new RangeError('Unsupported signed subtraction state');
  const before=Array.from({length:n},(_,j)=>{const lo=-fovMm/2+j*dxMm,hi=lo+dxMm;return .2*fraction(lo,hi,-40,40)+.1*fraction(lo,hi,-6,6);});
  const shifted=Array.from({length:n},(_,j)=>{const lo=-fovMm/2+j*dxMm,hi=lo+dxMm;return .2*fraction(lo,hi,-40+o.shiftMm,40+o.shiftMm)+(.1+o.enhancement)*fraction(lo,hi,-6+o.shiftMm,6+o.shiftMm);});
  const shiftPixels=o.shiftMm/dxMm,aligned=shifted.map((_,j)=>shifted[j+shiftPixels]??0),selected=o.alignment==='known'?aligned:shifted;
  const pixels=before.map((v,j)=>Object.freeze({index:j,xMm:-fovMm/2+(j+.5)*dxMm,before:v,shifted:shifted[j],selected:selected[j],difference:selected[j]-v}));
  let positiveArea=0,negativeArea=0,totalArea=0,roiIntegral=0;
  for(const p of pixels){positiveArea+=Math.max(0,p.difference)*dxMm;negativeArea+=Math.min(0,p.difference)*dxMm;totalArea+=p.difference*dxMm;const lo=p.xMm-dxMm/2,hi=p.xMm+dxMm/2;roiIntegral+=p.difference*fraction(lo,hi,-6,6)*dxMm;}
  return{options:o,n,fovMm,dxMm,shiftPixels,pixels:Object.freeze(pixels),positiveArea,negativeArea,totalArea,roiMean:roiIntegral/12,trueArea:o.enhancement*12};
 }
 return{defaults,n,fovMm,dxMm,calculate};
});
