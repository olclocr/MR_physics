const {test}=require('node:test');
const assert=require('node:assert/strict');
const {solveRF}=require('./helpers/rf-reference.cjs');
const {loadRFPage}=require('./helpers/rf-page-harness.cjs');
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
test('RF ON/OFF and both frames agree with independent time-dependent Bloch integration over the lesson range',()=>{
  const page=loadRFPage();
  for(const detuneHz of [-2000,-1000,0,1000,2000])for(const b1MicroT of [3,8,30])for(const flipDeg of [0,90,180,360])for(const rfEnabled of [false,true]) {
    const input={detuneHz,b1MicroT,flipDeg,rfEnabled},reference=solveRF(input);
    page.run(`Object.assign(state,${JSON.stringify(input)});`);
    for(const frame of ['larmor','rf']) {
      page.run(`state.frameMode=${JSON.stringify(frame)};`);
      const p=page.run('physicsAt(physicsAt(0).pulseDurationS)');
      assert.ok(distance(p.m,reference[frame])<=1e-8,JSON.stringify({...input,frame}));
      assert.ok(Math.abs(Math.hypot(p.m.x,p.m.y,p.m.z)-1)<=1e-10);
      assert.ok(Math.abs(p.pulseDurationS-reference.durationS)<1e-14);
      if(!rfEnabled) {assert.equal(p.f1Hz,0);assert.ok(distance(p.m,{x:0,y:0,z:1})<1e-12);assert.equal(p.dmdtRatePerSecond,0);}
    }
  }
});
test('normalized readout and RF OFF log distinguish applied amplitude from the reference pulse duration',()=>{
  const page=loadRFPage(),e=page.elements;
  for(const b0 of [.5,1.5,3]) {
    page.run(`state.b0=${b0};state.pulseTime=physicsAt(0).pulseDurationS;updateUI();`);
    assert.equal(e.magMetric.textContent,'-1.000 / 0.000');
  }
  e.rfOffControl.checked=true;e.rfOffControl.fire('change');
  page.run('beginVerificationLog();state.pulseTime=physicsAt(0).pulseDurationS;state.completed=true;updateUI();finishVerificationLog("completed");');
  assert.equal(e.magMetric.textContent,'1.000 / 0.000');
  assert.match(e.learningReadout.textContent,/RF OFF/);
  assert.equal(page.run('state.verificationLog.conditions.appliedB1_microT'),0);
  assert.equal(page.run('state.verificationLog.checks.formulaChecks.plannedFlipMinusRequested_deg'),null);
});
