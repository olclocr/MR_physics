// Independent SI field-frequency inversion. Geometry is found by roots, not BW/G.
function reference(o,steps=20000){
 const frequency=z=>42577478.92*(o.gradientMilliTPerM*1e-3*o.polarity)*(z*1e-3);
 function root(target){let a=-1000,b=1000;for(let i=0;i<100;i++){const mid=(a+b)/2;if((frequency(mid)<target)===(o.polarity>0))a=mid;else b=mid;}return(a+b)/2;}
 const endpoints=[root(o.offsetHz-o.bandwidthHz/2),root(o.offsetHz+o.bandwidthHz/2)].sort((a,b)=>a-b),lowMm=endpoints[0],highMm=endpoints[1],width=highMm-lowMm,dx=width/steps;let countA=0,total=0;
 for(let i=0;i<steps;i++){const a=lowMm+(i+.5)*dx<0;countA+=Number(a);total+=(a?1:.3)*dx;}
 return {lowMm,highMm,centerMm:(lowMm+highMm)/2,thicknessMm:width,fractionA:countA/steps,fractionB:1-countA/steps,integratedSignal:total,meanSignal:total/width};
}
module.exports={reference};
