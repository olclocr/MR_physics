// Independent frequency integration: no Gaussian Fourier expression or production dephasing model.
const P=require('../../docs/assets/mr-physics-models.js');
function reference(o,t,intervals=4096){
  const tau=o.teMs/2,a=Math.min(t,tau),b=Math.max(0,t-tau),after=t>=tau;
  let fid={x:0,y:0},se={x:0,y:0},weight=0,variance=0;
  for(let i=0;i<=intervals;i++){
    const u=-8+16*i/intervals,hz=u*o.sigmaHz,w=Math.exp(-u*u/2)*(i===0||i===intervals?1:i%2?4:2);
    const f=P.free({x:0,y:1,z:0},t,hz,Infinity,o.t2Ms);
    let s=P.free({x:0,y:1,z:0},a,hz,Infinity,o.t2Ms);if(after)s=P.rotate(s,{x:1,y:0,z:0},-Math.PI);s=P.free(s,b,hz,Infinity,o.t2Ms);
    weight+=w;variance+=w*hz*hz;fid.x+=w*f.x;fid.y+=w*f.y;se.x+=w*s.x;se.y+=w*s.y;
  }
  for(const m of [fid,se]){m.x/=weight;m.y/=weight;}
  return {fid:Math.hypot(fid.x,fid.y),se:Math.hypot(se.x,se.y),fidVector:fid,seVector:se,variance:variance/weight};
}
module.exports={reference};
