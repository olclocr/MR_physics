// Independent 3D Rodrigues RF rotation, RK4 relaxation and complete transverse reset.
function ode(v,duration,tau,equilibrium){const steps=Math.max(1,Math.ceil(duration/(tau/200))),h=duration/steps,f=x=>(equilibrium-x)/tau;for(let i=0;i<steps;i++){const a=f(v),b=f(v+h*a/2),c=f(v+h*b/2),d=f(v+h*c);v+=h*(a+2*b+2*c+d)/6;}return v;}
function rotate(v,angle){const axis=[1,0,0],c=Math.cos(angle),s=Math.sin(angle),dot=v[0],cross=[0,-v[2],v[1]];return v.map((x,i)=>x*c+cross[i]*s+axis[i]*dot*(1-c));}
function setup(tr,t1){const zero=ode(0,tr,t1,1),one=ode(1,tr,t1,1),decay=ode(1,2,40,0);return {recover:z=>zero+(one-zero)*z,decay};}
function reference(tr,flip,t1,prepared=setup(tr,t1)){
 const angle=flip*Math.PI/180,first=[];let vector=[0,0,1],mz=1,previous,steps=0;
 do{previous=mz;const tipped=rotate(vector,angle);if(first.length<50)first.push({before:mz,after:tipped[2],signal:Math.hypot(tipped[0],tipped[1])*prepared.decay});mz=prepared.recover(tipped[2]);vector=[0,0,mz];steps++;}while((Math.abs(mz-previous)>2e-14||first.length<50)&&steps<20000);
 if(steps===20000)throw Error('GRE independent iteration did not converge');const signal=Math.hypot(...rotate([0,0,mz],angle).slice(0,2))*prepared.decay;
 let before=1,pulses=1;const initial=1-mz;if(initial!==0){while(Math.abs(before-mz)>Math.abs(initial)*.01){before=prepared.recover(rotate([0,0,before],angle)[2]);pulses++;if(pulses>20000)throw Error('1% criterion');}}
 return {mz,signal,transient:first,pulsesToOnePercent:pulses,iterations:steps};
}
function maximum(tr,t1){const prepared=setup(tr,t1);let lo=0,hi=90;for(let i=0;i<55;i++){const a=lo+(hi-lo)/3,b=hi-(hi-lo)/3;if(reference(tr,a,t1,prepared).signal<reference(tr,b,t1,prepared).signal)lo=a;else hi=b;}return (lo+hi)/2;}
module.exports={ode,rotate,setup,reference,maximum};
