const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../docs/assets/mr-physics-models.js'),R=require('./helpers/encoding-reference.cjs');
const {loadEncodingPage}=require('./helpers/encoding-page-harness.cjs');
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
test('gradient-area quadrature independently matches signed k, physical time, complex ADC and normalized readout',()=>{
  const page=loadEncodingPage();
  for(const pattern of ['center','uniform','diagonal','bars','spot'])for(const o of R.parameterCases) {
    page.run(`Object.assign(state,${JSON.stringify({...o,objectPattern:pattern})});`);const cells=page.run('spinCells()');
    for(const ky of [-2,-1,0,1,2])for(const kx of [-2,-1,0,1,2]) {
      const p=(kx+2)/4,f={stage:'readout',ky,phaseProgress:1,readoutProgress:p},a=page.run(`rawKspaceValue(${kx},${ky})`),b=R.signal(cells,o,f);
      near(a.actualKx,b.kx,1e-12);near(a.actualKy,b.ky,1e-12);near(a.timeMs,b.timeMs,1e-12);near(a.real,b.real);near(a.imaginary,b.imaginary);
      const live=page.run(`signalAt(${JSON.stringify(f)})`);near(live.real,b.real/b.totalDensity,1e-12);near(live.imaginary,b.imaginary/b.totalDensity,1e-12);
    }
    for(const stage of ['excitation','phase','readout','rewind','complete'])for(const u of [0,.5,1]) {
      const f={stage,ky:-2,phaseProgress:u,readoutProgress:u};
      const a=P.encodingTrajectory(o,f),b=R.trajectory(o,f);near(a.kx,b.kx,1e-12);near(a.ky,b.ky,1e-12);near(a.timeMs,b.timeMs,1e-12);
    }
  }
});
test('all patterns, fill orders and sampling modes agree with an independent inverse complex sum',()=>{
  const page=loadEncodingPage();
  for(const objectPattern of ['center','uniform','diagonal','bars','spot'])for(const fillOrder of ['linear','centric','reverse','interleaved'])for(const samplingPattern of ['full','center3','alternate','partialFourier'])for(const ignoreDecay of [false,true]) {
    const o={...R.parameterCases[0],objectPattern,fillOrder,samplingPattern,ignoreDecay};
    page.run(`Object.assign(state,${JSON.stringify(o)});state.mode='sequence';state.elapsed=acquisitionDuration()/state.speed;`);
    const cells=page.run('spinCells()'),ks=page.run('acquiredKspaceSamples(currentFrame())');
    const independent=R.samplingRows[samplingPattern].flatMap(ky=>[-2,-1,0,1,2].map(kx=>({...R.signal(cells,o,{stage:'readout',ky,readoutProgress:(kx+2)/4}),kx,ky})));
    assert.equal(ks.length,independent.length);
    const image=page.run('reconstructedImage(currentFrame())');assert.equal(image.validGrid,true);assert.equal(ks.length,5*page.run('acquisitionOrder().length'));
    for(const pixel of image.pixels) {const b=R.inverse(independent,pixel.x,pixel.y);near(pixel.value,b.real);near(pixel.residual,b.imaginary);near(pixel.magnitude,b.magnitude);}
  }
});
test('PE labels use the physical negative phase and zero signal has no fabricated phase',()=>{
  const page=loadEncodingPage();page.elements.observePhase.fire('click');
  near(page.run('MRPhysics.encodingTrajectory(state,currentFrame()).ky'),1);near(page.run('MRPhysics.encodingTrajectory(state,currentFrame()).kx'),0);
  assert.match(page.elements.signedPhaseOutput.textContent,/-72.0/);assert.ok(page.texts.includes('-72 deg'));
  page.run('state.objectPattern="uniform";state.mode="frequency";state.elapsed=.75/.28;updateUI();');
  assert.ok(page.run('signalAt(currentFrame()).magnitude')<1e-14);assert.match(page.elements.signalPhaseOutput.textContent,/정의 안 됨/);
});
test('speed and display options preserve observation, while Gy zero and unmatched grids withhold reconstruction',()=>{
  const page=loadEncodingPage(),e=page.elements;e.observePhase.fire('click');
  const observed=page.run('state.elapsed*state.speed'),physical=page.run('MRPhysics.encodingTrajectory(state,currentFrame()).timeMs');
  e.speed.value='2.6';e.speed.fire('input');near(page.run('state.elapsed*state.speed'),observed);near(page.run('MRPhysics.encodingTrajectory(state,currentFrame()).timeMs'),physical);
  e.showPhase.checked=false;e.showPhase.fire('input');near(page.run('state.elapsed*state.speed'),observed);
  e.observeNoPhase.fire('click');assert.match(e.iftOutput.textContent,/y 정보 없음/);assert.equal(page.run('reconstructedImage(currentFrame()).pixels.length'),0);
  e.observeFull.fire('click');assert.equal(page.run('reconstructedImage(currentFrame()).pixels.length'),25);
  e.phaseDegrees.value='75';e.phaseDegrees.fire('input');assert.match(e.iftOutput.textContent,/격자 불일치/);
  e.quizYCorrect.fire('click');assert.match(e.quizYFeedback.textContent,/맞습니다/);e.quizGridCorrect.fire('click');assert.match(e.quizGridFeedback.textContent,/75\/72/);
  e.reset.fire('click');assert.equal(page.run('state.elapsed'),0);assert.equal(page.run('state.running'),false);assert.equal(page.run('state.ignoreDecay'),false);assert.match(e.quizYFeedback.textContent,/답을 선택/);
  e.scene.clientWidth=1;e.scene.clientHeight=1;page.run('resize();tick(1000);');
  e.scene.clientWidth=390;e.scene.clientHeight=1180;page.run('tick(1100);');
  assert.equal(e.scene.width,390);assert.equal(e.scene.height,1180);
});
