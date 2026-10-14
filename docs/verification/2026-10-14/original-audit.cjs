// Read-only numerical audit. Executes functions extracted from the reviewed HTML.
// Run from the repository: node docs/verification/2026-10-14/original-audit.cjs .
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');
const REVIEW_COMMIT = '0006c3b01c92ccf85b07e8fc63adc66197a53149';
const root = process.argv[2] || path.resolve(__dirname, '../../..');
if (!root) throw new Error('Provide the repository directory.');
const results = {reviewedCommit: REVIEW_COMMIT};
function source(file) { return execFileSync('git', ['show', REVIEW_COMMIT + ':docs/' + file], {cwd:root,encoding:'utf8'}); }
function fn(src, name) {
  const match = src.match(new RegExp('^    function ' + name + '\\([^]*?^    }', 'm'));
  if (!match) throw new Error('Missing function: ' + name);
  return match[0];
}
function constant(src, name) {
  const match = src.match(new RegExp('^    const ' + name + ' = [^]*?;\\s*$', 'm'));
  if (!match) throw new Error('Missing constant: ' + name);
  return match[0];
}
function model(src, constants, functions, stateCode) {
  const context = vm.createContext({ Math, Number, Set, Map, Array });
  vm.runInContext(constants.map(n => constant(src, n)).join('\n') + '\n' + stateCode + '\n' + functions.map(n => fn(src,n)).join('\n'), context);
  return code => vm.runInContext(code, context);
}
function near(a,b,tol=1e-9) { assert.ok(Math.abs(a-b) < tol, `${a} != ${b}`); }
function rot(v, axis, angle) {
  const n = Math.hypot(...axis), k = axis.map(a=>a/n), c=Math.cos(angle), s=Math.sin(angle);
  const cross = [k[1]*v[2]-k[2]*v[1], k[2]*v[0]-k[0]*v[2], k[0]*v[1]-k[1]*v[0]];
  const dot=k.reduce((sum,a,i)=>sum+a*v[i],0);
  return v.map((a,i)=>a*c+cross[i]*s+k[i]*dot*(1-c));
}
function referenceLarmorRk4(f1,delta,duration) {
  // The positive-gamma proton field co-rotates clockwise viewed from +z.
  const n=20000,h=duration/n;
  const deriv=(t,m)=>{
    const bx=f1*Math.cos(-2*Math.PI*delta*t),by=f1*Math.sin(-2*Math.PI*delta*t);
    return [-m[2]*by,m[2]*bx,m[0]*by-m[1]*bx].map(x=>2*Math.PI*x);
  };
  const step=(m,k,f)=>m.map((v,i)=>v+k[i]*f);
  let m=[0,0,1];
  for(let i=0;i<n;i++) {
    const t=i*h,k1=deriv(t,m),k2=deriv(t+h/2,step(m,k1,h/2)),k3=deriv(t+h/2,step(m,k2,h/2)),k4=deriv(t+h,step(m,k3,h));
    m=m.map((v,j)=>v+h*(k1[j]+2*k2[j]+2*k3[j]+k4[j])/6);
  }
  return m;
}
const rfSrc = source('proton_spin_rf_larmor_resonance.html');
const rf = model(rfSrc, ['PROTON_GAMMA_MHZ_T','HZ_PER_MICRO_T','TWO_PI','DEFAULT_B0_T','DMDT_DISPLAY_SECONDS','EPS'],
 ['v','add','sub','mul','dot','cross','length','normalize','clamp','rotateAroundAxis','rotateZ','physicsAt'],
 'const state={b0:1.5,b1MicroT:8,detuneHz:0,flipDeg:180,frameMode:"rf"};');
