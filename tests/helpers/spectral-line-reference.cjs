// Integral of complex ODE: (r-iω) ∫z dt = 1, solved with elimination.
function absorption(hz,centerHz,amplitude,tauMs){const r=1000/tauMs,w=2*Math.PI*(hz-centerHz),a=r,b=w,c=-w,d=r,y=(0-c/r)/(d-c*b/r),x=(1-b*y)/a;return 2*amplitude*x;}
function simpson(fn,a,b,n){let sum=fn(a)+fn(b);for(let j=1;j<n;j++)sum+=(j%2?4:2)*fn(a+(b-a)*j/n);return sum*(b-a)/(3*n);}
function temporalIntegral(offsetHz,amplitude,tauMs){const tau=tauMs/1000,limit=32*tau,n=65536;return 2*simpson(t=>amplitude*Math.exp(-t/tau)*Math.cos(2*Math.PI*offsetHz*t),0,limit,n);}
function reference(o){const centerHz=(o.centerPpm-4.7)*127.73243676,axis=(2.1-4.7)*127.73243676,lowHz=axis-40,highHz=axis+40;let a=o.amplitude;const n=Math.max(1,Math.ceil(o.teMs/.01)),dt=o.teMs/n,x=-dt/200,factor=1+x+x*x/2+x**3/6+x**4/24;for(let j=0;j<n;j++)a*=factor;const value=hz=>absorption(hz,centerHz,a,o.t2StarMs),height=value(centerHz);let lo=0,hi=100;for(let j=0;j<70;j++){const mid=(lo+hi)/2;if(value(centerHz+mid)>height/2)lo=mid;else hi=mid;}const fwhmHz=lo+hi,curve=Array.from({length:401},(_,j)=>value(lowHz+j/5)),windowArea=simpson(value,lowHz,highHz,16384),scale=10;
// f=f0+scale*tan(theta), including finite endpoint limits.
const area=simpson(theta=>{if(Math.abs(Math.cos(theta))<1e-12)return 2*a*(1000/o.t2StarMs)/(4*Math.PI*Math.PI*scale);const f=centerHz+scale*Math.tan(theta);return value(f)*scale/Math.cos(theta)**2;},-Math.PI/2,Math.PI/2,32768);return{centerHz,echoAmplitude:a,height,fwhmHz,windowArea,area,curve};}
module.exports={reference,absorption,temporalIntegral};
