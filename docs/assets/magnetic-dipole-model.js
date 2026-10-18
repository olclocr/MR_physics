(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./mr-physics-models.js'):root.MRPhysics);if(node)module.exports=api;else root.MagneticDipole=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P){
 'use strict';const momentAm2=.001,defaults=Object.freeze({fieldT:3,gradientTm:1,angleDeg:45}),direction=angle=>P.rotate(P.v(0,0,momentAm2),P.v(0,1,0),angle*Math.PI/180);
 function calculate(options={}){const o={...defaults,...options};if(![1,3].includes(o.fieldT)||![0,1].includes(o.gradientTm)||![0,45,90].includes(o.angleDeg))throw new RangeError('Unsupported fixed dipole state');const moment=direction(o.angleDeg),energyJ=-moment.z*o.fieldT,forceN=moment.z*o.gradientTm,torqueNm=-moment.x*o.fieldT;
  const positionCurve=Array.from({length:101},(_,j)=>{const xMm=-20+.4*j,fieldT=o.fieldT+o.gradientTm*xMm/1000,u=-moment.z*fieldT;return{xMm,fieldT,energyJ:u,energyChangeJ:u-energyJ};}),angleCurve=Array.from({length:181},(_,angleDeg)=>{const m=direction(angleDeg);return{angleDeg,energyJ:-m.z*o.fieldT,torqueNm:-m.x*o.fieldT};});
  return{options:o,momentAm2,moment,energyJ,forceN,torqueNm,positionCurve,angleCurve};
 }
 return{defaults,calculate};
});
