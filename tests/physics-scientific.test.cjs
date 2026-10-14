// node --test tests/physics-scientific.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const P = require('../docs/assets/mr-physics-models.js');
const docs = path.resolve(__dirname, '../docs');
const near = (a, b, eps = 1e-10) => assert.ok(Math.abs(a - b) <= eps, `${a} != ${b}`);
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);

function loadPage(filename, width = 1400) {
  const html = fs.readFileSync(path.join(docs, filename), 'utf8');
  const ctx = new Proxy({}, { get(target,key) {
    if (key in target) return target[key];
    if (key === 'measureText') return text => ({width:String(text).length*7});
    return (...args) => { for (const arg of args) if (typeof arg === 'number') assert.ok(Number.isFinite(arg), `canvas ${key}`); };
  }});
  function element(attrs='') {
    return { value: attrs.match(/value="([^"]*)"/)?.[1] || '', checked: /\bchecked\b/.test(attrs),
      clientWidth:width,clientHeight:1000,width,height:1000,style:{},dataset:{},textContent:'',innerHTML:'',
      classList:{toggle(){},add(){},remove(){}}, addEventListener(){},appendChild(){},setAttribute(){},
      querySelector(){return element();},getContext(){return ctx;},getBoundingClientRect(){return {width,height:1000};} };
  }
  const elements={};
  for(const match of html.matchAll(/<[^>]*\bid="([^"]+)"[^>]*>/g)) elements[match[1]]=element(match[0]);
  for(const match of html.matchAll(/<select[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
    elements[match[1]].value=match[2].match(/<option[^>]*value="([^"]+)"/)?.[1] || '';
  }
  const buttons=[];
  for(const match of html.matchAll(/<button[^>]*data-(mode|frame-mode)="([^"]+)"[^>]*>/g)) {
    const el=element();el.dataset[match[1]==='mode'?'mode':'frameMode']=match[2];buttons.push(el);
  }
  const sandbox=vm.createContext({MRPhysics:P,document:{getElementById(id){assert.ok(elements[id],id);return elements[id];},
    querySelectorAll(selector){return buttons.filter(b=>selector==='[data-mode]'?b.dataset.mode:b.dataset.frameMode);},createElement(){return element();}},
    window:{devicePixelRatio:2,addEventListener(){}},requestAnimationFrame(){},navigator:{},Date,Blob,URL});
  for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    new vm.Script(match[1],{filename});vm.runInContext(match[1],sandbox,{filename});
  }
  return {run:code=>vm.runInContext(code,sandbox),elements,html};
}

function rk4(initial, durationMs, derivative, count=12000) {
  let m={...initial};const h=durationMs/count;
  const advance=(a,k,s)=>P.add(a,P.scale(k,s));
  for(let i=0;i<count;i++) {
    const t=i*h,k1=derivative(t,m),k2=derivative(t+h/2,advance(m,k1,h/2));
    const k3=derivative(t+h/2,advance(m,k2,h/2)),k4=derivative(t+h,advance(m,k3,h));
    m=P.add(m,P.scale(P.add(P.add(k1,P.scale(k2,2)),P.add(P.scale(k3,2),k4)),h/6));
  }
  return m;
}

