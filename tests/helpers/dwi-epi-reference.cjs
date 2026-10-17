const {trueSignal}=require('./adc-reference.cjs');
const settings={single:[1,1,.0008],parallel:[2,1,.0008],segmented:[1,3,.0004]};
function rotate(x,y,frequency,duration){const omega=-2*Math.PI*frequency,steps=Math.max(1,Math.ceil(Math.abs(omega*duration)/.003)),h=duration/steps;for(let i=0;i<steps;i++){const a=[-omega*y,omega*x],b=[-omega*(y+h*a[1]/2),omega*(x+h*a[0]/2)],c=[-omega*(y+h*b[1]/2),omega*(x+h*b[0]/2)],d=[-omega*(y+h*c[1]),omega*(x+h*c[0])];x+=h*(a[0]+2*b[0]+2*c[0]+d[0])/6;y+=h*(a[1]+2*b[1]+2*c[1]+d[1])/6;}return [x,y];}
function reference(o){const [r,shots,esp]=settings[o.mode],ny=32,fov=.160,y0=-.020,te=.080,amplitude=trueSignal(o.b,.001,80),events=[];for(let shot=0;shot<shots;shot++){let t=te-ny/(2*r)*esp;for(let row=0;row<ny/r;row++){const q=-ny/2+row*r,k=o.polarity*q/fov,initial=-2*Math.PI*k*y0,z=rotate(amplitude*Math.cos(initial),amplitude*Math.sin(initial),o.offsetHz,t-te);events.push({shot:shot+1,row,q,ky:k/1000,centerMs:1000*t,real:z[0],imaginary:z[1]});t+=esp;}}
 // Unwrap only one shot. In this restricted point/prior branch adjacent phase jumps stay below pi.
 const samples=events.filter(e=>e.shot===1),unwrapped=[];let prior=0;for(let i=0;i<samples.length;i++){let v=Math.atan2(samples[i].imaginary,samples[i].real);if(i){while(v-prior>Math.PI)v-=2*Math.PI;while(v-prior< -Math.PI)v+=2*Math.PI;}unwrapped.push(v);prior=v;}
 const kmean=samples.reduce((s,p)=>s+p.ky,0)/samples.length,pmean=unwrapped.reduce((s,p)=>s+p,0)/samples.length,slope=samples.reduce((s,p,i)=>s+(p.ky-kmean)*(unwrapped[i]-pmean),0)/samples.reduce((s,p)=>s+(p.ky-kmean)**2,0),predictedMm=-slope/(2*Math.PI);
 return {signal:amplitude,b0Signal:trueSignal(0,.001,80),events,predictedMm,shiftMm:predictedMm-y0*1000,centerSpanMs:samples.at(-1).centerMs-samples[0].centerMs,rowsPerShot:samples.length,shots,r,espMs:1000*esp};
}
module.exports={reference,rotate};
