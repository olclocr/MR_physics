// Independent time-dependent Bloch ODE in the Larmor frame; seconds, unit M0.
// No Rodrigues formula or production math functions are used.
function solveRF({b1MicroT,detuneHz,flipDeg,rfEnabled=true}) {
  const nominalF1=42.57747892*b1MicroT, f1=rfEnabled?nominalF1:0;
  const durationS=flipDeg/360/nominalF1;
  const count=Math.max(20000,Math.ceil((Math.abs(detuneHz)+f1)*durationS*1500)),h=durationS/count;
  const derivative=(t,m)=>{
    const phase=-2*Math.PI*detuneHz*t,bx=f1*Math.cos(phase),by=f1*Math.sin(phase);
    return [-2*Math.PI*m[2]*by,2*Math.PI*m[2]*bx,2*Math.PI*(m[0]*by-m[1]*bx)];
  };
  const add=(m,k,s)=>m.map((v,i)=>v+s*k[i]);
  let m=[0,0,1];
  for(let i=0;i<count;i++) {
    const t=i*h,a=derivative(t,m),b=derivative(t+h/2,add(m,a,h/2));
    const c=derivative(t+h/2,add(m,b,h/2)),d=derivative(t+h,add(m,c,h));
    m=m.map((v,j)=>v+h/6*(a[j]+2*b[j]+2*c[j]+d[j]));
  }
  const phase=2*Math.PI*detuneHz*durationS,c=Math.cos(phase),s=Math.sin(phase);
  return {durationS,larmor:{x:m[0],y:m[1],z:m[2]},rf:{x:c*m[0]-s*m[1],y:s*m[0]+c*m[1],z:m[2]}};
}
module.exports={solveRF};
