// Independent SI conversion and simultaneous real/imaginary RK4 ODE propagation.
function frequency(b0){return -3.5e-6*42577478.92*b0;}
function evolve(initial,durationMs,hz){let re=initial,im=0;const count=Math.max(1,Math.ceil(durationMs/.002)),h=durationMs/count,omega=2*Math.PI*hz/1000,derivative=(x,y)=>[-x/40+omega*y,-y/40-omega*x];for(let i=0;i<count;i++){const a=derivative(re,im),b=derivative(re+h*a[0]/2,im+h*a[1]/2),c=derivative(re+h*b[0]/2,im+h*b[1]/2),d=derivative(re+h*c[0],im+h*c[1]);re+=h*(a[0]+2*b[0]+2*c[0]+d[0])/6;im+=h*(a[1]+2*b[1]+2*c[1]+d[1])/6;}return {real:re,imaginary:im};}
function reference(te,b0,f){const water=evolve(1-f,te,0),fat=evolve(f,te,frequency(b0)),real=water.real+fat.real,imaginary=water.imaginary+fat.imaginary;return {water,fat,real,imaginary,magnitude:Math.hypot(real,imaginary),individualSum:Math.hypot(water.real,water.imaginary)+Math.hypot(fat.real,fat.imaginary)};}
function phaseRoot(b0,turns){const hz=frequency(b0);let lo=0,hi=20;for(let i=0;i<60;i++){const t=(lo+hi)/2,angle=-hz*t/1000;if(angle<turns)lo=t;else hi=t;}return (lo+hi)/2;}
module.exports={frequency,evolve,reference,phaseRoot};
