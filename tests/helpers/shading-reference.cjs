const {ode}=require('./saturation-reference.cjs');const cache=new Map();
function spin(scale,hz){const key=scale+'/'+hz;if(!cache.has(key))cache.set(key,ode(8,scale,hz));return cache.get(key);}
function reference(o){return Array.from({length:64},(_,j)=>{const y=-.08+j*.0025,h=Math.cos(2*Math.PI*y/.16),txScale=1+o.variation*h,rx=Math.sin(Math.PI/2*(1+o.variation*h)),hz=60*o.variation*h,modes={};for(const mode of ['tx','rx','b0']){const scale=mode==='tx'?txScale:1,gain=mode==='rx'?rx:1,df=mode==='b0'?hz:0,m=spin(scale*o.flipDeg/90,df),mxy=Math.hypot(m.x,m.y);modes[mode]={signal:gain*mxy,mxy,mz:m.z,b1Scale:scale,coilGain:gain,offsetHz:df};}return{yMm:y*1000,modes};});}
module.exports={reference};
