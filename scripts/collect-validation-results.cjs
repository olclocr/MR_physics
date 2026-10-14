const fs = require('node:fs');
const path = require('node:path');
const P = require('../docs/assets/mr-physics-models.js');
const se={trMs:500,teMs:15,t1Ms:900,t2Ms:80,offResHz:35,spreadHz:35};
const chemical={trMs:120,teMs:2.3,t1Ms:900,t2Ms:70,b0:3,fatFraction:.4,offResHz:0};
const cells=[];
for(let y=-2;y<=2;y++) for(let x=-2;x<=2;x++) cells.push({x,y,density:.18+.92*Math.exp(-((x-1)**2+(y-1)**2)/.85)});
const encoding={phaseDegPerRow:72,frequencyHzPerCol:25,readoutMs:32,t2starMs:180};
const frame={stage:'readout',ky:0,phaseProgress:1,readoutProgress:0};
const duration=P.pulseDurationMs(180,8);
const out={
  date:'2026-10-14',
  rfOffset:{definition:'fRF-f0',deltaHz:1000,b1MicroT:8,nominalAngleDeg:180,...P.rfFrame(duration/1000,8,1000)},
  finiteRF:{deltaDefinition:'fspin-fRF',b1MicroT:1,deltaHz:120,nominalAngleDeg:90,
    m:P.hardPulse(P.v(0,0,1),{b1MicroT:1,offResHz:120,durationMs:P.pulseDurationMs(90,1),t1Ms:900,t2Ms:80})},
  spinEcho:{parameters:se,initialMz:P.spinEchoInitialMz(500,15,900),samples:[0,7.5,15,20].map(timeMs=>({timeMs,...P.spinEcho(se,timeMs)}))},
  chemical:{parameters:chemical,readoutTimeMs:2.3,...P.chemical(chemical,2.3)},
  encoding:{parameters:encoding,readoutStart: P.encodingSignal(cells,encoding,frame),
    zeroGy:{trajectory:P.encodingTrajectory({...encoding,phaseDegPerRow:0},{...frame,ky:2}),canUseCartesianIFFT:P.cartesianGridMatches({...encoding,phaseDegPerRow:0})}},
  physicalPendulum:{massKg:1.5,radiusM:.35,cmDistanceM:.4,pivotInertia:1.5*(.4**2+.35**2/2)}
};
const output=path.resolve(__dirname,'../docs/verification/2026-10-14/corrected-results.json');
fs.writeFileSync(output,JSON.stringify(out,null,2)+'\n');
console.log('Saved corrected model results.');