results.basics = {f0_1_5T_MHz:42.57747892*1.5,f0_3T_MHz:42.57747892*3,t90_10uT_ms:1000/(4*42.57747892*10)};
results.resonantRotations = [90,180,360].map(deg=> {
  rf(`state.detuneHz=0; state.flipDeg=${deg};`);
  const p = rf('physicsAt(physicsAt(0).pulseDurationS)');
  near(p.m.x,0); near(p.m.y,Math.sin(deg*Math.PI/180)); near(p.m.z,Math.cos(deg*Math.PI/180));
  return {deg,m:p.m,passed:true};
});
rf('state.detuneHz=1000; state.flipDeg=180;');
const p = rf('physicsAt(physicsAt(0).pulseDurationS)');
const expectedRf = rot([0,0,1],[p.f1Hz,0,-p.detuneHz],-2*Math.PI*p.effHz*p.pulseDurationS);
results.rfOffset = {definition:'delta=fRF-f0, dM/dt=gamma M cross B, gamma>0',deltaHz:1000,implementationAxis:p.axisRf,expectedAxisZ:-p.axisRf.z,implementationM:p.m,expectedM:expectedRf};
near(p.m.z,expectedRf[2]); near(p.m.y,expectedRf[1]); near(p.m.x,-expectedRf[0]);
const referenceLarmor=referenceLarmorRk4(p.f1Hz,1000,p.pulseDurationS);
const expectedLarmor=rot(expectedRf,[0,0,1],-2*Math.PI*1000*p.pulseDurationS);
expectedLarmor.forEach((v,i)=>near(v,referenceLarmor[i],1e-10));
rf('state.frameMode="larmor";');
results.rfOffset.larmor={implementationM:rf('physicsAt(physicsAt(0).pulseDurationS).m'),referenceRk4:referenceLarmor,maxAnalyticVsRk4Error:Math.max(...expectedLarmor.map((v,i)=>Math.abs(v-referenceLarmor[i])))};

const mrSrc = source('proton_spin_mr_simulation.html');
const mr = model(mrSrc,['PROTON_GAMMA_MHZ_T','PROTON_GAMMA_RAD_T_S','MIN_VISUAL_SECONDS','MAX_VISUAL_SECONDS','CHEMICAL_SHIFT_PPM','MAX_VECTOR_LENGTH','colors'],
 ['v','add','mul','length','clamp','vectorFromRatios','chemicalShiftHz','spinEchoSignal','chemicalSignalAtTE','sequenceDurationMs','sequenceState','physics'],
 'const state={b0:3,b1MicroT:1,targetDeg:90,timeScale:1200,currentDeg:90,phaseRad:0,freeMs:0,mode:"rf",rfActive:true,running:false,activeEvent:"",trMs:500,teMs:15,t1Ms:900,t2Ms:80,offResHz:120,fatFraction:0.4,sequenceMode:"t1w",sequenceElapsedMs:0,sequenceDurationMs:500};');