test('all four corrected HTML pages initialize and draw with finite canvas coordinates',()=>{
  for(const file of ['proton_spin_rf_larmor_resonance.html','proton_spin_mr_simulation.html','frequency_phase_encoding_visualization.html','bicycle_wheel_precession_interactive.html']) {
    for(const width of [1400,390]) loadPage(file,width);
  }
});
test('RF offset signs and both frames agree with independent time-dependent Bloch integration',()=>{
  const page=loadPage('proton_spin_rf_larmor_resonance.html');
  for(const delta of [-1000,0,1000]) for(const angle of [90,180,360]) {
    const duration=P.pulseDurationMs(angle,8),f1=P.GAMMA_HZ_PER_UT*8;
    const reference=rk4(P.v(0,0,1),duration,(t,m)=>{
      const phase=-2*Math.PI*delta*t/1000,bx=f1*Math.cos(phase),by=f1*Math.sin(phase);
      return P.scale(P.v(-m.z*by,m.z*bx,m.x*by-m.y*bx),2*Math.PI/1000);
    });
    page.run(`state.detuneHz=${delta};state.flipDeg=${angle};state.frameMode="larmor";`);
    const actual=page.run('physicsAt(physicsAt(0).pulseDurationS)');
    assert.ok(distance(actual.m,reference)<1e-10);
    near(P.norm(actual.m),1);
    page.run('state.frameMode="rf";');
    const rf=page.run('physicsAt(physicsAt(0).pulseDurationS)');
    assert.ok(distance(P.rotate(rf.m,P.v(0,0,1),-2*Math.PI*delta*duration/1000),reference)<1e-10);
    if(delta) assert.equal(Math.sign(rf.axisRf.z),-Math.sign(delta));
  }
});
test('finite RF includes off resonance and relaxation, rather than forcing nominal flip',()=>{
  const duration=P.pulseDurationMs(90,1),f1=P.GAMMA_HZ_PER_UT;
  const reference=rk4(P.v(0,0,1),duration,(t,m)=>P.v(
    2*Math.PI/1000*m.y*120-m.x/80,
    2*Math.PI/1000*(m.z*f1-m.x*120)-m.y/80,
    -2*Math.PI/1000*m.y*f1+(1-m.z)/900));
  const actual=P.hardPulse(P.v(0,0,1),{b1MicroT:1,offResHz:120,durationMs:duration,t1Ms:900,t2Ms:80});
  assert.ok(distance(actual,reference)<2e-6);
  const page=loadPage('proton_spin_mr_simulation.html');
  page.run('state.mode="rf";state.b1MicroT=1;state.offResHz=120;state.targetDeg=90;state.currentDeg=90;');
  const p=page.run('physics()');
  assert.ok(p.mzRatio>.85 && p.mxyRatio<.5 && p.actualTiltDeg<30);
  page.run('state.mode="free";state.freeMs=0;');
  assert.ok(distance(page.run('physics().m'),p.m)<1e-12,'RF-to-free continuity');
});
test('refocusing rotates Mz and transverse components while retaining each frequency',()=>{
  const options={trMs:500,teMs:15,t1Ms:900,t2Ms:80,offResHz:35,spreadHz:35};
  const before=P.spinEcho(options,7.5-1e-8),after=P.spinEcho(options,7.5);
  for(let i=0;i<before.members.length;i++) {
    const a=before.members[i],b=after.members[i];
    assert.equal(a.hz,b.hz);
    near(b.m.x,a.m.x,1e-8);near(b.m.y,-a.m.y,1e-8);near(b.m.z,-a.m.z,1e-8);
  }
  const echo=P.spinEcho(options,15);
  near(echo.signal,echo.echoSignal);
  assert.ok(echo.signal>P.spinEcho(options,7.5).signal);
  assert.ok(echo.m.y<0,'x refocusing produces -y echo');
  near(P.spinEcho(options,500).m.z,P.spinEchoInitialMz(500,15,900));
  const a=P.spinEcho(options,8).members[6],b=P.spinEcho(options,8.001).members[6];
  near((Math.atan2(b.m.y,b.m.x)-Math.atan2(a.m.y,a.m.x))/.001,-2*Math.PI*a.hz/1000,1e-9);
});
test('TE timeline and chemical signal use the same pulse-center clock and normalization',()=>{
  const page=loadPage('proton_spin_mr_simulation.html');
  page.run('state.mode="sequence";state.sequenceMode="chemical";state.trMs=120;state.teMs=2.3;state.t1Ms=900;state.t2Ms=70;state.sequenceElapsedMs=2.3;state.sequenceDurationMs=120;');
  const p=page.run('physics()');
  assert.match(p.event,/TE water\/fat/);assert.equal(p.rfActive,false);near(p.signal,p.teSignal);
  const expected=(1-Math.exp(-120/900))*Math.exp(-2.3/70)*Math.hypot(.6+.4*Math.cos(2*Math.PI*42.57747892*3*3.5*2.3/1000),.4*Math.sin(2*Math.PI*42.57747892*3*3.5*2.3/1000));
  near(p.signal,expected);
  page.run('state.sequenceMode="t1w";state.teMs=15;state.trMs=500;state.sequenceElapsedMs=15;state.sequenceDurationMs=500;');
  assert.match(page.run('physics().event'),/spin echo at TE/);
  near(page.run('physics().signal'),page.run('physics().teSignal'));
});
test('Mxy magnitude and current direction remain meaningful after 270 degrees and relaxation',()=>{
  const page=loadPage('proton_spin_mr_simulation.html');
  page.run('state.mode="rf";state.offResHz=0;state.targetDeg=270;state.currentDeg=270;updateUI();');
  assert.ok(page.run('physics().mxyRatio')>0);
  assert.ok(Number(page.elements.mxyMetric.textContent)>0);
  page.run('state.mode="free";state.freeMs=3000;updateUI();');
  assert.ok(page.run('physics().actualTiltDeg')<1);
  page.run('state.b1MicroT=30;state.targetDeg=90;state.timeScale=1000;');
  near(page.run('physics().effectiveScale'),2810.11360872,1e-7);
});
test('sequence observation control reaches exact TE and stays paused without advancing physical time',()=>{
  const page=loadPage('proton_spin_mr_simulation.html');
  page.run('controls.sequenceMode.value="chemical";applyPresetForMode();controls.sequenceScrub.value="2.3";scrubSequence();');
  near(page.run('state.sequenceElapsedMs'),2.3);
  assert.match(page.run('physics().event'),/TE water\/fat readout/);
  near(page.run('physics().signal'),page.run('physics().teSignal'));
  page.run('tick(1000);tick(1100);');near(page.run('state.sequenceElapsedMs'),2.3);
  assert.equal(page.run('state.sequencePaused'),true);
});
test('every stored ADC value equals the displayed complex signal at that time',()=>{
  const page=loadPage('frequency_phase_encoding_visualization.html');
  for(const phase of [0,42,72,144]) for(const t2 of [50,180,600]) {
    page.run(`state.objectPattern="spot";state.phaseDegPerRow=${phase};state.t2starMs=${t2};`);
    for(const ky of [-2,0,2]) for(const kx of [-2,-1,0,1,2]) {
      const r=page.run(`(()=>{const p=(${kx}+2)/4,s=rawKspaceValue(${kx},${ky}),f={stage:"readout",ky:${ky},phaseProgress:1,readoutProgress:p};return {s,q:signalAt(f,p),phase:phaseAt(spinCells()[0],f,p)};})()`);
      near(r.s.real/r.s.totalDensity,r.q.real);near(r.s.imaginary/r.s.totalDensity,r.q.imaginary);
      near(r.s.magnitude/r.s.totalDensity,r.q.magnitude);
    }
  }
  page.run('state.phaseDegPerRow=72;state.fillOrder="centric";state.elapsed=2.2;');
  near(page.run('MRPhysics.encodingTrajectory(state,currentFrame()).kx'),-2);
});
test('Gy=0 loses y information and cannot generate a full 2D reconstruction',()=>{
  const page=loadPage('frequency_phase_encoding_visualization.html');
  page.run('state.phaseDegPerRow=0;state.elapsed=acquisitionDuration();updateUI();');
  const result=page.run('reconstructedImage(currentFrame())');
  assert.equal(result.validGrid,false);assert.equal(result.pixels.length,0);
  assert.match(page.elements.iftOutput.textContent,/y 정보 없음/);
  near(page.run('rawKspaceValue(1,-2).real'),page.run('rawKspaceValue(1,2).real'));
});
test('ideal complete DFT round trips; T2* changes acquired data; partial IFFT preserves imaginary part',()=>{
  const page=loadPage('frequency_phase_encoding_visualization.html');
  for(const pattern of ['center','uniform','diagonal','bars','spot']) {
    const err=page.run(`state.objectPattern="${pattern}";state.ignoreDecay=true;state.elapsed=acquisitionDuration();Math.max(...reconstructedImage(currentFrame()).pixels.map(p=>Math.abs(p.value-densityFor(p.x,p.y))))`);
    assert.ok(err<1e-12,pattern);
  }
  page.run('state.ignoreDecay=false;state.t2starMs=50;');
  const fast=page.run('rawKspaceValue(0,0).magnitude');
  page.run('state.t2starMs=600;');assert.ok(page.run('rawKspaceValue(0,0).magnitude')>fast);
  page.run('state.ignoreDecay=true;state.samplingPattern="partialFourier";state.elapsed=acquisitionDuration();');
  const pixels=page.run('reconstructedImage(currentFrame()).pixels');
  assert.ok(pixels.some(p=>Math.abs(p.residual)>.01));
  for(const p of pixels) near(p.magnitude,Math.hypot(p.value,p.residual));
  page.run('state.mode="phase";state.fillOrder="centric";state.phaseKy=1;state.elapsed=1;');
  assert.ok(page.run('Math.abs(phaseAt(spinCells()[0],currentFrame()))')>0);
  near(page.run('MRPhysics.encodingTrajectory(state,currentFrame()).kx'),0);
});
test('physical-pendulum hoop inertia, energy conservation, and logical-pixel camera scale',()=>{
  const page=loadPage('bicycle_wheel_precession_interactive.html');
  page.run('state.spinSpeed=0;resetPendulum();');near(page.run('pendulumInertia()'),.331875);
  const energy=()=>page.run('.5*pendulumInertia()*state.pendulumVelocity**2 + state.mass*currentGravity()*state.distance*(1-Math.cos(state.pendulumAngle))');
  const initial=energy();page.run('for(let i=0;i<2000;i++) advancePendulum(.002);');near(energy(),initial,1e-8);
  near(page.run('camera.origin.x'),1400*.42);
  near(page.run('screenProject(v(0,0,.18)).x'),1400*.42);
  near(page.run('screenProject(v(0,0,.18)).y'),1000*.57);
  assert.match(page.html,/metersToScene\(WHEEL_RADIUS_M\)/);
});
test('published report pages and simulation assets have resolvable local links',()=>{
  const report=path.join(docs,'verification/2026-10-14');
  const files=[...['index.html','proton_spin_mr_simulation.html','frequency_phase_encoding_visualization.html'].map(f=>path.join(docs,f)),
    ...['index.html','original-review.html','fix-validation.html'].map(f=>path.join(report,f))];
  for(const file of files) {
    const html=fs.readFileSync(file,'utf8');
    for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      if(/^[a-z]+:/i.test(match[1])) continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file),match[1].split('#')[0])),`${file}: ${match[1]}`);
    }
  }
});
