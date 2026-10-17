const {reference:kernel}=require('./fov-reference.cjs');
function reference(o){const gamma=42577478.92,fov=.160,dt=.000010,n=16,esp=o.espMs/1000,te=.030,readoutTPerM=1/(gamma*fov*dt),samples=[],echoes=[];for(let row=0;row<n;row++){const direction=row%2===0?1:-1,center=te+(row-8)*esp,start=center-(direction===1?8:7)*dt;let kx=direction===1?-8/fov:7/fov;const ky=o.polarity*(row-8)/fov;for(let adc=0;adc<n;adc++){samples.push({row,adc,timeMs:(start+adc*dt)*1000,kx:kx/1000,ky:ky/1000});kx+=gamma*direction*readoutTPerM*dt;}echoes.push({row,centerMs:center*1000,ky:ky/1000});}
 let lo=-1000,hi=1000;for(let i=0;i<90;i++){const y=(lo+hi)/2,phaseStep=o.polarity*y/160-o.offsetHz*esp;if((phaseStep<0)===(o.polarity>0))lo=y;else hi=y;}const shiftMm=(lo+hi)/2,phase=-2*Math.PI*o.offsetHz*te,c=Math.cos(phase),s=Math.sin(phase);
 return {samples,echoes,shiftMm,at:y=>{const a=kernel({fovMm:160,acquired:16,phantom:'point'},o.polarity*(y-shiftMm));return {real:a.real*c-a.imaginary*s,imaginary:a.real*s+a.imaginary*c,magnitude:Math.hypot(a.real,a.imaginary)};}};
}
// Integrate arbitrary supplied piecewise-constant gradients in SI, using 64 midpoint steps.
function integrate(gradients,timeMs){let kx=0,ky=0;for(const g of gradients){const duration=Math.max(0,Math.min(timeMs,g.endMs)-g.startMs)/1000;if(!duration)continue;for(let i=0;i<64;i++){kx+=42577478.92*(g.gx/1000)*duration/64;ky+=42577478.92*(g.gy/1000)*duration/64;}}return {kx:kx/1000,ky:ky/1000};}
module.exports={reference,integrate};
