'use strict';
const pairs={horizontal:[[-40,0],[40,0]],vertical:[[0,-40],[0,40]],edge:[[-40,40],[40,40]],diagonal:[[-40,-40],[40,40]]};
function position(x,y,k){return[x+k*(x*x*x+x*y*y)/1600,y+k*(y*y*y+y*x*x)/1600];}
function calculate(o){const dx=1,dy=o.spacing==='square'?1:2,points=[];for(let r=0;r<5;r++)for(let c=0;c<5;c++){const x=-40+20*c,y=40-20*r,[X,Y]=position(x,y,o.warp);points.push({id:'r'+r+'c'+c,row:r,column:c,xMm:x,yMm:y,warpedXMm:X,warpedYMm:Y,u:X/dx+64/dx-.5,v:-Y/dy+64/dy-.5,displacementMm:Math.sqrt((X-x)**2+(Y-y)**2)});}
 const [a,b]=pairs[o.segment],A=position(...a,o.warp),B=position(...b,o.warp),DU=(B[0]-A[0])/dx,DV=-(B[1]-A[1])/dy,knownLengthMm=Math.sqrt((b[0]-a[0])**2+(b[1]-a[1])**2),factor=1+(o.segment==='edge'||o.segment==='diagonal'?2:1)*o.warp,convertedLengthMm=knownLengthMm*factor,errorMm=knownLengthMm*(factor-1);
 return{options:o,spacing:{dxMm:dx,dyMm:dy,columns:128,rows:128/dy,pixelSpacing:[dy,dx]},points,selected:{a:points.find(p=>p.xMm===a[0]&&p.yMm===a[1]),b:points.find(p=>p.xMm===b[0]&&p.yMm===b[1]),deltaU:DU,deltaV:DV,knownLengthMm,convertedLengthMm,errorMm,errorPercent:(factor-1)*100},maxDisplacementMm:80*Math.sqrt(2)*o.warp};
}
module.exports={position,calculate};
