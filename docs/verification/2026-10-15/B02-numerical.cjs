const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {solveRF}=require('../../../tests/helpers/rf-reference.cjs');
const {loadRFPage}=require('../../../tests/helpers/rf-page-harness.cjs');
const page=loadRFPage(),rows=[];let maxError=0;
for(const detuneHz of [-2000,-1000,0,1000,2000])for(const b1MicroT of [3,8,30])for(const flipDeg of [0,90,180,360])for(const rfEnabled of [false,true]) {
  const input={detuneHz,b1MicroT,flipDeg,rfEnabled},reference=solveRF(input);
  page.run(`Object.assign(state,${JSON.stringify(input)});`);
  for(const frameMode of ['larmor','rf']) {
    page.run(`state.frameMode=${JSON.stringify(frameMode)};`);
    const actual=page.run('physicsAt(physicsAt(0).pulseDurationS)');
    const error=Math.hypot(actual.m.x-reference[frameMode].x,actual.m.y-reference[frameMode].y,actual.m.z-reference[frameMode].z);
    maxError=Math.max(maxError,error);assert.ok(error<=1e-8);
    rows.push({...input,frameMode,durationS:actual.pulseDurationS,m:actual.m,axisRf:actual.axisRf,actualTilt:actual.actualTiltDeg,reference:reference[frameMode],error});
  }
}
fs.writeFileSync(path.join(__dirname,'B02-numerical.json'),JSON.stringify({date:'2026-10-15',tolerance:1e-8,cases:rows.length,maxError,rows},null,2)+'\n');
console.log(JSON.stringify({cases:rows.length,maxError}));
