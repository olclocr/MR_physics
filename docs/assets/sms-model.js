(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SMS=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';const n=32,fovMm=160,defaults=Object.freeze({angleDeg:20,shift:0,profile:'spatial',calibrationDeg:0});
 const zero=()=>({real:0,imaginary:0}),wrap=j=>(j%n+n)%n;
 const truth=Object.freeze([Array.from({length:n},(_,j)=>.1+(j>=4&&j<=9?.9:0)),Array.from({length:n},(_,j)=>.1+(j>=19&&j<=25?.6:0)+(j>=12&&j<=13?.2:0))].map(a=>Object.freeze(a)));
 function dft(a,inverse=false){return Array.from({length:n},(_,i)=>{let real=0,imaginary=0;for(let j=0;j<n;j++){const q=inverse?j-n/2:i-n/2,x=inverse?i:j,phase=(inverse?1:-1)*2*Math.PI*q*x/n,c=Math.cos(phase),s=Math.sin(phase);real+=a[j].real*c-a[j].imaginary*s;imaginary+=a[j].real*s+a[j].imaginary*c;}return{real:real/(inverse?n:1),imaginary:imaginary/(inverse?n:1)};});}
 function sensitivity(slice,j,angleDeg,profile){const v=profile==='spatial'?10*Math.cos(2*Math.PI*j/n):0,deg=slice===0?angleDeg+v:90-angleDeg-v,a=deg*Math.PI/180;return[Math.cos(a),Math.sin(a)];}
 function inverse2(a){const d=a[0][0]*a[1][1]-a[0][1]*a[1][0];return Math.abs(d)<1e-10?null:[[a[1][1]/d,-a[0][1]/d],[-a[1][0]/d,a[0][0]/d]];}
 function calculate(options={}){
  const o={...defaults,...options};if(!Number.isFinite(o.angleDeg)||o.angleDeg<0||o.angleDeg>45||![0,16].includes(o.shift)||!['uniform','spatial'].includes(o.profile)||![0,5].includes(o.calibrationDeg))throw new RangeError('Unsupported SMS state');
  const sensitivities=truth.map((_,s)=>Array.from({length:n},(_,j)=>sensitivity(s,j,o.angleDeg,o.profile))),assumed=truth.map((_,s)=>Array.from({length:n},(_,j)=>sensitivity(s,j,o.angleDeg+o.calibrationDeg,o.profile)));
  const raw=Array.from({length:2},(_,c)=>{const k1=dft(truth[0].map((v,j)=>({real:v*sensitivities[0][j][c],imaginary:0}))),k2=dft(truth[1].map((v,j)=>({real:v*sensitivities[1][j][c],imaginary:0})));return k1.map((p,i)=>{const phase=-2*Math.PI*(i-n/2)*o.shift/n,co=Math.cos(phase),si=Math.sin(phase),b=k2[i];return{real:p.real+co*b.real-si*b.imaginary,imaginary:p.imaginary+si*b.real+co*b.imaginary};});});
  const mixed=raw.map(a=>dft(a,true)),estimate=truth.map(()=>Array(n).fill(null)),pairs=[];
  for(let j=0;j<n;j++){
   const k=wrap(j-o.shift),a=sensitivities[0][j],b=sensitivities[1][k],aa=assumed[0][j],bb=assumed[1][k],matrix=[[a[0],b[0]],[a[1],b[1]]],model=[[aa[0],bb[0]],[aa[1],bb[1]]],inv=inverse2(model),dot=Math.max(-1,Math.min(1,a[0]*b[0]+a[1]*b[1])),det=a[0]*b[1]-a[1]*b[0],singular=Math.abs(det)<1e-10,g=singular?Infinity:1/Math.abs(det),condition=singular?Infinity:(1+Math.abs(dot))/Math.abs(det),transfer=inv?inv.map(row=>[row[0]*a[0]+row[1]*a[1],row[0]*b[0]+row[1]*b[1]]):null;
   if(inv){const values=inv.map(row=>({real:row[0]*mixed[0][j].real+row[1]*mixed[1][j].real,imaginary:row[0]*mixed[0][j].imaginary+row[1]*mixed[1][j].imaginary}));estimate[0][j]=values[0];estimate[1][k]=values[1];}
   pairs.push({j,k,matrix,model,transfer,g,condition,singular,solved:!!inv});
  }
  const complete=estimate.every(a=>a.every(p=>p!==null)),error=complete?Math.sqrt(estimate.reduce((sum,a,s)=>sum+a.reduce((t,p,j)=>t+(p.real-truth[s][j])**2+p.imaginary**2,0),0)/truth.flat().reduce((t,v)=>t+v*v,0)):null;
  const predicted=complete?Array.from({length:2},(_,c)=>dft(Array.from({length:n},(_,j)=>{const k=wrap(j-o.shift),a=assumed[0][j][c],b=assumed[1][k][c];return{real:a*estimate[0][j].real+b*estimate[1][k].real,imaginary:a*estimate[0][j].imaginary+b*estimate[1][k].imaginary};}))):null;
  const residual=predicted?Math.sqrt(predicted.reduce((t,a,c)=>t+a.reduce((s,p,i)=>s+(p.real-raw[c][i].real)**2+(p.imaginary-raw[c][i].imaginary)**2,0),0)/raw.flat().reduce((t,p)=>t+p.real**2+p.imaginary**2,0)):null;
  const leakage=complete?[0,1].map(s=>Math.sqrt(pairs.reduce((t,p)=>t+p.transfer[s][1-s]**2,0)/n)):null;
  return{options:o,n,fovMm,pixelMm:fovMm/n,truth,sensitivities,assumed,raw,mixed,estimate,pairs,error,residual,leakage,solved:pairs.filter(p=>p.solved).length,identifiable:pairs.filter(p=>!p.singular).length,maxG:Math.max(...pairs.map(p=>p.g)),rmsG:Math.sqrt(pairs.reduce((t,p)=>t+p.g*p.g,0)/n),schedule:{slices:4,slotMs:2000,sequentialGroups:4,smsGroups:2,sequentialMs:8000,smsMs:4000}};
 }
 return{n,fovMm,defaults,truth,dft,sensitivity,calculate};
});
