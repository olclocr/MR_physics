(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ShearWave=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';const defaults=Object.freeze({modulusKPa:4,frequencyHz:60,phaseDeg:0}),densityKgM3=1000,amplitudeMicroM=10;
function parameters(o){const speedMPerS=Math.sqrt(o.modulusKPa*1000/densityKgM3),wavelengthMm=speedMPerS/o.frequencyHz*1000,periodMs=1000/o.frequencyHz,timeMs=o.phaseDeg/360*periodMs;return{speedMPerS,wavelengthMm,periodMs,timeMs};}
function displacement(xMm,o){const p=parameters(o);return amplitudeMicroM*Math.cos(2*Math.PI*xMm/p.wavelengthMm-o.phaseDeg*Math.PI/180);}
function calculate(options={}){const o={...defaults,...options};if(![1,4,9].includes(o.modulusKPa)||![30,60,90].includes(o.frequencyHz)||![0,90,180,270].includes(o.phaseDeg))throw new RangeError('Unsupported shear wave state');const p=parameters(o),crests=[];for(let j=0;j<20;j++){const x=p.wavelengthMm*(j+o.phaseDeg/360);if(x<=200+1e-10)crests.push(x);}return{options:o,...p,densityKgM3,amplitudeMicroM,crests,maxStrain:2*Math.PI*amplitudeMicroM/(p.wavelengthMm*1000),curve:Array.from({length:401},(_,j)=>({xMm:j/2,displacementMicroM:displacement(j/2,o)}))};}
return{defaults,densityKgM3,amplitudeMicroM,parameters,displacement,calculate};
});
