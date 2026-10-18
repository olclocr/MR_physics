'use strict';const alpha=.001,m0=.001;
function moment(B,kind){return kind==='fixed'?m0:alpha*B;}
function integral(B,kind,n=64){const h=B/n;let sum=moment(0,kind)+moment(B,kind);for(let j=1;j<n;j++)sum+=(j%2?4:2)*moment(j*h,kind);return sum*h/3;}
function minimum(B){const f=m=>m*m/(2*alpha)-m*B,ratio=(Math.sqrt(5)-1)/2;let lo=0,hi=.008,a=hi-ratio*(hi-lo),b=lo+ratio*(hi-lo),fa=f(a),fb=f(b);for(let j=0;j<100;j++){if(fa<fb){hi=b;b=a;fb=fa;a=hi-ratio*(hi-lo);fa=f(a);}else{lo=a;a=b;fa=fb;b=lo+ratio*(hi-lo);fb=f(b);}}const m=(lo+hi)/2;return{momentAm2:m,energyJ:f(m)};}
function force(B,G,kind,h=1e-4){return(integral(B+G*h,kind)-integral(B-G*h,kind))/(2*h);}
function calculate(o){const curve=Array.from({length:161},(_,j)=>{const fieldT=j/50,workAreaJ=integral(fieldT,o.kind);return{fieldT,momentAm2:moment(fieldT,o.kind),energyJ:-workAreaJ,forceN:force(fieldT,o.gradientTm,o.kind,5e-5),workAreaJ};});return{options:o,curve,index:o.fieldT*50,current:curve[o.fieldT*50]};}
module.exports={moment,integral,minimum,force,calculate};
