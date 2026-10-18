'use strict';
// Independent indicator-function quadrature and continuous event partition.
function value(x,enhancement=0,shift=0){const y=x-shift;return(Math.abs(y)<40?.2:0)+(Math.abs(y)<6?.1+enhancement:0);}
function pixel(x,enhancement,shift){let sum=0;for(let k=0;k<32;k++)sum+=value(x-.5+(k+.5)/32,enhancement,shift)/32;return sum;}
function calculate(o){
 const delta=o.alignment==='known'?0:o.shiftMm,diff=x=>value(x,o.enhancement,delta)-value(x);
 const pixels=Array.from({length:128},(_,j)=>{const xMm=j-63.5,before=pixel(xMm,0,0),shifted=pixel(xMm,o.enhancement,o.shiftMm),selected=pixel(xMm,o.enhancement,delta);return{index:j,xMm,before,shifted,selected,difference:selected-before};});
 const events=[...new Set([-64,64,-40,40,-6,6,-40+delta,40+delta,-6+delta,6+delta])].sort((a,b)=>a-b);let positiveArea=0,negativeArea=0,totalArea=0;
 for(let i=0;i<events.length-1;i++){const a=events[i],b=events[i+1],v=diff((a+b)/2),area=v*(b-a);if(area>0)positiveArea+=area;else negativeArea+=area;totalArea+=area;}
 const roiEvents=[-6,...events.filter(x=>x>-6&&x<6),6];let roiIntegral=0;for(let i=0;i<roiEvents.length-1;i++)roiIntegral+=diff((roiEvents[i]+roiEvents[i+1])/2)*(roiEvents[i+1]-roiEvents[i]);
 return{options:o,pixels,positiveArea,negativeArea,totalArea,roiMean:roiIntegral/12,trueArea:12*o.enhancement};
}
module.exports={calculate};
