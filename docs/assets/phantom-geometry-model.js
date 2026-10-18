(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PhantomGeometry=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';const defaults=Object.freeze({spacing:'square',warp:.02,segment:'horizontal'}),segments=Object.freeze({horizontal:['r2c0','r2c4'],vertical:['r4c2','r0c2'],edge:['r0c0','r0c4'],diagonal:['r4c0','r0c4']});
 function calculate(options={}){const o={...defaults,...options};if(!['square','rectangular'].includes(o.spacing)||![0,.02,.04].includes(o.warp)||!Object.hasOwn(segments,o.segment))throw new RangeError('Unsupported known-grid state');
  const dxMm=1,dyMm=o.spacing==='square'?1:2,columns=128,rows=128/dyMm,points=Array.from({length:25},(_,j)=>{const row=Math.floor(j/5),column=j%5,xMm=-40+column*20,yMm=40-row*20,factor=1+o.warp*(xMm*xMm+yMm*yMm)/1600,warpedXMm=xMm*factor,warpedYMm=yMm*factor;return{id:'r'+row+'c'+column,row,column,xMm,yMm,warpedXMm,warpedYMm,u:(warpedXMm+64)/dxMm-.5,v:(64-warpedYMm)/dyMm-.5,displacementMm:Math.hypot(warpedXMm-xMm,warpedYMm-yMm)};});
  const [a,b]=segments[o.segment].map(id=>points.find(p=>p.id===id)),deltaU=b.u-a.u,deltaV=b.v-a.v,knownLengthMm=Math.hypot(b.xMm-a.xMm,b.yMm-a.yMm),convertedLengthMm=Math.hypot(deltaU*dxMm,deltaV*dyMm),errorMm=convertedLengthMm-knownLengthMm;
  return{options:o,spacing:{dxMm,dyMm,columns,rows,pixelSpacing:[dyMm,dxMm]},points,selected:{a,b,deltaU,deltaV,knownLengthMm,convertedLengthMm,errorMm,errorPercent:errorMm/knownLengthMm*100},maxDisplacementMm:Math.max(...points.map(p=>p.displacementMm))};
 }
 return{defaults,segments,calculate};
});
