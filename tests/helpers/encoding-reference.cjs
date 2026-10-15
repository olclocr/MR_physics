// Independent gradient-area quadrature and complex Fourier sums. No production imports.
function trajectory(o,frame,progress=frame.readoutProgress) {
  const read=['readout','rewind','complete'].includes(frame.stage);
  const prepTime=read?8:8*(frame.phaseProgress||0),readTime=read?progress*o.readoutMs:0;
  // Rates in cycles / voxel interval / ms; integrate each rectangular interval.
  const gxPre=frame.phaseOnly?0:-o.frequencyHzPerCol*o.readoutMs/(2*8*1000);
  const gyPre=(frame.ky||0)*o.phaseDegPerRow/(360*8);
  const integrate=(rate,duration)=>{let a=0;for(let i=0;i<16;i++)a+=rate*duration/16;return a;};
  const areaX=integrate(gxPre,prepTime)+integrate(frame.phaseOnly?0:o.frequencyHzPerCol/1000,readTime);
  const areaY=integrate(gyPre,prepTime);
  return {kx:5*areaX,ky:5*areaY,timeMs:prepTime+readTime,areaX,areaY};
}
function signal(cells,o,frame,progress=frame.readoutProgress) {
  const k=trajectory(o,frame,progress),decay=o.ignoreDecay?1:Math.exp(-k.timeMs/o.t2starMs);
  let real=0,imaginary=0,totalDensity=0;
  for(const c of cells) {
    const phase=-2*Math.PI*(c.x*k.areaX+c.y*k.areaY);
    real+=c.density*decay*Math.cos(phase);imaginary+=c.density*decay*Math.sin(phase);totalDensity+=c.density;
  }
  return {...k,real,imaginary,totalDensity,magnitude:Math.hypot(real,imaginary)};
}
function inverse(samples,x,y) {
  let real=0,imaginary=0;
  for(const a of samples) {
    const phase=2*Math.PI*(a.kx*x+a.ky*y)/5,c=Math.cos(phase),s=Math.sin(phase);
    real+=(a.real*c-a.imaginary*s)/25;imaginary+=(a.real*s+a.imaginary*c)/25;
  }
  return {real,imaginary,magnitude:Math.hypot(real,imaginary)};
}
const parameterCases=[
  {phaseDegPerRow:72,frequencyHzPerCol:25,readoutMs:32,t2starMs:180,ignoreDecay:false},
  {phaseDegPerRow:72,frequencyHzPerCol:25,readoutMs:32,t2starMs:180,ignoreDecay:true},
  {phaseDegPerRow:72,frequencyHzPerCol:25,readoutMs:32,t2starMs:50,ignoreDecay:false},
  {phaseDegPerRow:72,frequencyHzPerCol:25,readoutMs:32,t2starMs:600,ignoreDecay:false},
  {phaseDegPerRow:0,frequencyHzPerCol:25,readoutMs:32,t2starMs:50,ignoreDecay:false},
  {phaseDegPerRow:0,frequencyHzPerCol:25,readoutMs:32,t2starMs:180,ignoreDecay:true},
  {phaseDegPerRow:75,frequencyHzPerCol:25,readoutMs:32,t2starMs:180,ignoreDecay:true},
  {phaseDegPerRow:42,frequencyHzPerCol:4,readoutMs:8,t2starMs:600,ignoreDecay:false},
  {phaseDegPerRow:75,frequencyHzPerCol:60,readoutMs:160,t2starMs:50,ignoreDecay:false},
  {phaseDegPerRow:144,frequencyHzPerCol:60,readoutMs:160,t2starMs:600,ignoreDecay:true},
  {phaseDegPerRow:72,frequencyHzPerCol:5,readoutMs:160,t2starMs:600,ignoreDecay:false},
  {phaseDegPerRow:72,frequencyHzPerCol:50,readoutMs:16,t2starMs:50,ignoreDecay:true}
];
const samplingRows={full:[-2,-1,0,1,2],center3:[-1,0,1],alternate:[-2,0,2],partialFourier:[-2,-1,0,1]};
module.exports={trajectory,signal,inverse,parameterCases,samplingRows};
