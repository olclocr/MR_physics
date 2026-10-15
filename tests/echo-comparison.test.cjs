const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const M=require('../docs/assets/echo-comparison-model.js'),{reference}=require('./helpers/echo-reference.cjs'),{loadEchoPage}=require('./helpers/echo-page-harness.cjs');
const near=(a,b,t=1e-11)=>assert.ok(Math.abs(a-b)<=t,`${a} != ${b}`);
test('time-ordered SE/GRE agree with independent complex phases before, at and after refocusing',()=>{
  for(const teMs of [10,40,80])for(const t2Ms of [20,80,200])for(const gradientHz of [0,20,40])for(const balance of [0,.6,1,2])for(const offResHz of [-80,0,80])for(const spreadHz of [0,35,60])for(const mode of ['se','gre']) {
    const o={mode,teMs,t2Ms,gradientHz,balance,offResHz,spreadHz};
    for(const t of [0,teMs/4,teMs/2-1e-8,teMs/2,teMs,1.25*teMs,1.5*teMs]) {
      const a=M.calculate(o,t),b=reference(o,t);near(a.m.x,b.m.x);near(a.m.y,b.m.y);near(a.magnitude,b.magnitude);
      a.members.forEach((m,i)=>{near(m.m.x,b.members[i].m.x);near(m.m.y,b.members[i].m.y);});
      assert.ok(a.magnitude<=a.t2Envelope+1e-12);
    }
  }
});
test('balanced SE refocuses all static offsets, while a common GRE offset only rotates phase',()=>{
  for(const offResHz of [-80,0,80])for(const spreadHz of [0,35,60]) {
    const o={...M.defaults,offResHz,spreadHz};const a=M.calculate(o,40);
    near(a.magnitude,Math.exp(-.5),1e-12);near(a.m.x,0);near(a.m.y,-Math.exp(-.5));
    near(a.physicalArea,.8);near(a.effectiveArea,0);
  }
  for(const t of [0,10,20,40,60])for(const offset of [-80,35,80]) {
    const a=M.calculate({...M.defaults,mode:'gre'},t),b=M.calculate({...M.defaults,mode:'gre',offResHz:offset},t);
    near(a.magnitude,b.magnitude,1e-12);
  }
  const se=M.calculate({...M.defaults,spreadHz:35},40),gre=M.calculate({...M.defaults,mode:'gre',spreadHz:35},40);assert.ok(se.magnitude>gre.magnitude+.5);
  const unbalanced=M.calculate({...M.defaults,balance:.6},40);near(unbalanced.gradientNullMs,20*(1+1/.6));assert.ok(Math.abs(unbalanced.effectiveArea)>.1);
  assert.equal(M.calculate({...M.defaults,gradientHz:0},40).gradientNullMs,null);assert.equal(M.calculate({...M.defaults,balance:0},40).gradientNullMs,null);
});
test('180-degree right limit conjugates transverse vectors and T2 loss remains after refocusing',()=>{
  const o={...M.defaults,spreadHz:35,offResHz:20};
  const before=reference({...o,mode:'gre',gradientHz:-o.gradientHz},20); // GRE formula with opposite gradient reproduces SE first half.
  const after=M.calculate(o,20);
  after.members.forEach((a,i)=>{near(a.m.x,before.members[i].m.x);near(a.m.y,-before.members[i].m.y);});
  const a=M.calculate(o,40);assert.ok(a.magnitude<1);near(a.magnitude,Math.exp(-40/80));
  for(const bad of [{teMs:0},{t2Ms:0},{balance:-1},{mode:'x'},{offResHz:NaN}])assert.throws(()=>M.calculate({...M.defaults,...bad},40),RangeError);
});
test('observations, controls, time boundaries, responsive SVGs and quizzes keep the same physical state',()=>{
  const page=loadEchoPage(),e=page.elements;assert.equal(e.signalOutput.textContent,'0.6065');
  e.exampleSpread.fire('click');assert.equal(page.run('state.mode'),'gre');assert.ok(Number(e.greSignal.textContent)<.1);assert.equal(e.seSignal.textContent,'0.6065');
  e.seMode.fire('click');assert.equal(e.signalOutput.textContent,'0.6065');
  e.exampleUnbalanced.fire('click');assert.match(e.areaZeroOutput.textContent,/53.33/);e.beforeRF.fire('click');near(page.run('state.timeMs'),19.9);e.afterRF.fire('click');near(page.run('state.timeMs'),20);
  e.timeControl.value='60';e.timeControl.fire('input');e.teControl.value='10';e.teControl.fire('input');near(page.run('state.timeMs'),15);
  e.quizEchoWrong.fire('click');assert.match(e.quizEchoFeedback.textContent,/T2/);e.quizEchoCorrect.fire('click');assert.match(e.quizEchoFeedback.textContent,/맞습니다/);
  e.quizOffsetCorrect.fire('click');assert.match(e.quizOffsetFeedback.textContent,/위상 인자/);e.quizOffsetWrong.fire('click');assert.match(e.quizOffsetFeedback.textContent,/차이/);
  page.run('window.innerWidth=390;render();');assert.match(e.vectorGraphic.attributes.viewBox,/360 425/);assert.match(e.signalGraphic.attributes.viewBox,/^0 0 360 /);
  e.reset.fire('click');assert.equal(page.run('state.timeMs'),40);assert.equal(page.run('state.spreadHz'),0);assert.match(e.quizEchoFeedback.textContent,/답을 선택/);
  const ids=[...page.html.matchAll(/<[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
  for(const [,id]of page.html.matchAll(/\bfor="([^"]+)"/g))assert.ok(ids.includes(id));
  for(const [,url]of page.html.matchAll(/(?:href|src)="([^"]+)"/g))if(!/^https?:|^#/.test(url))assert.ok(fs.existsSync(path.resolve(__dirname,'../docs',url)),url);
});
