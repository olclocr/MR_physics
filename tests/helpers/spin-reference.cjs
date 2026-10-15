// Independent B03 references: no production model, rotation, or relaxation imports.
const GAMMA = 42.57747892;
function finiteRF({b1MicroT,offResHz=0,t1Ms,t2Ms,angleDeg=90}, fraction=1) {
  const durationMs=angleDeg/(360*GAMMA*b1MicroT)*1000*fraction;
  const h=durationMs/12000, w=2*Math.PI/1000, f1=GAMMA*b1MicroT;
  let m=[0,0,1];
  const derivative=([x,y,z])=>[w*offResHz*y-x/t2Ms,w*(f1*z-offResHz*x)-y/t2Ms,-w*f1*y+(1-z)/t1Ms];
  const add=(a,k,s)=>a.map((x,i)=>x+k[i]*s);
  for(let i=0;i<12000;i++) {
    const a=derivative(m),b=derivative(add(m,a,h/2)),c=derivative(add(m,b,h/2)),d=derivative(add(m,c,h));
    m=m.map((x,j)=>x+h*(a[j]+2*b[j]+2*c[j]+d[j])/6);
  }
  return {m:{x:m[0],y:m[1],z:m[2]},durationMs};
}
function free(m,t,hz,t1,t2,m0=1) {
  const a=2*Math.PI*hz*t/1000, e=Math.exp(-t/t2);
  return {x:e*(m.x*Math.cos(a)+m.y*Math.sin(a)),y:e*(m.y*Math.cos(a)-m.x*Math.sin(a)),z:m0+(m.z-m0)*Math.exp(-t/t1)};
}
function echo(o,t) {
  const tau=o.teMs/2;
  // Chronological z recovery after ideal 90 -> inversion -> remaining TR.
  const at180=1-Math.exp(-tau/o.t1Ms);
  const initialMz=1+(-at180-1)*Math.exp(-(o.trMs-tau)/o.t1Ms);
  const offsets=o.spreadHz>0?[-2,-1.5,-1,-.5,0,.5,1,1.5,2]:[0];
  const weights=offsets.map(x=>Math.exp(-x*x/2)),total=weights.reduce((a,b)=>a+b,0);
  const members=offsets.map((offset,i)=>{
    const hz=o.offResHz+offset*o.spreadHz;
    const phase=2*Math.PI*hz*(t<tau?t:t-o.teMs)/1000;
    const amp=initialMz*Math.exp(-t/o.t2Ms)*(t<tau?1:-1);
    const z=t<tau?1-Math.exp(-t/o.t1Ms):1+(-at180-1)*Math.exp(-(t-tau)/o.t1Ms);
    return {hz,weight:weights[i]/total,m:{x:amp*Math.sin(phase),y:amp*Math.cos(phase),z}};
  });
  const m={x:0,y:0,z:0};
  for(const a of members) for(const k of ['x','y','z'])m[k]+=a.weight*a.m[k];
  return {m,members,initialMz};
}
function chemical(o,t) {
  const shiftHz=GAMMA*o.b0*3.5, initialMz=1-Math.exp(-o.trMs/o.t1Ms);
  const species=[{weight:1-o.fatFraction,hz:o.offResHz},{weight:o.fatFraction,hz:o.offResHz-shiftHz}].map(a=>{
    const amp=a.weight*initialMz*Math.exp(-t/o.t2Ms),p=2*Math.PI*a.hz*t/1000;
    return {...a,m:{x:amp*Math.sin(p),y:amp*Math.cos(p),z:a.weight*(1-Math.exp(-t/o.t1Ms))}};
  });
  const m={x:0,y:0,z:0};
  for(const a of species)for(const k of ['x','y','z'])m[k]+=a.m[k];
  return {m,shiftHz,initialMz,species};
}
module.exports={GAMMA,finiteRF,free,echo,chemical};
