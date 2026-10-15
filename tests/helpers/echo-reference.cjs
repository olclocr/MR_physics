// Independent analytic complex phases, without production free/rotate or echo imports.
function reference(o,t) {
  const tau=o.teMs/2,after=t>=tau,amp=Math.exp(-t/o.t2Ms),positions=[-2,-1,0,1,2];
  const offsets=o.spreadHz>0?[-2,-1.5,-1,-.5,0,.5,1,1.5,2]:[0];
  const weights=offsets.map(x=>Math.exp(-x*x/2)),total=weights.reduce((a,b)=>a+b,0),members=[];
  for(const x of positions)for(let i=0;i<offsets.length;i++) {
    const delta=o.offResHz+o.spreadHz*offsets[i];
    let phase;
    if(!after)phase=Math.PI/2-2*Math.PI*(delta+(o.mode==='gre'?-1:1)*o.gradientHz*x)*t/1000;
    else {
      const start=o.mode==='se'?-Math.PI/2:Math.PI/2;
      const staticTime=o.mode==='se'?t-o.teMs:t;
      phase=start-2*Math.PI*(delta*staticTime+o.gradientHz*x*(-tau+o.balance*(t-tau)))/1000;
    }
    members.push({weight:weights[i]/total/5,position:x,hz:delta,m:{x:amp*Math.cos(phase),y:amp*Math.sin(phase)}});
  }
  const m=members.reduce((s,a)=>({x:s.x+a.weight*a.m.x,y:s.y+a.weight*a.m.y}),{x:0,y:0});
  return {m,members,magnitude:Math.hypot(m.x,m.y)};
}
module.exports={reference};
