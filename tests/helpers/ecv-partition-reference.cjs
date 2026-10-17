// Independent volume integration and numerical longitudinal recovery.
// Never imports the product model or its inference function.
function recoveryRate(rate){
  let m=0;const dt=.0002,n=5000;
  const f=v=>rate*(1-v);
  for(let j=0;j<n;j++){
    const a=f(m),b=f(m+dt*a/2),c=f(m+dt*b/2),d=f(m+dt*c);
    m+=dt*(a+2*b+2*c+d)/6;
  }
  return -Math.log1p(-m); // Observed at exactly one second.
}
function reference(o){
  const rows=[['tissue',o.ecv,1],['blood',.6,2/3]].map(([key,fraction,nativeRate])=>{
    let amount=0;
    for(let j=0;j<1000;j++)if((j+.5)/1000<fraction)amount+=o.plasmaMm/1000;
    const preR1=recoveryRate(nativeRate),postR1=recoveryRate(nativeRate+4*amount);
    return{key,accessibleFraction:fraction,amountUmol:amount,meanConcentrationMm:amount,preR1,postR1,preT1Ms:1000/preR1,postT1Ms:1000/postR1,deltaR1:postR1-preR1};
  });
  let estimate={lambda:null,ecv:null};
  if(o.plasmaMm>0){
    const bloodAmount=rows[1].deltaR1/4;
    const plasmaFromAssumedVolume=bloodAmount/(1-o.analysisHct);
    const tissueAmount=rows[0].deltaR1/4;
    estimate={lambda:tissueAmount/bloodAmount,ecv:tissueAmount/plasmaFromAssumedVolume};
  }
  return{options:o,rows,estimate,bias:estimate.ecv===null?null:estimate.ecv-o.ecv};
}
module.exports={reference,recoveryRate};
