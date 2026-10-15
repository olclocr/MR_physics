const {test}=require('node:test'),assert=require('node:assert/strict');
const P=require('../docs/assets/mr-physics-models.js'),R=require('./helpers/spin-reference.cjs');
const {loadSpinPage}=require('./helpers/spin-page-harness.cjs');
const error=(a,b)=>Math.max(...['x','y','z'].map(k=>Math.abs(a[k]-b[k])));
test('finite RF, RF-to-free continuity and T1/T2 landmarks agree with independent equations',()=>{
  const page=loadSpinPage();
  for(const b1MicroT of [1,10,30])for(const offResHz of [-120,0,120])for(const angleDeg of [0,90,180,270,360])for(const [t1Ms,t2Ms] of [[200,20],[900,80],[2500,500]]) {
    const o={b1MicroT,offResHz,angleDeg,t1Ms,t2Ms},ref=R.finiteRF(o);
    const actual=P.hardPulse({x:0,y:0,z:1},{...o,durationMs:ref.durationMs});
    assert.ok(error(actual,ref.m)<2e-5,JSON.stringify(o));
    for(const t of [0,t2Ms,t1Ms,5000])assert.ok(error(P.free(actual,t,offResHz,t1Ms,t2Ms),R.free(actual,t,offResHz,t1Ms,t2Ms))<1e-12);
    page.run(`Object.assign(state,${JSON.stringify({...o,targetDeg:angleDeg,currentDeg:angleDeg,mode:'rf'})});`);
    const end=page.run('physics().m');page.run('state.mode="free";state.freeMs=0;');
    assert.ok(error(end,page.run('physics().m'))<1e-12);
  }
});
test('SE vectors, 180-degree limits and TE/TR clocks agree with independent complex phases',()=>{
  for(const [trMs,teMs] of [[100,99],[500,15],[3000,100],[5000,300]])for(const spreadHz of [0,35,100])for(const offResHz of [-120,0,120]) {
    const o={trMs,teMs,t1Ms:900,t2Ms:80,spreadHz,offResHz};
    for(const t of [0,teMs/2-1e-8,teMs/2,teMs,Math.min(trMs,teMs+1),trMs]) {
      const a=P.spinEcho(o,t),b=R.echo(o,t);assert.ok(error(a.m,b.m)<1e-11);
      a.members.forEach((x,i)=>assert.ok(error(x.m,b.members[i].m)<1e-11));
      if(t===teMs)assert.ok(Math.abs(a.signal-Math.abs(b.initialMz)*Math.exp(-teMs/o.t2Ms))<1e-12);
    }
  }
});
test('single-peak water/fat vectors, IP/OP times and limiting fractions agree independently',()=>{
  for(const b0 of [1.5,3])for(const fatFraction of [0,.4,.5,1])for(const offResHz of [-120,0,120]) {
    const o={b0,fatFraction,offResHz,trMs:120,t1Ms:900,t2Ms:70},shift=R.GAMMA*b0*3.5;
    for(const t of [0,500/shift,1000/shift,2.3,4.6,120]) {
      const a=P.chemical(o,t),b=R.chemical(o,t);assert.ok(error(a.m,b.m)<1e-11);
      a.species.forEach((x,i)=>assert.ok(error(x.m,b.species[i].m)<1e-11));
      if(fatFraction===.5 && t===500/shift)assert.ok(a.signal<1e-14);
    }
  }
});
test('guided observations, custom scrub, pause and reset retain the intended clock and controls',()=>{
  const page=loadSpinPage(),e=page.elements;
  e.observeRF.fire('click');const initial=page.run('physics()');assert.equal(page.run('state.mode'),'free');assert.equal(page.run('state.freeMs'),0);
  page.run('tick(1000);tick(1100);');assert.equal(page.run('state.freeMs'),0);
  e.observeFree.fire('click');assert.equal(page.run('state.freeMs'),80);assert.ok(Math.abs(page.run('physics().signal')/initial.signal-Math.exp(-1))<1e-12);
  e.sequenceScrub.value='900';e.sequenceScrub.fire('input');assert.equal(page.run('state.freeMs'),900);
  e.pauseSequence.fire('click');page.run('tick(1200);');assert.ok(page.run('state.freeMs')>900);
  e.resetPulse.fire('click');assert.equal(page.run('state.sequencePaused'),false);assert.equal(page.run('state.mode'),'idle');
  e.observeEcho.fire('click');assert.equal(page.run('state.sequenceElapsedMs'),100);assert.equal(e.b1Control.disabled,true);assert.equal(e.fatControl.disabled,true);
  assert.ok(Math.abs(page.run('physics().signal-physics().teSignal'))<1e-12);assert.equal(page.run('physics().rfActive'),false);
  e.quizWrong.fire('click');assert.match(e.quizFeedback.textContent,/T2/);e.quizCorrect.fire('click');assert.match(e.quizFeedback.textContent,/정적/);
});