let q=mr('physics()');
const effectiveHz=Math.hypot(q.nutationHz,120);
const expectedOff = rot([0,0,1],[q.nutationHz,0,120],-2*Math.PI*effectiveHz*q.durationS);
results.mrOffResonance = {b1_uT:1,deltaHz:120,pulseDurationMs:q.durationS*1000,implementation:{mz:q.mzRatio,mxy:q.mxyMagnitudeRatio},expected:{mz:expectedOff[2],mxy:Math.hypot(expectedOff[0],expectedOff[1]),tiltDeg:Math.acos(expectedOff[2])*180/Math.PI}};
mr('state.targetDeg=270; state.currentDeg=270; state.offResHz=0;');
q=mr('physics()');
results.mxyMagnitude = {flipDeg:270,reported:q.mxyRatio,actualMagnitude:q.mxyMagnitudeRatio};
mr('state.sequenceMode="t1w";state.offResHz=35;state.teMs=15;state.t1Ms=900;state.t2Ms=80;');
const phaseTimes = [7.499,7.5,7.501].map(after=>{mr(`state.sequenceElapsedMs=${after+4}`); const s=mr('sequenceState({m0Scene:1})');return {afterMs:after,phaseRad:s.phaseRad,mz:s.mzRatio,mxy:s.mxyRatio};});
results.spinEcho = {valuesNearRefocusing:phaseTimes,phaseSlopeBefore: (phaseTimes[1].phaseRad-phaseTimes[0].phaseRad)/0.001,phaseSlopeAfter:(phaseTimes[2].phaseRad-phaseTimes[1].phaseRad)/0.001,amplitudes:[0,7.5,15,20].map(after=>{mr(`state.sequenceElapsedMs=${after+4}`);return {afterMs:after,...mr('sequenceState({m0Scene:1})')};}),timelineTE_ms:15,implementedEchoAtSequenceTime_ms:19};
results.spinEcho.referenceEnsemble=[0,7.5,15,20].map(tMs=>{
  const priorMz=1-Math.exp(-500/900),tau=7.5;
  const vectors=[-80,-40,0,40,80].map(df=>{
    let m=rot([0,priorMz,0],[0,0,1],-2*Math.PI*df*Math.min(tMs,tau)/1000);
    if(tMs>=tau) {m=rot(m,[1,0,0],-Math.PI);m=rot(m,[0,0,1],-2*Math.PI*df*(tMs-tau)/1000);}
    return m.map(x=>x*Math.exp(-tMs/80));
  });
  const sum=vectors.reduce((a,b)=>a.map((v,i)=>v+b[i]/5),[0,0,0]);
  return {tMs,netTransverse:Math.hypot(sum[0],sum[1]),sum};
});
mr('state.sequenceMode="chemical";state.b0=3;state.trMs=120;state.teMs=2.3;state.t1Ms=900;state.t2Ms=70;state.fatFraction=0.4;state.offResHz=0;state.sequenceElapsedMs=2.3;');
let s=mr('sequenceState({m0Scene:1})');
results.chemical = {atTimelineTE:{tMs:2.3,event:s.event,rfActive:s.rfActive,mxy:s.mxyRatio,signalEstimate:s.signal},priorMz:1-Math.exp(-120/900)};
mr('state.sequenceElapsedMs=6.3;');
s=mr('sequenceState({m0Scene:1})');
results.chemical.atImplementedTE={tMs:6.3,event:s.event,mxy:s.mxyRatio,signalEstimate:s.signal,ratio:s.signal/s.mxyRatio};
mr('state.b1MicroT=30;state.targetDeg=90;state.currentDeg=90;state.timeScale=1000;state.mode="rf";');
q=mr('physics()');
results.playbackScale={requestedScale:1000,pulseDurationMs:q.durationS*1000,actualVisualSeconds:q.visualDuration,effectiveScale:q.visualDuration/q.durationS,sequenceRFPulseFixedMs:4};

const encSrc = source('frequency_phase_encoding_visualization.html');
const enc = model(encSrc,['TWO_PI','GRID_SIZE','HALF','CYCLE_SECONDS','TIME_EPSILON','SCRUB_TICKS_PER_SECOND','KSPACE_INDEXES','fillOrders','samplingPatterns','defaults'],
 ['clamp','degToRad','densityFor','spinCells','acquisitionOrder','acquisitionDuration','rawKspaceValue','kspaceMatrix','currentLineSampleCount','totalAcquiredSampleCount','totalKspaceSampleCount','targetSampleCount','acquiredKspaceSamples','reconstructedImage','currentFrame','formatSigned','phaseAt','decayAt','signalAt'],
 'const state={...defaults};');
