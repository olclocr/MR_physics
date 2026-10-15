(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.FovResolution=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const defaults=Object.freeze({fovMm:240,acquired:32,reconFactor:1,phantom:'point'}),edgeWidthMm=30;
 function settings(options={}){const o={...defaults,...options};if(!Number.isFinite(o.fovMm)||o.fovMm<=edgeWidthMm||![16,32,64].includes(o.acquired)||![1,2,4].includes(o.reconFactor)||!['point','edge'].includes(o.phantom))throw new RangeError('Invalid FOV/matrix parameters');return o;}
 function geometry(options={}){const o=settings(options),n=o.acquired,m=n*o.reconFactor;return {fovMm:o.fovMm,acquired:n,reconstructed:m,acquiredPixelMm:o.fovMm/n,displayPixelMm:o.fovMm/m,deltaKPerMm:1/o.fovMm,deltaKPerM:1000/o.fovMm,bandwidthPerMm:n/o.fovMm,kMinPerMm:-n/2/o.fovMm,kMaxPerMm:(n/2-1)/o.fovMm};}
 const sinc=x=>Math.abs(x)<1e-14?1:Math.sin(Math.PI*x)/(Math.PI*x);
 function coefficients(options={}){const o=settings(options);return Array.from({length:o.acquired},(_,i)=>{const n=i-o.acquired/2,kPerMm=n/o.fovMm;return {n,kPerMm,real:o.phantom==='point'?1:edgeWidthMm*sinc(kPerMm*edgeWidthMm),imaginary:0};});}
 function at(options={},xMm=0){const o=settings(options);if(!Number.isFinite(xMm))throw new RangeError('Invalid position');const c=coefficients(o),normalization=o.phantom==='point'?o.acquired:o.fovMm;let real=0,imaginary=0;for(const s of c){const p=2*Math.PI*s.kPerMm*xMm;real+=s.real*Math.cos(p)/normalization;imaginary+=s.real*Math.sin(p)/normalization;}return {xMm,real,imaginary,magnitude:Math.hypot(real,imaginary)};}
 function calculate(options={}){const o=settings(options),g=geometry(o);return {geometry:g,coefficients:coefficients(o),profile:Array.from({length:g.reconstructed},(_,i)=>at(o,(i-g.reconstructed/2)*g.displayPixelMm))};}
 return {defaults,edgeWidthMm,geometry,coefficients,at,calculate};
});
