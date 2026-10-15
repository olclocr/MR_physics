(function(root,factory){
  if(typeof module==='object'&&module.exports)module.exports=factory(require('./mr-physics-models.js'));
  else root.EchoComparison=factory(root.MRPhysics);
})(typeof globalThis!=='undefined'?globalThis:this,function(P){
  'use strict';
  const defaults=Object.freeze({mode:'se',teMs:40,t2Ms:80,gradientHz:20,balance:1,offResHz:0,spreadHz:0});
  function calculate(options={},timeMs) {
    const o={...defaults,...options};
    if(!['se','gre'].includes(o.mode)||!['teMs','t2Ms','gradientHz','balance','offResHz','spreadHz'].every(k=>Number.isFinite(o[k]))||!(o.teMs>0)||!(o.t2Ms>0)||o.gradientHz<0||o.balance<0||o.spreadHz<0||timeMs!==undefined&&!Number.isFinite(timeMs))throw new RangeError('Invalid echo parameters');
    const t=Math.max(0,Math.min(1.5*o.teMs,timeMs??o.teMs)),tau=o.teMs/2,a=Math.min(t,tau),b=Math.max(0,t-tau),after=t>=tau;
    const offsets=o.spreadHz>0?[-2,-1.5,-1,-.5,0,.5,1,1.5,2]:[0];
    const total=offsets.reduce((s,x)=>s+Math.exp(-x*x/2),0),members=[];
    const firstSign=o.mode==='gre'?-1:1;
    for(const position of [-2,-1,0,1,2])for(const offset of offsets) {
      const hz=o.offResHz+offset*o.spreadHz,weight=Math.exp(-offset*offset/2)/total/5;
      let m=P.free({x:0,y:1,z:0},a,hz+firstSign*o.gradientHz*position,Infinity,o.t2Ms);
      if(after&&o.mode==='se')m=P.rotate(m,{x:1,y:0,z:0},-Math.PI);
      m=P.free(m,b,hz+o.balance*o.gradientHz*position,Infinity,o.t2Ms);
      members.push({position,hz,weight,m});
    }
    const m=members.reduce((s,a)=>({x:s.x+a.weight*a.m.x,y:s.y+a.weight*a.m.y}),{x:0,y:0});
    const physicalArea=o.gradientHz*(firstSign*a+o.balance*b)/1000;
    const effectiveArea=o.gradientHz*((after&&o.mode==='se'?-1:firstSign)*a+o.balance*b)/1000;
    const gradientNull=o.gradientHz>0&&o.balance>0?tau*(1+1/o.balance):null;
    return {timeMs:t,m,magnitude:Math.hypot(m.x,m.y),t2Envelope:Math.exp(-t/o.t2Ms),members,
      physicalArea,effectiveArea,offsetTimeMs:o.mode==='se'&&after?t-o.teMs:t,
      gradientNullMs:gradientNull!==null&&gradientNull<=1.5*o.teMs?gradientNull:null,refocused:after&&o.mode==='se'};
  }
  function series(options,steps=300) {
    const o={...defaults,...options};
    return Array.from({length:steps+1},(_,i)=>{const timeMs=1.5*o.teMs*i/steps;return {timeMs,se:calculate({...o,mode:'se'},timeMs).magnitude,gre:calculate({...o,mode:'gre'},timeMs).magnitude,t2:Math.exp(-timeMs/o.t2Ms)};});
  }
  return {defaults,calculate,series};
});
