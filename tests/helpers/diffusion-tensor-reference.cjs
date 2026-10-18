'use strict';
const spectra={isotropic:[.0008,.0008,.0008],prolate:[.0014,.0005,.0005],oblate:[.0011,.0011,.0002]};
function ode(adc,b,steps=1024){const h=b/steps;let y=1;for(let j=0;j<steps;j++){const a=-adc*y,q=-adc*(y+h*a/2),r=-adc*(y+h*q/2),s=-adc*(y+h*r);y+=h*(a+2*q+2*r+s)/6;}return y;}
function calculate(o){const[l1,l2,l3]=spectra[o.shape],a=o.rotationDeg*Math.PI/180,c=Math.cos(a),s=Math.sin(a),tensor=[[l1*c*c+l2*s*s,(l1-l2)*s*c,0],[(l1-l2)*s*c,l1*s*s+l2*c*c,0],[0,0,l3]],md=(l1+l2+l3)/3,fa=Math.sqrt(((l1-l2)**2+(l1-l3)**2+(l2-l3)**2)/(2*(l1*l1+l2*l2+l3*l3))),direction=theta=>l1*Math.cos((theta-o.rotationDeg)*Math.PI/180)**2+l2*Math.sin((theta-o.rotationDeg)*Math.PI/180)**2;
 return{options:o,eigenvalues:[l1,l2,l3],tensor,md,fa,angular:Array.from({length:37},(_,j)=>{const thetaDeg=j*5,adc=direction(thetaDeg);return{thetaDeg,adc,signal:Math.exp(-o.b*adc)};}),axes:[direction(0),direction(90),l3].map((adc,i)=>({axis:['X','Y','Z'][i],adc,signal:Math.exp(-o.b*adc)})),referenceSignal:Math.exp(-o.b*md)};}
module.exports={calculate,ode};