const fullFrame='{stage:"complete",completedLines:5,order:acquisitionOrder(),readoutActive:false,ky:2}';
results.fourierIdentity=[];
for (const pattern of ['center','uniform','diagonal','bars','spot']) {
 enc(`state.objectPattern="${pattern}";state.samplingPattern="full";`);
 const err=enc(`Math.max(...reconstructedImage(${fullFrame}).pixels.map(pixel=>Math.abs(pixel.value-densityFor(pixel.x,pixel.y))))`);
 near(err,0,1e-12);
 results.fourierIdentity.push({pattern,maxError:err,passed:true});
}
enc('state.objectPattern="center";state.fillOrder="centric";state.elapsed=2.2;');
let frame=enc('currentFrame()');
const sig=enc('signalAt(currentFrame())'), k=enc('rawKspaceValue(-2,0)');
results.encodingStart={displayKx:-2,actualUnprephasedKx:0,ky:frame.ky,signal:sig,displayedK:{re:k.real/k.totalDensity,im:k.imaginary/k.totalDensity,mag:k.magnitude/k.totalDensity}};
const original=enc(`reconstructedImage(${fullFrame}).pixels.map(p=>p.value)`);
const baselineMatrix=enc('kspaceMatrix().samples.map(p=>[p.real,p.imaginary])');
enc('state.phaseDegPerRow=0;state.frequencyHzPerCol=60;state.readoutMs=160;state.t2starMs=50;');
const changed=enc(`reconstructedImage(${fullFrame}).pixels.map(p=>p.value)`);
const changedMatrix=enc('kspaceMatrix().samples.map(p=>[p.real,p.imaginary])');
near(Math.max(...original.map((x,i)=>Math.abs(x-changed[i]))),0);
results.encodingControls={parameters:{phaseDegPerRow:0,frequencyHzPerCol:60,readoutMs:160,t2starMs:50},maxReconChange:Math.max(...original.map((x,i)=>Math.abs(x-changed[i]))),maxKChange:Math.max(...baselineMatrix.flat().map((x,i)=>Math.abs(x-changedMatrix.flat()[i]))),fullImageStillReconstructed:true};
enc('state.objectPattern="spot";state.samplingPattern="partialFourier";state.elapsed=acquisitionDuration();');
const pix=enc('reconstructedImage(currentFrame()).pixels');
results.partialFourier={maxDiscardedImaginary:Math.max(...pix.map(p=>Math.abs(p.residual))),maxDifferenceAbsRealVsMagnitude:Math.max(...pix.map(p=>Math.hypot(p.value,p.residual)-Math.abs(p.value))),example:pix.reduce((a,p)=>Math.abs(p.residual)>Math.abs(a.residual)?p:a,pix[0])};
enc('state.samplingPattern="full";state.fillOrder="centric";state.mode="phase";state.elapsed=1;');
results.phaseOnlyCentric={ky:enc('currentFrame().ky'),maxPhase:enc('Math.max(...spinCells().map(c=>Math.abs(phaseAt(c,currentFrame()))))')};

const wheelSrc=source('bicycle_wheel_precession_interactive.html');
const wheel=model(wheelSrc,['WHEEL_RADIUS_M','SPIN_ZERO_THRESHOLD'],['wheelInertia','spinAngularSpeed','spinDirection','angularMomentumMagnitude','isPendulumMode','currentGravity','weightMagnitude','leverFactorForCurrentPose','torqueMagnitude','pendulumInertia'],
 'const EARTH_GRAVITY=9.81;const state={mass:1.5,distance:0.4,gravityScale:1,spinSpeed:7,droop:0};');
const spinRates=[7,1,15].map(omega=>{wheel(`state.spinSpeed=${omega}`); const om=wheel('torqueMagnitude()/angularMomentumMagnitude()');return {omega,precession:om,precessionToSpin:om/omega,pendulumMode:wheel('isPendulumMode()')};});
const pointInertia=wheel('pendulumInertia()');
const hoopPivot=pointInertia+1.5*0.35**2/2;
results.wheel={spinRates,pointMassPivotInertia:pointInertia,thinHoopPivotInertia:hoopPivot,pendulumPeriodRatioHoopVsPoint:Math.sqrt(hoopPivot/pointInertia),drawnRadiusMeters:0.28/2,modelRadiusMeters:0.35};
const output=path.join(__dirname,'numerical-results.json');
fs.writeFileSync(output,JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({reviewedCommit:REVIEW_COMMIT,referenceChecks:'passed',resultsFile:output,rfOffsetSignMismatch:true,encodingMaxKChange:results.encodingControls.maxKChange,chemicalSignalRatio:results.chemical.atImplementedTE.ratio},null,2));
