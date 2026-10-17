// Continuous field RK4, independent of product rotations and RF calibration.
const gammaHzPerT=42577478.92;
const sinc=v=>Math.abs(v)<1e-15?1:Math.sin(Math.PI*v)/(Math.PI*v);
function calibration(o){
  const n=4096,h=o.durationMs/1000/n;
  let sum=0;
  for(let j=0;j<=n;j++)sum+=(j===0||j===n?1:j%2?4:2)*sinc(4*(j/n-.5));
  const area=sum*h/3;
  return{o,peakTesla:o.flipDeg/360/(gammaHzPerT*area)};
}
function prepare(o,count=8192){
  const c=calibration(o),seconds=o.durationMs/1000,dt=seconds/count;
  const omega=Array.from({length:count*2+1},(_,j)=>2*Math.PI*gammaHzPerT*c.peakTesla*sinc(4*(j/(count*2)-.5)));
  return{...c,count,dt,omega};
}
function spinAt(prepared,zMm){
  const {o,count,dt,omega}=prepared;
  const wz=2*Math.PI*gammaHzPerT*(o.gradientMilliTPerM*.001)*(zMm*.001);
  let x=0,y=0,z=1;
  for(let j=0;j<count;j++){
    const w0=omega[2*j],wh=omega[2*j+1],w1=omega[2*j+2];
    const ax=wz*y,ay=w0*z-wz*x,az=-w0*y;
    const xb=x+dt*ax/2,yb=y+dt*ay/2,zb=z+dt*az/2;
    const bx=wz*yb,by=wh*zb-wz*xb,bz=-wh*yb;
    const xc=x+dt*bx/2,yc=y+dt*by/2,zc=z+dt*bz/2;
    const cx=wz*yc,cy=wh*zc-wz*xc,cz=-wh*yc;
    const xd=x+dt*cx,yd=y+dt*cy,zd=z+dt*cz;
    const dx=wz*yd,dy=w1*zd-wz*xd,dz=-w1*yd;
    x+=dt*(ax+2*bx+2*cx+dx)/6;y+=dt*(ay+2*by+2*cy+dy)/6;z+=dt*(az+2*bz+2*cz+dz)/6;
  }
  return{zMm,offResHz:wz/(2*Math.PI),x,y,z,magnitude:Math.hypot(x,y)};
}
function nominalWidth(o){
  const target=4/(o.durationMs/1000)/2;
  const f=z=>gammaHzPerT*Math.abs(o.gradientMilliTPerM)*.001*z*.001;
  let lo=0,hi=20;
  for(let j=0;j<70;j++){const mid=(lo+hi)/2;if(f(mid)<target)lo=mid;else hi=mid;}
  return lo+hi;
}
function reference(o,count=8192){
  const prepared=prepare(o,count);
  return{options:o,peakB1MicroT:prepared.peakTesla*1e6,nominalThicknessMm:nominalWidth(o),profile:Array.from({length:201},(_,j)=>spinAt(prepared,-10+j/10))};
}
module.exports={reference,prepare,spinAt,calibration,nominalWidth};
