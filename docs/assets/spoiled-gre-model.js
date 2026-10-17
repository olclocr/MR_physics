(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SpoiledGRE=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const defaults=Object.freeze({trMs:20,flipDeg:20,t1A:600});
 const t1B=1200,teMs=2,t2StarMs=40,pd=1;
 function validate(o){if(![5,10,20,50,100,500,2000,5000].includes(o.trMs)||!Number.isFinite(o.flipDeg)||o.flipDeg<0||o.flipDeg>90||![300,600,1000].includes(o.t1A))throw new RangeError('Unsupported GRE scenario');}
 function tissue(trMs,flipDeg,t1Ms){
  const angle=flipDeg*Math.PI/180,e1=Math.exp(-trMs/t1Ms),cos=Math.cos(angle),sin=Math.sin(angle),decay=Math.exp(-teMs/t2StarMs);
  const mz=flipDeg===0?1:-Math.expm1(-trMs/t1Ms)/(1-e1*cos),signal=mz*sin*decay,ernstDeg=Math.acos(e1)*180/Math.PI;
  const q=e1*cos,initialError=1-mz;
  const pulsesToOnePercent=flipDeg===0?1:1+Math.ceil(Math.log(.01)/Math.log(q));
  let before=1;const transient=[];
  for(let pulse=1;pulse<=50;pulse++){const after=before*cos;transient.push({pulse,before,after,signal:before*sin*decay});before=1+(after-1)*e1;}
  return {t1Ms,mz,signal,ernstDeg,q,pulsesToOnePercent,transient};
 }
 function calculate(options={}){const o={...defaults,...options};validate(o);const a=tissue(o.trMs,o.flipDeg,o.t1A),b=tissue(o.trMs,o.flipDeg,t1B),curve=Array.from({length:181},(_,i)=>{const flipDeg=i/2;return {flipDeg,a:tissue(o.trMs,flipDeg,o.t1A).signal,b:tissue(o.trMs,flipDeg,t1B).signal};});return {options:o,a,b,contrast:a.signal-b.signal,curve};}
 return {defaults,t1B,teMs,t2StarMs,pd,tissue,calculate};
});
