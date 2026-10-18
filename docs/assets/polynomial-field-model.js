(function(root,factory){const node=typeof module==='object'&&module.exports,api=factory(node?require('./mr-physics-models.js'):root.MRPhysics);if(node)module.exports=api;else root.PolynomialField=api;})(typeof globalThis!=='undefined'?globalThis:this,function(P){
 'use strict';const defaults=Object.freeze({curvatureHzMm2:.1,basis:'linear',teMs:5}),n=401,widthMm=40,cache=new Map(),degrees=Object.freeze({none:-1,constant:0,linear:1,quadratic:2});
 // Modified Gram-Schmidt QR in the dimensionless basis 1,u,u² (u=x/20).
 function fit(points,degree){
  if(degree<0)return[0,0,0];const q=[],r=Array.from({length:degree+1},()=>Array(degree+1).fill(0)),dot=(a,b)=>a.reduce((s,v,j)=>s+v*b[j],0),y=points.map(p=>p.beforeHz),projection=[];
  for(let k=0;k<=degree;k++){let v=points.map(p=>(p.xMm/20)**k);for(let j=0;j<k;j++){r[j][k]=dot(q[j],v);v=v.map((x,i)=>x-r[j][k]*q[j][i]);}r[k][k]=Math.sqrt(dot(v,v));q[k]=v.map(x=>x/r[k][k]);projection[k]=dot(q[k],y);}
  const beta=[0,0,0];for(let k=degree;k>=0;k--){let value=projection[k];for(let j=k+1;j<=degree;j++)value-=r[k][j]*beta[j];beta[k]=value/r[k][k];}return[beta[0],beta[1]/20,beta[2]/400];
 }
 function calculate(options={}){
  const o={...defaults,...options};if(![0,.1,.2].includes(o.curvatureHzMm2)||!Object.hasOwn(degrees,o.basis)||![0,5,12.5].includes(o.teMs))throw new RangeError('Unsupported polynomial field state');
  const key=o.curvatureHzMm2+'|'+o.basis;if(!cache.has(key)){
   const points=Array.from({length:n},(_,j)=>{const xMm=-20+(j+.5)*widthMm/n;return{xMm,beforeHz:30+2*xMm+o.curvatureHzMm2*xMm*xMm};}),coefficients=fit(points,degrees[o.basis]);
   const field=points.map(p=>{const correctionHz=coefficients[0]+coefficients[1]*p.xMm+coefficients[2]*p.xMm*p.xMm;return Object.freeze({...p,correctionHz,afterHz:p.beforeHz-correctionHz});});
   const mean=key=>field.reduce((s,p)=>s+p[key],0)/n,beforeMeanHz=mean('beforeHz'),afterMeanHz=mean('afterHz'),std=(key,m)=>Math.sqrt(field.reduce((s,p)=>s+(p[key]-m)**2,0)/n);
   const signal=(timeMs,key)=>{let real=0,imaginary=0;for(const p of field){const m=P.free({x:1,y:0,z:0},timeMs,p[key]);real+=m.x/n;imaginary+=m.y/n;}const magnitude=Math.hypot(real,imaginary);return Object.freeze({real,imaginary,magnitude,phase:magnitude<=1e-8?null:Math.atan2(imaginary,real)});};
   const curve=Array.from({length:121},(_,i)=>Object.freeze({timeMs:i/4,before:signal(i/4,'beforeHz'),after:signal(i/4,'afterHz')}));
   cache.set(key,Object.freeze({field:Object.freeze(field),coefficients:Object.freeze(coefficients),beforeMeanHz,afterMeanHz,beforeStdHz:std('beforeHz',beforeMeanHz),afterStdHz:std('afterHz',afterMeanHz),curve:Object.freeze(curve)}));
  }
  const base=cache.get(key);return{options:o,n,widthMm,...base,current:base.curve[Math.round(o.teMs*4)]};
 }
 return{defaults,n,widthMm,degrees,calculate};
});
