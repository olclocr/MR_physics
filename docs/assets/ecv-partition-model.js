(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.ECVPartition=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const defaults=Object.freeze({ecv:.3,plasmaMm:1,analysisHct:.4});
  const trueHct=.4,relaxivity=4,nativeT1Ms=Object.freeze({tissue:1000,blood:1500});
  function infer(tissuePreMs,tissuePostMs,bloodPreMs,bloodPostMs,hct){
    if(![tissuePreMs,tissuePostMs,bloodPreMs,bloodPostMs].every(v=>Number.isFinite(v)&&v>0)||!Number.isFinite(hct)||hct<0||hct>=1)throw new RangeError('Positive T1 in ms and 0 <= Hct < 1 required');
    const deltaTissue=1000/tissuePostMs-1000/tissuePreMs;
    const deltaBlood=1000/bloodPostMs-1000/bloodPreMs;
    if(deltaBlood<=0)return{deltaTissue,deltaBlood,lambda:null,ecv:null,reason:'no-positive-blood-change'};
    const lambda=deltaTissue/deltaBlood;
    return{deltaTissue,deltaBlood,lambda,ecv:(1-hct)*lambda,reason:null};
  }
  function forward(ecv,plasmaMm){
    return [['tissue',ecv],['blood',1-trueHct]].map(([key,accessibleFraction])=>{
      const preT1Ms=nativeT1Ms[key],preR1=1000/preT1Ms;
      const amountUmol=accessibleFraction*plasmaMm,meanConcentrationMm=amountUmol;
      const deltaR1=relaxivity*meanConcentrationMm,postR1=preR1+deltaR1;
      return{key,accessibleFraction,amountUmol,meanConcentrationMm,preT1Ms,postT1Ms:1000/postR1,preR1,postR1,deltaR1};
    });
  }
  function calculate(options={}){
    const o={...defaults,...options};
    if(![.2,.3,.5].includes(o.ecv)||![0,.5,1,2].includes(o.plasmaMm)||![.25,.4,.55].includes(o.analysisHct))throw new RangeError('Unsupported ECV lesson state');
    const rows=forward(o.ecv,o.plasmaMm),[t,b]=rows;
    const estimate=infer(t.preT1Ms,t.postT1Ms,b.preT1Ms,b.postT1Ms,o.analysisHct);
    const curve=Array.from({length:41},(_,j)=>{
      const plasmaMm=j/20,[tissue,blood]=forward(o.ecv,plasmaMm);
      return{plasmaMm,deltaTissue:tissue.deltaR1,deltaBlood:blood.deltaR1};
    });
    return{options:o,trueHct,relaxivity,nativeT1Ms,rows,estimate,curve,bias:estimate.ecv===null?null:estimate.ecv-o.ecv};
  }
  return{defaults,trueHct,relaxivity,nativeT1Ms,infer,calculate};
});
