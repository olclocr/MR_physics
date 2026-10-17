// Independent time-ordered longitudinal ODE. Starts after previous 90°/spoiling.
function recover(z,duration,t1,maxStep=.5){const count=Math.ceil(duration/maxStep);if(count===0)return z;const h=duration/count,f=q=>(1-q)/t1;for(let i=0;i<count;i++){const a=f(z),b=f(z+h*a/2),c=f(z+h*b/2),d=f(z+h*c);z+=h*(a+2*b+2*c+d)/6;}return z;}
function reference(ti,tr,t1){const before=recover(0,tr-ti,t1),afterInversion=-before,atReadout=recover(afterInversion,ti,t1);return {before,afterInversion,mz:atReadout,magnitude:Math.abs(atReadout)};}
function root(tr,t1){let a=0,b=tr;for(let i=0;i<45;i++){const ti=(a+b)/2;if(reference(ti,tr,t1).mz<0)a=ti;else b=ti;}return(a+b)/2;}
module.exports={recover,reference,root};
