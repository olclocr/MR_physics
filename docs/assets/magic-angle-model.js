(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./mr-physics-models.js'):root.MRPhysics);if(node)module.exports=api;else root.MagicAngleModel=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P){
 'use strict';
 const defaults=Object.freeze({angle:'magic',teMs:2}),magicDeg=Math.acos(1/Math.sqrt(3))*180/Math.PI,r2Iso=50,r2Aniso=200;
 function at(angleDeg,teMs){
  const angleRad=angleDeg*Math.PI/180,factor=3*Math.cos(angleRad)**2-1,r2PerS=r2Iso+r2Aniso*factor*factor,t2Ms=1000/r2PerS;
  const m=P.free({x:1,y:0,z:0},teMs,0,Infinity,t2Ms);
  return{angleDeg,teMs,factor,factorSquared:factor*factor,r2PerS,t2Ms,signal:Math.hypot(m.x,m.y),isotropicSignal:Math.exp(-teMs*r2Iso/1000)};
 }
 function calculate(options={}){
  const o={...defaults,...options};if(!['0','30','45','magic','70','90'].includes(o.angle)||![2,10,40].includes(o.teMs))throw new RangeError('Unsupported magic angle state');
  const angleDeg=o.angle==='magic'?magicDeg:Number(o.angle),current=at(angleDeg,o.teMs);
  return{options:o,magicDeg,r2Iso,r2Aniso,current,magicPoint:at(magicDeg,o.teMs),angleCurve:Array.from({length:181},(_,j)=>at(j/2,o.teMs)),timeCurve:Array.from({length:61},(_,j)=>at(angleDeg,j)),isotropicSignal:current.isotropicSignal};
 }
 return{defaults,magicDeg,r2Iso,r2Aniso,calculate};
});
